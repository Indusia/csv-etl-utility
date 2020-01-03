const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 7000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

var pgp = require('pg-promise')(/* options */);
//var db = pgp('postgres://username:password@host:port/database')
var db = pgp('postgres://postgres:docker@localhost:5432/sdc1');

const csv = require('csv-parser');
const fs = require('fs');
const results = [];

// //this code for uploading to product
const options = {
  skipLines: 1,
  headers: ['id', 'name', 'slogan', 'description', 'category', 'default_price']
};
console.log('  ');
console.log('csv parser');

const readCSV = function() {
  fs.createReadStream('../product.csv')
    .pipe(csv(options))
    .on('data', (data) => {
      results.push(data);
    })

    .on('end', () => {
      console.log('finished collecting results');
      console.log('starting insertion to db');
      asynchLoop(results);
    });
};

let count = 0;

const asynchLoop = function(results) {
  if (count > results.length - 1) {
    console.log('reached end of data.');
    console.log(`inserted ${count} rows`);
    return true;
  }

  const insertToDB = function(item) {
    return db.any(
      'INSERT INTO products (name, slogan, description, catagory, default_price) VALUES ($1,$2,$3,$4,$5)',
      [
        item.name,
        item.slogan,
        item.description,
        item.category,
        item.default_price
      ]
    );
  };

  insertToDB(results[count])
    .then(function() {
      count++;
    })
    .then(() => {
      asynchLoop(results);
    })
    .catch(function(error) {
      console.log('ERROR:', error);
    });
};

readCSV();

//end code for uploading to products

//start code for uploading to styles

// const options = {
//   skipLines: 1,
//   headers: [
//     'style_id',
//     'product_id',
//     'name',
//     'sale_price',
//     'original_price',
//     'default_style'
//   ]
// };

// console.log('  ');
// console.log('csv parser');

// const readCSV = function() {
//   fs.createReadStream('../styles.csv')
//     .pipe(csv(options))
//     .on('data', (data) => {
//       results.push(data);
//     })

//     .on('end', () => {
//       console.log('finished collecting results');
//       console.log('starting insertion to db');
//       asynchLoop(results);
//     });
// };

// let count = 0;
// //this is probably supposed to be 0

// const asynchLoop = function(results) {
//   // count++;

//   if (count > results.length) {
//     console.log('reached end of data.');
//     console.log(`inserted ${count} rows`);
//     return true;
//   }

//   const insertToDB = function(item) {
//     return db.any(
//       'INSERT INTO styles (product_id, name, sale_price, original_price, default_style) VALUES ($1,$2,$3,$4,$5)',
//       [
//         item.product_id,
//         item.name,
//         item.sale_price,
//         item.original_price,
//         item.default_style
//       ]
//     );
//   };

//   insertToDB(results[count])
//     .then(function() {
//       //console.log('then: ', count);
//       count++;
//     })
//     .then(() => {
//       asynchLoop(results);
//     })
//     .catch(function(error) {
//       console.log('ERROR:', error);
//     });
// };

// readCSV();

// // 'INSERT INTO products (name, slogan, description, catagory, default_price) VALUES ($1,$2,$3,$4,$5)',

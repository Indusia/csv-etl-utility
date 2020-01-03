DROP TABLE products CASCADE;
DROP TABLE styles CASCADE;
DROP TABLE features CASCADE;
DROP TABLE related CASCADE;
DROP TABLE skus CASCADE;
DROP TABLE images CASCADE;


CREATE TABLE products(
   product_id serial PRIMARY KEY UNIQUE NOT NULL,
   name VARCHAR (250) NOT NULL,
   slogan TEXT NOT NULL,
   description TEXT NOT NULL,
   catagory VARCHAR (250),
   default_price VARCHAR (250)
);


CREATE TABLE styles(
   style_id serial PRIMARY KEY NOT NULL,
   product_id INTEGER REFERENCES products(product_id),
   name VARCHAR (250) NOT NULL,
   original_price VARCHAR (250) NOT NULL,
   sale_price VARCHAR (250),
   default_style INTEGER
);


CREATE TABLE features(
   product_id INTEGER REFERENCES products(product_id),
   feature VARCHAR (250),
   feature_value VARCHAR (250)
);


CREATE TABLE related(
   product_id INTEGER REFERENCES products(product_id),
   related_id VARCHAR (250)
);

CREATE TABLE skus(
   style_id INTEGER REFERENCES styles(style_id),
   size VARCHAR (250),
   quantity VARCHAR (250)
);


CREATE TABLE images(
   style_id INTEGER REFERENCES styles(style_id),
   main_url VARCHAR (250),
   thumbnail_url VARCHAR (250)
);



CREATE INDEX styles_index ON styles (product_id);

CREATE INDEX features_index ON features (product_id);

CREATE INDEX related_index ON related (product_id);

CREATE INDEX skus_index ON skus (style_id);

CREATE INDEX images_index ON images (style_id);



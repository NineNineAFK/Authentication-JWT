// seedProducts.js
const mongoose = require('mongoose');
const Product = require('../model/products');

mongoose.connect('mongodb://127.0.0.1:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const products = [
  {
    name: 'Product 1',
    description: 'Description for product 1',
    price: 19.99,
    imageUrl: 'http://example.com/product1.jpg'
  },
  {
    name: 'Product 2',
    description: 'Description for product 2',
    price: 29.99,
    imageUrl: 'http://example.com/product2.jpg'
  },
  {
    name: 'Product 3',
    description: 'Description for product 3',
    price: 39.99,
    imageUrl: 'http://example.com/product3.jpg'
  }
];

Product.insertMany(products)
  .then(() => {
    console.log('Products added successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error adding products:', err);
    mongoose.connection.close();
  });

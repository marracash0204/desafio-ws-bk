const express = require('express');
const ProductManager = require('./index.js');
const productsManager = new ProductManager();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await productsManager.getProductos();

  if (limit) {
    return res.send(products.slice(0, limit));
  }

  res.send(products);
});

app.get('/products/:pId', async (req, res) => {
  const prodId = parseInt(req.params.pId, 10);
  const prods = await productsManager.getProductos();

  const prod = prods.find(({ id }) => id === prodId);
  if (prod === undefined) {
    return res.status(404).send();
  }

  res.send(prod);
});

app.listen(8080, () => console.log('Hola'));
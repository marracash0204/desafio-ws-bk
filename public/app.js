import express from 'express';
import productsRouter from '../src/products.js';
import cartRouter from '../src/carts.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter, (req, res) => res.send() )
app.use('/api/carts', cartRouter, (req, res) => res.send());

app.listen(8080, () => console.log('puerto 8080'));
import { Router } from "express";
const cartRouter = Router();
const carts = {};

cartRouter.post('/', async (req, res) => {
    const cartId = await generateUniqueId();
    carts[cartId] = { id: cartId, products: [] };
    res.status(201).json(carts[cartId]);
});

cartRouter.get('/:cid', (req, res) => {
    const cart = carts[req.params.cid];
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
    const cart = carts[req.params.cid];
    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    const productId = req.params.pid;
    const existingProduct = cart.products.find(product => product.product === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }

    res.status(201).json(cart.products);
});

export default cartRouter
import { Router } from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartFilePath = path.join(__dirname, `../../cart.json`);
const cartRouter = Router();

let lastCartId = 0;

function UniqueId(existingCarts) {
  let newCartId = lastCartId;
  while (existingCarts.some((cart) => cart.id === newCartId)) {
    newCartId++;
  }
  return newCartId;
}

cartRouter.post("/", async (req, res) => {
  try {
    let existingCarts = [];

    try {
      const existingCartsData = await fs.readFile(cartFilePath, "utf-8");
      existingCarts = JSON.parse(existingCartsData);
    } catch (error) {
      console.log(error);
    }

    const newCartId = UniqueId(existingCarts);
    const newCart = {
      id: newCartId,
      products: [],
    };

    existingCarts.push(newCart);

    await fs.writeFile(cartFilePath, JSON.stringify(existingCarts, null, 2));

    res.status(200).json(newCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito:", error);
    res.status(500).send("Error al crear un nuevo carrito");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);

    const existingCartsData = await fs.readFile(cartFilePath, "utf-8");
    const existingCarts = JSON.parse(existingCartsData);

    const cart = existingCarts.find((cart) => cart.id === cartId);

    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
    res.status(500).send("Error al obtener los productos del carrito");
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const existingCartsData = await fs.readFile(cartFilePath, "utf-8");
    const existingCarts = JSON.parse(existingCartsData);

    const cart = existingCarts.find((cart) => cart.id === cartId);

    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }

    const productIndex = cart.products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ id: productId, quantity: 1 });
    }

    await fs.writeFile(cartFilePath, JSON.stringify(existingCarts, null, 2));

    res.status(200).send("Producto agregado al carrito");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send("Error al agregar producto al carrito");
  }
});

export default cartRouter;

import { Router } from "express";
import { ProductManager } from "../fileManager/productsManager.js";
const productManager = new ProductManager("../../productos.json");

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProductos();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProductos();
  res.render("realTimeProducts", { products });
});

export default router;

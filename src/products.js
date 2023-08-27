import { Router } from "express";
import { ProductManager } from "../public/index.js";
const productManager = new ProductManager();

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProductos();

  if (limit) {
    return res.send(products.slice(0, limit));
  }

  res.send(products);
});

productsRouter.get("/:pId", async (req, res) => {
  const prodId = parseInt(req.params.pId, 10);
  const prods = await productManager.getProductsById(prodId);
  if (prods === undefined) {
    return res.status(404).send();
  }

  res.send(prods);
});

productsRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  const addedProduct = await productManager.addProducts(
    newProduct.title,
    newProduct.description,
    newProduct.price,
    newProduct.code,
    newProduct.stock
  );
  res.status(200).send(addedProduct);
});

productsRouter.put("/:pId", async (req, res) => {
    const idprod = parseInt(req.params.pId);
    const { title, description, price, code, stock } = req.body;
    
    const productUpdated = await productManager.updateProduct(idprod, title, description, price, code, stock);
    
    if (productUpdated) {
        res.status(200).send("Producto actualizado exitosamente.");
    } else {
        res.status(404).send("No se encontró ningún producto con el ID proporcionado.");
    }
});
productsRouter.delete("/:pId", async (req, res) => {
    const idProd = parseInt(req.params.pId);
    const deleteProd = await productManager.deleteProduct(idProd);
    
    if (deleteProd.success) {
        res.status(200).send(deleteProd.message);
    } else {
        res.status(404).send(deleteProd.message);
    }
});




export default productsRouter;

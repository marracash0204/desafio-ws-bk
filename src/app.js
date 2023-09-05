import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import viewsrouter from "./routes/viewsRoutes.js";
import { Server } from "socket.io";

import { ProductManager } from "./fileManager/productsManager.js";
const productManager = new ProductManager("../productos.json");

const app = express();
const httpServer = app.listen(3001, () => console.log("puerto 3001"));
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("../public/js"));

app.use("/api/products", productsRouter, (req, res) => res.send());
app.use("/api/carts", cartRouter, (req, res) => res.send());
app.use("/", viewsrouter, (req, res) => res.send());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Error interno del servidor");
});

socketServer.on("connection", (socket) => {
  console.log("connection");

  socket.on(
    "addProduct",
    async ({ title, price, description, code, stock }) => {
      await productManager.addProducts(title, description, price, code, stock);
      let products = await productManager.getProductos();
      socketServer.emit("productosActualizados", products);
    }
  );

  socket.on("productDeleted", async (id) => {
    await productManager.deleteProduct(id);
    let products = await productManager.getProductos();
    socketServer.emit("productosActualizados", products);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

const fs = require('fs');
const complProductos = './productos.json'

class ProductManager {
  static id = 0;
  async addProducts(title, description, price, thumbnail, code, stock) {

    const producto = {
      id: ProductManager.id++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    try {
      if (!fs.existsSync(complProductos)) {
        const listaVacia = [];
        listaVacia.push(producto);

        await fs.promises.writeFile(
          complProductos,
          JSON.stringify(listaVacia, null, '\t')
        );
      } else {
        const productoObj = await this.getProductos();
        productoObj.push(producto);
        await fs.promises.writeFile(
          complProductos,
          JSON.stringify(productoObj, null, '\t')
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  async getProductos() {
    const product = await fs.promises.readFile(complProductos, 'utf-8');
    const productObj = JSON.parse(product);
    return productObj;
  };

  async updateProduct(id, nuevoPrecio) {
    try {
      const products = await this.getProductos();
      const productoIndex = products.findIndex(producto => producto.id === id);
  
      if (productoIndex !== -1) {
        products[productoIndex].price = nuevoPrecio;
        await fs.promises.writeFile(complProductos, JSON.stringify(products, null, '\t'));
      } else {
        console.log('No se encontró ningún producto con el ID proporcionado.');
      }
    } catch (error) {
      console.log('Error al actualizar el producto:', error);
    }
  };

  async getProductsById(id) {
    const product = await fs.promises.readFile(complProductos, 'utf-8');
    const productObj = JSON.parse(product)
    const productFind = productObj.find((prod) => prod.id === id)
    await fs.promises.writeFile('./productoPorId.json',
      JSON.stringify(productFind, null, '\t'))
  };


  async deleteProduct(id) {
    const productos = await this.getProductos();
    const productoSinId = productos.filter((producto) => producto.id != id);
    await fs.promises.writeFile(
      complProductos,
      JSON.stringify(productoSinId, null, '\t')
    );
  }

};

const todosProductos = async () => {
  const manager = new ProductManager();
  await manager.addProducts('Producto 1', 'Descripción de producto 1', 120, 'Sin Imagen', 'abc12', 100);
  await manager.addProducts('Producto 2', 'Descripción de producto 2', 400, 'Sin Imagen', 'abc13', 50);
  await manager.addProducts('Producto 3', 'Descripción de producto 3', 325, 'Sin Imagen', 'abc14', 200);
  await manager.addProducts('Producto 4', 'Descripción de producto 4', 250, 'Sin Imagen', 'abc15', 250);
  await manager.updateProduct(1, 25);
  await manager.getProductsById(2);
  await manager.deleteProduct(3);
};
todosProductos()
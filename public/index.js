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

  async readProducts() {
    try {
        const data = await fs.readFile(complProductos, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

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
    const productObj = await this.readProducts()
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

module.exports = ProductManager
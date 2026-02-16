import fs from "fs/promises";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cid);

    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product == pid);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

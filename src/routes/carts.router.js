import { Router } from "express";
import { CartModel } from "../models/Cart.model.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.json(cart);
});

// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid).populate("products.product");
  return cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Agregar producto
router.post("/:cid/products/:pid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const prod = cart.products.find(p => p.product == req.params.pid);

  if (prod) {
    prod.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product != req.params.pid);
  await cart.save();

  res.json(cart);
});

// Actualizar todo el carrito
router.put("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  cart.products = req.body;
  await cart.save();
  res.json(cart);
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);

  const prod = cart.products.find(p => p.product == req.params.pid);
  prod.quantity = req.body.quantity;

  await cart.save();
  res.json(cart);
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  cart.products = [];
  await cart.save();
  res.json(cart);
});

export default router;
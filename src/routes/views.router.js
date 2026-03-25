import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/Cart.model.js";

const router = Router();

// HOME con paginación
router.get("/", async (req, res) => {
  let { page = 1 } = req.query;

  const result = await ProductModel.paginate({}, {
    page,
    limit: 10,
    lean: true
  });

  res.render("home", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  });
});

// Vista detalle de producto
router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();

  if (!product) {
    return res.status(404).send("Producto no encontrado");
  }

  res.render("productDetail", { product });
});

// Vista tiempo real
router.get("/realtimeproducts", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("realTimeProducts", { products });
});

// Vista carrito
router.get("/cart/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", { cart });
});

export default router;
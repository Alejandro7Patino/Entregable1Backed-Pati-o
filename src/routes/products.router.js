import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = { category: query };
    }

    let options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid);
  return product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
  const newProduct = await ProductModel.create(req.body);

  const io = req.app.get("io");
  const products = await ProductModel.find().lean();
  io.emit("updateProducts", products);

  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  delete req.body.id;

  const updated = await ProductModel.findByIdAndUpdate(
    req.params.pid,
    req.body,
    { new: true }
  );

  return updated
    ? res.json(updated)
    : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.pid);

  const io = req.app.get("io");
  const products = await ProductModel.find().lean();
  io.emit("updateProducts", products);

  res.json({ message: "Producto eliminado" });
});

export default router;
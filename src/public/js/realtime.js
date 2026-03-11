const socket = io();

socket.on("updateProducts", (products) => {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.textContent = product.title + " - $" + product.price;
    list.appendChild(li);
  });
});

const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const product = {
    title: formData.get("title"),
    price: Number(formData.get("price")),
    description: "auto",
    code: Date.now().toString(),
    status: true,
    stock: 10,
    category: "general",
    thumbnails: []
  };

  await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });

  form.reset();
});
import { Router } from "express";
import { Product } from "../mongooseSchemas/productSchema.js";

const router = Router();

const filter = (products) => {
  const categaries = [];
  for (let i = 0; i < products.length; i++) {
    let match = false;
    for (let j = 0; j < categaries.length; j++) {
      match = categaries[j].category === products[i].category ? true : false;
    }
    if (!match) categaries.push(products[i]);
  }
  return categaries;
};

router.get("/category", async (req, res) => {
  const type = req.query.category;
  if (type) {
    const products = await Product.find({ category: type });
    return res.send(products);
  }
  const products = await Product.find();
  const categaries = filter(products);
  const category = await Promise.all(
    categaries.map(async (item) => {
      const cat = { category: item.category };
      return cat;
    })
  );
  res.send(category);
});

export default router;

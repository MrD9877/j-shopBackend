import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import { Orders } from "../mongooseSchemas/orderSchema.js";
import { Product } from "../mongooseSchemas/productSchema.js";
import isAdmin from "../utility/adminAuth.js";
import { generateRandom } from "../utility/randomKey.js";

const router = Router();

const productsOrdered = [];
const stock = { instock: true, product: null, badRequest: false };

async function checkForStock(products, req, res) {
  try {
    for (let i = 0; i < products.length; i++) {
      if (stock.instock) {
        const product = await Product.findOne({ productId: products[i].productId });
        productsOrdered.push(product);
        stock.badRequest = products[i].count < 0 ? true : false;
        stock.instock = product.stock >= products[i].count ? true : false;
        stock.product = stock.instock ? null : products[i];
      }
    }
  } catch (err) {
    return res.status(502).send({ msg: "opp!Somting went wrong try again" });
  }
}

router.post("/order", isAuthenticated, async (req, res) => {
  const products = req.body.products;
  const amount = req.body.total;
  const username = res.user.username;

  if (!products || !products.length) return res.status(400).send({ msg: "wrong request" });
  // check if product in stock
  await checkForStock(products, req, res);
  if (!stock.instock) return res.status(400).send({ msg: `${stock.product.title} is not in stock please remove this item` });
  if (stock.badRequest) return res.status(400).send({ msg: `bad reqest` });
  //sutract stock

  if (stock.instock) {
    try {
      for (let i = 0; i < products.length; i++) {
        const productStock = productsOrdered[i].stock - products[i].count;
        const product = await Product.updateOne({ productId: products[i].productId }, { $set: { stock: productStock } });
        if (!product.acknowledged) return res.status(502).send({ msg: "opp!Somting went wrong try again" });
      }
    } catch (err) {
      return res.status(502).send({ msg: "opp!Somting went wrong try again" });
    }
  }
  const date = Date.now();
  // order
  try {
    const order = new Orders({ username: username, products: products, orderDate: date, amount: amount, orderId: generateRandom(10), status: "new" });
    await order.save();
  } catch {
    const order = new Orders({ username: username, products: products, orderDate: date, amount: amount, orderId: generateRandom(12), status: "new" });
    await order.save();
  }
  res.sendStatus(200);
});

router.get("/order", isAuthenticated, async (req, res) => {
  const username = res.user.username;
  try {
    const orders = await Orders.find({ username: username });
    res.status(200).send(orders);
  } catch (err) {
    res.status(502).send({ msg: "opp!Somting went wrong try again" });
  }
});

router.patch("/order", isAuthenticated, isAdmin, async (req, res) => {
  const orderId = req.query.orderId;
  const shipmentDetails = req.body;
  const save = await Orders.updateOne({ orderId: orderId }, { $set: { shipmentDetails: shipmentDetails } }, { upsert: false, multi: false });
  if (save.acknowledged) return res.sendStatus(200);
  if (!save.acknowledged) return res.sendStatus(502);
});

router.get("/orders", isAuthenticated, isAdmin, async (req, res) => {
  const status = req.query.status;
  const orderId = req.query.orderId;
  try {
    let orders;
    if (status) {
      orders = await Orders.find({ status: status });
    } else if (orderId) {
      orders = await Orders.find({ orderId: orderId });
    } else {
      orders = await Orders.find();
    }
    res.status(200).send(orders);
  } catch (err) {
    res.status(502).send({ msg: "opp!Somting went wrong try again" });
  }
});

router.patch("/orders", isAuthenticated, isAdmin, async (req, res) => {
  const action = req.body.type;
  const orderId = req.body.orderId;
  try {
    const order = await Orders.updateOne({ orderId: orderId }, { $set: { status: action } }, { upsert: false, multi: false });
    if (order.acknowledged) return res.sendStatus(200);
    res.sendStatus(400);
  } catch (err) {
    console.log(err);
    res.send(502);
  }
});

export default router;

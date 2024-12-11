import { Router } from "express";
import setUrls, { intigrateUrls } from "../utility/findImageUrl.js";

const router = Router();
router.post("/cart", (req, res) => {
  console.log(req.body);
  req.session.cart = req.body;
  res.sendStatus(201);
});

router.get("/cart", (req, res) => {
  req.sessionStore.get(req.sessionID, async (err, sessionData) => {
    if (err) {
      return res.send({ msg: "please login to use this service" }).status(401);
    }
    const data = await sessionData;
    if (!data) return res.sendStatus(502);
    if (!data.cart) return res.sendStatus(400);
    if (!data.cart.products) return res.sendStatus(400);
    const cart = data.cart;
    const cartWithNewUrl = await intigrateUrls(cart.products, "products");
    res.send({ ...cart, products: cartWithNewUrl });
  });
});

export default router;

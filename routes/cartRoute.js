import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";

const router = Router()

router.post("/cart", isAuthenticated, (req, res) => {
    req.session.cart = req.body.cart
    res.sendStatus(201)
})

router.get("/cart", (req, res) => {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        if (err) {
            res.send({ "msg": "please login to use this service" }).status(401)
            return
        }
        const cart = await sessionData.cart
        if (cart === undefined) return res.sendStatus(400)
        res.send(cart)
    })
})

export default router
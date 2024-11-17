import { Router } from "express";

const router = Router()

router.post("/cart", (req, res) => {
    req.session.cart = req.body
    res.sendStatus(201)
})

router.get("/cart", (req, res) => {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        if (err) {
            return res.send({ "msg": "please login to use this service" }).status(401)
        }
        const data = await sessionData
        if (!data) return res.sendStatus(200)
        res.send(data.cart)
    })
})

export default router
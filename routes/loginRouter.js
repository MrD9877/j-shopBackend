import { Router } from "express";
import passport from "passport";
import "../stratergies/localStratergy.js"
import { NewUser } from "../mongooseSchemas/signinUser.Schema.js";

const router = Router();

router.post("/login", async (req, res) => {
    const data = req.body
    const findUser = await NewUser.findOne({ username: data.username })
    if (!findUser) return res.sendStatus(401)
    if (findUser.password !== data.password) {
        res.sendStatus(401)
    }
    if (findUser.password === data.password) {
        req.session.user = findUser.id
        console.log("log in done")
        console.log(req.sessionId)
        res.sendStatus(200)
    }
})

export default router
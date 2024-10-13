import { Router } from "express";
import passport from "passport";
import "../stratergies/localStratergy.js"
import { NewUser } from "../mongooseSchemas/signinUser.Schema.js";

const router = Router();

router.post("/login", passport.authenticate("local"), async (req, res) => {
    if (req.user) {
        res.send({ valid: true })
    } else {
        res.send({ valid: false })
    }
})

router.get("/home/login/check", async (req, res) => {
    req.user ? res.send({ valid: true, user: req.user }) : res.send({ valid: false });
})
router.get("/home/login", passport.authenticate("local"), async (req, res) => {
    const user = req.user
    if (!user) { res.send({ valid: false }) }
    if (user) {
        res.send({ valid: true })
    }
})

export default router
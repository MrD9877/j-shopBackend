import { Router } from "express";
import passport from "passport";
import "../stratergies/DiscordStratergy.js"

const router = Router();

router.get("/discord/login", passport.authenticate("discord"))
router.get("/auth", passport.authenticate("discord"), (req, res) => {
    res.redirect("http://localhost:3001/home")
    res.sendStatus(200)
})

// router.get("/home/logedin", (req, res) => {
//     req.user ? (console.log(req.user), res.send('jo')) : console.log(req.session);
// })



export default router
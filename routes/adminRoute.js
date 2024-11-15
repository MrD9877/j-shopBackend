import { Router } from "express";
import dotenv from "dotenv"
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import isAuthenticated from "../utility/authentication.js";
import isAdmin from "../utility/adminAuth.js";

dotenv.config()

const router = Router()

router.post("/admin", async (req, res) => {
    if (req.body.key !== process.env.ADMIN_KEY) {
        return res.sendStatus(401)
    }
    const data = { username: req.body.username, password: req.body.password, admin: true }
    const findDublicateUserName = await NewUser.findOne({ username: data.username });
    if (findDublicateUserName) return res.status(400).send({
        "msg": "please use different username"
    })
    const user = new NewUser(data);
    await user.save()
    res.sendStatus(201)
})



export default router

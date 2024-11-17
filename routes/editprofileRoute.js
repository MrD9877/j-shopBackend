import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";


const router = Router()

router.post("/user", isAuthenticated, async (req, res) => {
    const useremail = req.body.user.email
    const user = req.body.user
    const change = await NewUser.updateOne({ username: res.user.username },
        { $set: { name: user.name, phonenumber: user.phonenumber, email: (useremail ? useremail : null), deliveryaddress: req.body.deliveryaddress, avatar: user.avatar } },
        { upsert: false, multi: false }
    )
    if (change.acknowledged) {
        res.sendStatus(201)
    } else {
        res.sendStatus(406)
    }
})

router.get("/user", isAuthenticated, async (req, res) => {
    const username = res.user.username
    try {
        const userInfo = await NewUser.findOne({ username: username })
        const user = {
            name: userInfo.name,
            phonenumber: userInfo.phonenumber,
            email: userInfo.email,
            deliveryaddress: userInfo.deliveryaddress,
            avatar: userInfo.avatar
        }
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

export default router
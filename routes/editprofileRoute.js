import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import isAdmin from "../utility/adminAuth.js";


const router = Router()

router.post("/user", isAuthenticated, async (req, res) => {
    const shiprocket = req.body.shiprocket
    const user = req.body.user
    let change
    if (shiprocket) {
        change = await NewUser.updateOne({ username: res.user.username },
            { $set: { shiprocket: shiprocket } },
            { upsert: false, multi: false }
        )
    } else {
        change = await NewUser.updateOne({ username: res.user.username },
            { $set: { name: user.name, phonenumber: user.phonenumber, email: (user.email ? user.email : null), deliveryaddress: req.body.deliveryaddress, avatar: user.avatar } },
            { upsert: false, multi: false }
        )
    }
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
            avatarId: userInfo.avatarId,
            admin: userInfo.admin,
            shiprocket: userInfo.shiprocket
        }
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get("/customer", isAuthenticated, isAdmin, async (req, res) => {
    const username = req.query.username;
    try {
        const userInfo = await NewUser.findOne({ username: username })
        res.status(200).send(userInfo)
    } catch {
        res.sendStatus(400)
    }
})
export default router
import { Router } from "express";
import isAuthenticated from "../utility/authentication.js";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";


const router = Router()

router.put("/deliveryaddress", isAuthenticated, async (req, res) => {
    const mongoResponse = await NewUser.updateOne({ username: res.user.username },
        { $set: { deliveryaddress: req.body.deliveryaddress } },
        { upsert: false, multi: false }
    )
    if (mongoResponse.acknowledged) {
        res.sendStatus(200)
    } else {
        res.sendStatus(406)
    }
})

router.put("/usercontact", isAuthenticated, async (req, res) => {
    const useremail = res.user.email
    const change = await NewUser.updateOne({ username: res.user.username },
        { $set: { name: req.body.name, phonenumber: req.body.phonenumber, email: (useremail ? useremail : null) } },
        { upsert: false, multi: false }
    )
    if (change.acknowledged) {
        res.sendStatus(201)
    } else {
        res.sendStatus(406)
    }
})

export default router
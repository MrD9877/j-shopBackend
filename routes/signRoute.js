import { Router } from "express";
import { validationResult, checkSchema, matchedData } from 'express-validator'
import checkUserSchema from "../expressValidation/signinUser.js";
import { NewUser } from "../mongooseSchemas/signinUser.Schema.js";

const router = Router();

router.post("/signin", checkSchema(checkUserSchema), async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) return res.send({
        "valid": false,
        "msg": result.errors[0].msg
    })
    const data = matchedData(req)
    const findDublicateUserName = await NewUser.findOne({ username: data.username });
    if (findDublicateUserName) return res.send({
        "valid": false,
        "msg": "please use different username"
    })
    const user = new NewUser(data);
    await user.save()
    res.send({ "valid": true }).status(200)
})

router.post("/signin2", async (req, res) => {
    const user = new NewUser(req.body)
    await user.save()
    res.sendStatus(200)
})



export default router
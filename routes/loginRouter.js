import { Router } from "express";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import { generateAcsessToken, generateRefreshToken } from "../utility/genetageToken.js";

const router = Router();

router.post("/login", async (req, res) => {
    const data = req.body
    const findUser = await NewUser.findOne({ username: data.username })
    if (!findUser) return res.sendStatus(401)
    if (findUser.password !== data.password) {
        res.sendStatus(401)
    }
    if (findUser.password === data.password) {
        const accessToken = generateAcsessToken({ username: findUser.username })
        const refreshToken = generateRefreshToken({ username: findUser.username })
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            withCredentials: true,
            sameSite: 'None',
            secure: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            withCredentials: true,
            sameSite: 'None',
            secure: true
        })
        req.session.user = refreshToken
        res.status(200).send({ msg: "welcome" })
    }
})
router.get("/logout", (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
})

export default router
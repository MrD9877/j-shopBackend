import { Router } from "express";
import { authRefreshToken } from "../utility/authToken.js";
import { generateAcsessToken } from "../utility/genetageToken.js";

const router = Router()

router.get('/token', (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const user = authRefreshToken(refreshToken)
    if (user === 403) return res.sendStatus(403)
    const accessToken = generateAcsessToken({ username: user.username })
    res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 5,
        httpOnly: true,
        withCredentials: true,
        sameSite: 'None',
        secure: true
    })
    res.sendStatus(200)
})

export default router
import { authToken } from "./authToken.js";

function isAuthenticated(req, res, next) {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        if (err) {
            res.send({ "msg": "please login to use this service" }).status(401)
            return
        }
        if (sessionData !== null) {
            req.cookies.refreshToken = await sessionData.Token;
            const accessToken = req.cookies.accessToken
            if (accessToken === null) return res.sendStatus(401)
            const user = authToken(accessToken)
            if (user === 403) return res.sendStatus(403)
            res.user = user
            next()
        } else {
            res.sendStatus(401)
        }
    })

}
export default isAuthenticated
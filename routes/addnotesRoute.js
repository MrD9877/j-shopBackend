import { Router } from "express";
import { Notes } from "../mongooseSchemas/notesSchema.js";
import { authToken } from "../utility/authToken.js";


const router = Router();

function isAuthenticated(req, res, next) {
    console.log("here")
    const accessToken = req.cookies.accessToken
    if (accessToken === null) return res.sendStatus(401)
    const user = authToken(accessToken)
    if (user === 403) return res.sendStatus(403)
    res.user = user
    next()
}

router.post('/addnotes', isAuthenticated, async (req, res) => {
    const data = req.body
    const username = res.user.username
    try {
        const notes = new Notes({ username: username, ...data })
        await notes.save()
        res.sendStatus(200)
    } catch (err) {
        res.send(err.errorResponse.errmsg).status(404)
    }
})



export default router
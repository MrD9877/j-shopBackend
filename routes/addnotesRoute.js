import { Router } from "express";
import { Notes } from "../mongooseSchemas/notesSchema.js";
import { NewUser } from "../mongooseSchemas/signinUser.Schema.js";


const router = Router();
let userid = null

function isAuthenticated(req, res, next) {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        if (err) {
            res.send({ "msg": "please login to use this service" }).status(401)
        }
        if (sessionData !== null) {
            userid = await sessionData.user;
            next()
        } else {
            res.sendStatus(402)
        }

    })
}


router.post('/addnotes', isAuthenticated, async (req, res) => {
    const data = req.body
    const findUser = await NewUser.findById(userid)
    if (!findUser) return res.send({ "msg": "invalid user" }).status(401)
    const username = findUser.username
    try {
        const notes = new Notes({ username: username, ...data })
        await notes.save()
        res.sendStatus(200)
    } catch (err) {
        res.send(err.errorResponse.errmsg).status(404)
    }
})



export default router
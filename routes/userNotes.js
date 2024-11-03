import { Router } from "express";
import { Notes } from "../mongooseSchemas/notesSchema.js";
import { NewUser } from "../mongooseSchemas/signinUser.Schema.js";


const router = Router();
let userid = null

function isAuthenticated(req, res, next) {
    req.sessionStore.get(req.sessionID, async (err, sessionData) => {
        console.log(req.sessionID)
        if (err) {
            res.send({ "msg": "please login to use this service" }).status(401)
            return
        }
        if (sessionData !== null) {
            userid = await sessionData.user;
            next()
        } else {
            res.sendStatus(402)
        }

    })
}

router.get('/usernotes', isAuthenticated, async (req, res) => {
    console.log(req.cookies)
    const findUser = await NewUser.findById(userid)
    if (!findUser) {
        res.send({ "msg": "invalid user" }).status(401)
        return
    }
    const username = findUser.username
    const findUserNotes = await Notes.find({ username: username }).exec()
    res.send(findUserNotes)

})


router.delete('/usernotes', isAuthenticated, async (req, res) => {
    const noteID = req.body
    await Notes.findByIdAndDelete(noteID._id)
    res.sendStatus(200)
})


export default router
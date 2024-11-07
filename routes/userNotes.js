import { Router } from "express";
import { Notes } from "../mongooseSchemas/notesSchema.js";
import { authToken } from "../utility/authToken.js";


const router = Router();

function isAuthenticated(req, res, next) {
    const accessToken = req.cookies.accessToken
    if (accessToken === null) return res.sendStatus(401)
    const user = authToken(accessToken)
    if (user === 403) return res.sendStatus(403)
    res.user = user
    next()
}

router.get('/usernotes', isAuthenticated, async (req, res) => {
    const username = res.user.username
    const findUserNotes = await Notes.find({ username: username }).exec()
    res.send(findUserNotes)

})


router.delete('/usernotes', isAuthenticated, async (req, res) => {
    const noteID = req.body._id
    await Notes.findByIdAndDelete(noteID)
    res.sendStatus(200)
})


export default router
import { Router } from "express";
import { Note } from "../mongooseSchemas/notesSchema.js";

const router = Router();

router.get('/usernotes', async (req, res) => {
    const { username } = req.query;
    const findUserNotes = await Note.findOne({ username: username })
    if (findUserNotes) {
        res.send(findUserNotes.notes).status(200)
    }
    if (!findUserNotes) {
        res.send([])
    }
})
router.delete('/usernotes', async (req, res) => {
    const { index } = req.body
    console.log(index)
    const { username } = req.query;
    const findUserNotes = await Note.findOne({ username: username })
    if (findUserNotes) {
        const tempArr = findUserNotes.notes
        const dti = tempArr.splice(index, 1);
        findUserNotes.notes = tempArr
        findUserNotes.save();
        res.sendStatus(200)
    }
    if (!findUserNotes) {
        res.send("invalid req").status(400)
    }
})


export default router
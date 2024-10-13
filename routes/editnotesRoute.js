import { Router } from "express";
import { Note } from "../mongooseSchemas/notesSchema.js";

const router = Router();

router.post('/editnotes', async (req, res) => {
    const data = req.body
    const { username } = req.query;
    const findUserNotes = await Note.findOne({ username: username })
    if (findUserNotes) {
        findUserNotes.notes.push(data)
        findUserNotes.save()
        res.status(201).send('ok here')
    }
    if (!findUserNotes) {
        const note = new Note({
            username: username,
            notes: [data]
        })
        await note.save()
        res.status(200).send('ok here')
    }
})



export default router
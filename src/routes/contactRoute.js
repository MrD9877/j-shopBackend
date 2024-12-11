import { Router } from "express";
import { Contact } from "../mongooseSchemas/contactSchema.js";

const router = Router();

router.post("/contact/userQuery", async (req, res) => {
    const data = req.body;
    const mail = new Contact(data);
    await mail.save();
    res.sendStatus(200)
})


export default router
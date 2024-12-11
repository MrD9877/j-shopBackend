import { Router } from "express";
import dotenv from "dotenv";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
dotenv.config();

const router = Router();

router.post("/admin", async (req, res) => {
  console.log(req.body);
  if (req.body.key === process.env.ADMIN_KEY) {
    const data = { username: req.body.username, password: req.body.password, admin: true };
    const findDublicateUserName = await NewUser.findOne({ username: data.username });
    if (findDublicateUserName)
      return res.status(400).send({
        msg: "please use different username",
      });
    const user = new NewUser(data);
    await user.save();
    res.sendStatus(201);
  } else {
    return res.sendStatus(401);
  }
});

export default router;

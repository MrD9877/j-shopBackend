import { Router } from "express";
import superagent from "superagent";
import isAuthenticated from "../utility/authentication.js";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import { generateOTP } from "../utility/genetageToken.js";

const router = Router();
router.post("/sendemail", isAuthenticated, async (req, res) => {
  const user = res.user.username;
  console.log(user.username);
  let email = null;
  const otp = generateOTP(4);
  try {
    const userInfo = await NewUser.findOne({ username: user });
    console.log(userInfo);

    email = userInfo.email;
  } catch {
    return res.sendStatus(500);
  }
  if (!email) return res.status(400).send({ msg: "NO email was provided" });
  // req.session.cookie.maxAge = 5000 * 60;
  req.session.otp = otp;
  try {
    const response = await superagent.post("http://localhost:3001/api/sendemail").send({ otp, user, email });
    console.log(response);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;

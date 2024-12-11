import { Router } from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import checkUserSchema from "../expressValidation/signinUser.js";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import asignAvatar from "../utility/asignAvatar.js";

const router = Router();

function notAllowedFnc(username) {
  let notAllowed = false;
  const arr = username.split("");
  if (arr[0] === "e" && arr[1] === "-") notAllowed = true;
  return notAllowed;
}
router.post("/signin", checkSchema(checkUserSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.send({
      valid: false,
      msg: result.errors[0].msg,
    });
  const data = matchedData(req);
  const username = data.username;
  // this is for username we are not allowing or convention
  const notAllowed = notAllowedFnc(username);
  if (notAllowed) return res.status(400).send({ msg: "username can't start with e-" });
  try {
    const avatarId = await asignAvatar();
    const user = new NewUser({ ...data, avatarId });
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    if (err.message && err.message.includes("duplicate"))
      return res.status(400).send({
        valid: false,
        msg: "please use different username",
      });
    res.sendStatus(502);
  }
});

export default router;

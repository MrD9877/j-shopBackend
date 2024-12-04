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
  console.log(arr, notAllowed);
  return notAllowed;
}
notAllowedFnc("e-mail");
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
  const findDublicateUserName = await NewUser.findOne({ username: username });
  if (findDublicateUserName)
    return res.send({
      valid: false,
      msg: "please use different username",
    });
  const avatarId = await asignAvatar();
  const user = new NewUser({ ...data, avatarId });
  await user.save();
  res.status(200);
});

export default router;

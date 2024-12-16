import signinRoute from "./signRoute.js";
import loginRoute from "./loginRouter.js";
import tokenRoute from "./tokenRoute.js";
import editprofileRouter from "./editprofileRoute.js";
import adminRoute from "./adminRoute.js";
import cartRoute from "./cartRoute.js";
import productRoute from "./ProductRoute.js";
import orderRoute from "./orderRoute.js";
import categoryRoute from "./caregoryRoute.js";
import avatarRoute from "./addAvatarRoute.js";
import googleSignIn from "./googleSigninRoute.js";
import openAi from "./openAiRoute.js";
import emailRoute from "./resetPassword.js";
import { Router } from "express";

const router = Router();

router.use(categoryRoute);
router.use(signinRoute);
router.use(loginRoute);
router.use(tokenRoute);
router.use(editprofileRouter);
router.use(adminRoute);
router.use(cartRoute);
router.use(productRoute);
router.use(orderRoute);
router.use(avatarRoute);
router.use(googleSignIn);
router.use(openAi);
router.use(emailRoute);

export default router;

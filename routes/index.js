import editRouter from "./editnotesRoute.js"
import usernotes from "./userNotes.js"
import conctRouter from "./contactRoute.js"
import discordloginRoute from "./discordLoginRoute.js"
import signinRoute from "./signRoute.js"
import loginRoute from "./loginRouter.js"
import { Router } from "express"


const router = Router();

router.use(editRouter);
router.use(usernotes);
router.use(conctRouter);
router.use(signinRoute);
router.use(loginRoute);
router.use(discordloginRoute);

export default router
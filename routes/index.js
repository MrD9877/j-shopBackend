import addNotesRouter from "./addnotesRoute.js"
import usernotes from "./userNotes.js"
import conctRouter from "./contactRoute.js"
import signinRoute from "./signRoute.js"
import loginRoute from "./loginRouter.js"
import tokenRoute from './tokenRoute.js'
import { Router } from "express"


const router = Router();

router.use(addNotesRouter);
router.use(usernotes);
router.use(conctRouter);
router.use(signinRoute);
router.use(loginRoute);
router.use(tokenRoute);

export default router
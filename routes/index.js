import conctRouter from "./contactRoute.js"
import signinRoute from "./signRoute.js"
import loginRoute from "./loginRouter.js"
import tokenRoute from './tokenRoute.js'
import editprofileRouter from "./editprofileRoute.js"
import adminRoute from "./adminRoute.js"
import cartRoute from "./cartRoute.js"
import addProductRoute from "./addProductRoute.js"
import { Router } from "express"


const router = Router();

router.use(conctRouter);
router.use(signinRoute);
router.use(loginRoute);
router.use(tokenRoute);
router.use(editprofileRouter)
router.use(adminRoute)
router.use(cartRoute)
router.use(addProductRoute)

export default router
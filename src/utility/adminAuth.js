import { NewUser } from "../mongooseSchemas/signinUserSchema.js"

async function isAdmin(req, res, next) {
    const user = await NewUser.findOne({ username: res.user.username })
    if (!user) return res.sendStatus(400)
    if (!user.admin) return res.sendStatus(401)
    next()
}

export default isAdmin
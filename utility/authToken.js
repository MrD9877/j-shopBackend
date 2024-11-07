import dotenv from 'dotenv'
import jwt from "jsonwebtoken"

dotenv.config()

export function authToken(token) {
    let user
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
        // console.log(err)
        if (err) return user = 403
        user = username
    })
    return user
}
export function authRefreshToken(token) {
    let user
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, username) => {
        if (err) return user = 403
        user = username
    })
    return user
}
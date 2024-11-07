import dotenv from 'dotenv'
import jwt from "jsonwebtoken"

dotenv.config()

export function generateAcsessToken(data) {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}
export function generateRefreshToken(data) {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}
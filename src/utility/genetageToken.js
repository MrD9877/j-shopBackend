import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function generateAcsessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
}
export function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
}

export function generateOTP(length) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    const number = Math.floor(Math.random() * 10);
    otp = `${otp}${number}`;
  }
  return otp;
}

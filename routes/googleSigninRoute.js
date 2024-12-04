import { Router } from "express";
import passport from "passport";
import "../passport/googleStratergy.js";
import {
  generateAcsessToken,
  generateRefreshToken,
} from "../utility/genetageToken.js";

const router = Router();

function getUsername(req, res, next) {
  req.sessionStore.get(req.sessionID, async (err, sessionData) => {
    if (err) {
      return res.send({ msg: "please login to use this service" }).status(401);
    }
    if (sessionData !== null) {
      const data = sessionData.passport.user;
      res.username = data;
      next();
    } else {
      res.sendStatus(401);
    }
  });
}

router.get("/googleauth", passport.authenticate("google"));

router.get(
  "/api/auth/callback/google",
  passport.authenticate("google"),
  getUsername,
  (req, res) => {
    console.log(res.username);
    const accessToken = generateAcsessToken({ username: res.username });
    const refreshToken = generateRefreshToken({ username: res.username });
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      withCredentials: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      withCredentials: true,
      sameSite: "None",
      secure: true,
    });
    req.session.user = refreshToken;
    res.status(200).redirect("http://localhost:3001");
  }
);

export default router;

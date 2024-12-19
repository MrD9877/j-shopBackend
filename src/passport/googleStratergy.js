import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import { NewUser } from "../mongooseSchemas/signinUserSchema.js";
import asignAvatar from "../utility/asignAvatar.js";
import dotenv from "dotenv";

dotenv.config();

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const findUser = await NewUser.findOne({ username: username });
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECREAT,
      callbackURL: "https://j-store-mrd9877s-projects.vercel.app//api/auth/callback/google",
      scope: scopes,
    },

    async (accessToken, refreshToken, profile, done) => {
      const userName = `e-${profile.emails[0].value.split("@")[0]}`;
      try {
        const findUser = await NewUser.findOne({ username: userName });
        if (findUser) done(null, findUser);
        if (!findUser) {
          const avatarId = await asignAvatar();
          console.log(avatarId);
          const user = new NewUser({
            email: profile.emails[0].value,
            username: userName,
            avatarId: avatarId,
          });
          await user.save();
          done(null, user);
        }
      } catch {
        console.log("error");
      }
    }
  )
);

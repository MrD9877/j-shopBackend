import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.js";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
export const useApp = () => {
  const app = express();

  const corsOptions = {
    origin: ["http://localhost:3001", "http://192.168.63.138:3001", process.env.ORIGIN_ONE, process.env.ORIGIN_TWO, "https://j-store-mrd9877s-projects.vercel.app"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With", "Origin", "Accept"],
    optionSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  app.use(
    express.json({
      type: ["application/json", "text/plain"],
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // sign session with this
      resave: false, //store on every request when true usefull if store have expiration date
      saveUninitialized: false, //if true session will be saved even if no modification
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // when true client side js can n't use and see cookie
        withCredentials: true, //if want to send cookies
        secure: true, //https = true , http = false
        // Note There is a draft spec that requires that the Secure attribute be set to true when the SameSite attribute has been set to 'none'. Some web browsers or other clients may be adopting this specification.
      },
      sameSite: "none",

      // name : "any name"  //by default it is set to connect.sid
      // rolling: true // Force the session identifier cookie to be set on every response
      // unset : keep // destroy will destroy after req ends
    })
  );

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(router);
  return app;
};

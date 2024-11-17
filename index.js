import express from "express"
import mongoose from "mongoose";
import router from "./routes/index.js"
import cors from "cors"
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config()

const app = express()
const port = 3000

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb+srv://dhuruvbansl99:Shubham123@cluster0.jos6q.mongodb.net/jshop");
}


const corsOptions = {
    origin: ["https://mrd9877.github.io", "http://localhost:3001", "http://192.168.63.138:3001", "*"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Origin', 'Accept'],
    optionSuccessStatus: 200,
}


app.use(cors(corsOptions))

app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(session({
    secret: process.env.SESSION_SECRET,// sign session with this
    resave: false, //store on every request when true usefull if store have expiration date
    saveUninitialized: false,//if true session will be saved even if no modification
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
    cookie: {
        httpOnly: true, // when true client side js can n't use and see cookie 
        withCredentials: true, //if want to send cookies
        secure: false,//https = true , http = false
        // Note There is a draft spec that requires that the Secure attribute be set to true when the SameSite attribute has been set to 'none'. Some web browsers or other clients may be adopting this specification.
    },
    // name : "any name"  //by default it is set to connect.sid 
    // rolling: true // Force the session identifier cookie to be set on every response
    // unset : keep // destroy will destroy after req ends 
}))

app.use(cookieParser())

app.use(router)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

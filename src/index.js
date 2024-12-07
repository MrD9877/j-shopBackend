import mongoose from "mongoose";
import dotenv from "dotenv";
import { useApp } from "./app.js";

async function main() {
  await mongoose.connect("mongodb+srv://dhuruvbansl99:Shubham123@cluster0.jos6q.mongodb.net/jshop");
}
main().catch((err) => console.log(err));
dotenv.config();

const app = useApp();
const port = 3000;
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

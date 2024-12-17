import mongoose from "mongoose";
import dotenv from "dotenv";
import { useApp } from "./src/app.js";
dotenv.config();
const string = process.env.MONGODB_STRING;
async function main() {
  await mongoose.connect(string);
}
main().catch((err) => console.log(err));

const app = useApp();
const port = 3000;
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

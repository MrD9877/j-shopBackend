import { Router } from "express";
import { Avatar } from "../mongooseSchemas/avatarsSchema.js";
import isAuthenticated from "../utility/authentication.js";
import isAdmin from "../utility/adminAuth.js";
import multer from "multer";
import { generateRandom } from "../utility/randomKey.js";
import uploadImage from "../utility/upLoadImage.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/avatar", isAuthenticated, isAdmin, upload.any("image"), async (req, res) => {
  const files = req.files;
  const count = await Avatar.collection.countDocuments();
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageName = generateRandom(32);
      await uploadImage(imageName, file);
      const avatar = new Avatar({ id: count + i + 1, avatar: imageName });
      await avatar.save();
    }
    res.sendStatus(201);
  } catch {
    res.sendStatus(502);
  }
});

router.get("/avatar", async (req, res) => {
  const id = req.query.avatarId;
  try {
    const avatar = await Avatar.findOne({ id: id });
    res.status(200).send(avatar);
  } catch {
    res.sendStatus(400);
  }
});

export default router;

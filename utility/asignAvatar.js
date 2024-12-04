import { Avatar } from "../mongooseSchemas/avatarsSchema.js";

async function asignAvatar() {
  const max = await Avatar.collection.countDocuments();
  const id = Math.floor(Math.random() * max);
  return id;
}

export default asignAvatar;

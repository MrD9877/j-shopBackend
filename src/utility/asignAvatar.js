import { Avatar } from "../mongooseSchemas/avatarsSchema.js";

async function asignAvatar() {
  let max;
  try {
    max = await Avatar.collection.countDocuments();
  } catch {
    max = 0;
  }
  const id = Math.floor(Math.random() * max);
  return id;
}

export default asignAvatar;

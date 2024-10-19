import { Schema, model } from "mongoose";

const Document = new Schema({
  id: String,
  data: Object,
});

export default model("Document", Document);

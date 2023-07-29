const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
    {
        title: { type: String, required: true, min: 3 },
        summary: { type: String, require: true, min: 8 },
        content: String,
        cover: String,
        author: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        timestamps: true,
    }
);

const PostModel = model("posts", PostSchema);
module.exports = PostModel;

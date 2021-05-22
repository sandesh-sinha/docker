const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require : [true, "Post must have titles"]
    },
    body: {
        type: String,
        require : [true, "Post must have bodys"]
    },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
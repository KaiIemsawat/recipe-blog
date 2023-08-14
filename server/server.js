const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer"); // use for uploads photos
const fs = require("fs");

const UserModel = require("./models/userModel.js");
const PostModel = require("./models/postModel.js");

const jwtSecret = "faghjgdfsgk1234llopFFS9ffa---e4";
const uploadMidWare = multer({ dest: "uploads/" }); // use for uploads photos

const app = express();

app.use(
    cors(
        { credentials: true, origin: "http://localhost:5173" } // ! <-- to get token
    )
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(`${__dirname}/uploads`));

app.get("/test", (req, res) => {
    res.json("test OK");
});

mongoose.connect(
    "mongodb+srv://kaiiemsawat:Kinkin3710@cluster0.48awedd.mongodb.net/blogs?retryWrites=true&w=majority"
);

// ! REGISTER
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userDoc = await UserModel.create({
            username,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        });
        res.json(userDoc);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

// ! LOGIN
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await UserModel.findOne({ email });
        if (!userDoc) {
            res.status(422).json("user not found");
        } else {
            const isPassOK = bcrypt.compareSync(password, userDoc.password);
            if (isPassOK) {
                jwt.sign(
                    { email, id: userDoc._id },
                    jwtSecret,
                    {},
                    (err, token) => {
                        if (err) throw err;

                        res.cookie("token", token).json({
                            id: userDoc._id,
                            email,
                        });
                    }
                );
            } else {
                res.status(400).json("Invalid credential");
            }
        }
    } catch (error) {
        res.json(error);
    }
});

// ! PROFILE
app.get("/api/profile", (req, res) => {
    // ! To get token and convert to readable json
    const { token } = req.cookies;
    // console.log(req.cookies); // Raw jwt cookies
    jwt.verify(token, jwtSecret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

// ! LOGOUT
app.post("/api/logout", (req, res) => {
    res.cookie("token", "").json("LOGOUT OK");
});

// ! CREATE NEW POST
// ! <--- "file" in next line needs to be samne as in CreatePostPage.jsx --->  data.set("file", files[0]);
app.post("/api/create-post", uploadMidWare.single("file"), async (req, res) => {
    // console.log(req.file);
    const { originalname, path } = req.file;
    const fileParts = originalname.split(".");
    const extension = fileParts[fileParts.length - 1];
    const newPath = `${path}.${extension}`;
    fs.renameSync(path, newPath);

    if (req.file.mimetype.split("/")[0] === "image") {
        // get author data from userModel
        const { token } = req.cookies;
        jwt.verify(token, jwtSecret, {}, async (err, info) => {
            if (err) throw err;
            try {
                const { title, summary, content } = req.body;
                const postDoc = await PostModel.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });

                res.json(postDoc);
            } catch (error) {
                res.status(400).json(error);
            }
        });
    } else {
        res.status(400).json({ message: "File type not compatible" });
    }
});

// ! UPDATE POST
app.put("/api/post", uploadMidWare.single("file"), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const fileParts = originalname.split(".");
        const extension = fileParts[fileParts.length - 1];
        newPath = `${path}.${extension}`;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await PostModel.findById(id);
        // const isAuthor = postDoc.author === info.id; // < this will not be equal due to that author type is objectId
        const isAuthor =
            JSON.stringify(postDoc.author) === JSON.stringify(info.id); // < with this, the result will be true
        if (!isAuthor) {
            return res.status(400).json("Not the author");
        } else {
            await postDoc.updateOne({
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            });
            res.json(postDoc);
        }
    });
});

// ! GET ALL POSTs
app.get("/api/posts", async (req, res) => {
    // .populate("author", ["username"]) .populate("author") to have author in json
    // .populate("author", ["username"]) , ["username"] to have only username appear (no password)
    res.json(
        await PostModel.find()
            .populate("author", ["username"])
            .sort({ createdAt: -1 }) // sorting -- last one first (on top)
            .limit(20) // to limit number of post on screen
    );
});

app.get("/api/post/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id).populate("author", [
        "username",
    ]);
    res.json(postDoc);
});

app.listen(8000);

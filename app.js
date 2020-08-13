const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose
    .connect("mongodb://127.0.0.1:27017/myDiaryDB", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("DB connected!"))
    .catch((err) => {
        console.log(`DB Connection Error: ${err.message}`);
    });

const diarySchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Item = mongoose.model("Item", diarySchema);

app.get("/", (req, res) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                content: homeStartingContent,
                contentText: items,
            });
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        content: aboutContent
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        content: contactContent
    });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/pages/:pageId", (req, res) => {
    const requestedPageId = req.params.pageId;

    Item.findOne({
        _id: requestedPageId
    }, (err, items) => {
        res.render("post", {
            title: items.title,
            content: items.content,
        });
    });
});

app.post("/compose", (req, res) => {
    const post = new Item({
        title: req.body.postTitle,
        content: req.body.postBody,
    });
    post.save((err) => {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { verifyToken } = require("./middlewares/auth")
app.use(express.json())
app.use(express.urlencoded({ extends: true }))
const users = [{
    id: 1,
    username: 'Henry'
}, {
    id: 2,
    username: 'Jimmy'
}]

const posts = [{
    id: 1,
    userId: 1,
    title: "Book1",
    description: "Book1 here"
}, {
    id: 2,
    userId: 2,
    title: "Book2",
    description: "Book2 here"
}]

app.get('/post', verifyToken, (req, res, next) => {
    if (!req.userId) {
        res.json(posts)
    } else {
        const post = posts.find(post => post.id === req.userId)
        res.json({ post })
    }
});

app.post("/login", (req, res, next) => {
    const username = req.body.username;
    const user = users.find(user => user.username === username)
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s'
    })
    if (user) {
        return res.json(accessToken)
    }
    return res.json("Not found");
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
});
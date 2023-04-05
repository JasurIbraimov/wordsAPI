const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 8000 
const db = require("./firebase.js")
app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/words/word", (req, res) => {
    return res.sendFile(__dirname + "/public/index.html")
})

app.post("/words/word", async (req, res) => {
    const { wordEng, wordRu, category } = req.body;
    await db.collection("words").add({
        word: {ru: wordRu, eng: wordEng},
        category: category
    })

    return res.redirect("/words/word")
})

app.get("/words/:lang/:category/", async (req, res) => {
    const { lang, category } = req.params;
    const snapShot = await db.collection("words").get()
    let data = []
    snapShot.forEach(doc => {
        data.push(doc.data())
    })
    data = data.filter(q => q.category == category).map(q => q.word[lang])
    return res.send(data)
})

app.listen(PORT, () => {
    console.log("SERVER IS RUNNING")
})
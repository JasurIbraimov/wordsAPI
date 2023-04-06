const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 8000 
const db = require("./firebase.js")
app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

async function fetchWordsByLangAndCategory(lang, category) {
    const snapShot = await db.collection("words").get()
    let data = []
    snapShot.forEach(doc => {
        data.push(doc.data())
    })
    data = data.filter(q => q.category == category).map(q => q.word[lang])
    return data
}

app.get("/word", (req, res) => {
    return res.sendFile(__dirname + "/public/index.html")
})

app.post("/word", async (req, res) => {
    const { wordEng, wordRu, category } = req.body;
    const snapShot = await db.collection("words").get()
    if (wordEng == "" || wordRu == "") {
        return res.status(404).send({"error": "The word has no english or russian version"})
    }
    let data = []
    snapShot.forEach(doc => {
        data.push(doc.data())
    })

    if(data.findIndex((d) => d.word.ru == wordRu || d.word.eng == wordEng) != -1) {
        return res.status(404).send({ "error": "This word is already exist in database!" })
    }

    await db.collection("words").add({
        word: {ru: wordRu, eng: wordEng},
        category: category
    })

    return res.status(200).send({"message": "The word " + wordRu + " - " + wordEng + " created successfully!"})
})

app.get("/api/delete/:id", async (req, res) => {
    const {id} = req.params;
    const doc = await db.collection("words").doc(id).get()
    await db.collection("words").doc(id).delete()
    return res.status(200).send({message: "The word " + doc.data().word.ru + " - " +doc.data().word.eng + " successfully deleted!"})
})

app.get("/words/:lang/:category", (req, res) => {
    return res.sendFile(__dirname + "/public/words.html")
})

app.get("/api/:lang/:category", async (req, res) => {
    const { lang, category } = req.params;
    const snapShot = await db.collection("words").get()
    let data = []
    snapShot.forEach(doc => {
        data.push({...doc.data(), id: doc.id})
    })
    data = data.filter(q => q.category == category).map(q => ({word: q.word[lang], id: q.id}))
    return res.send(data)
})  

app.get("/:lang/:category/", async (req, res) => {
    const { lang, category } = req.params;
    let data = await fetchWordsByLangAndCategory(lang, category)
    return res.send(data)
})



app.listen(PORT, () => {
    console.log("SERVER IS RUNNING")
})
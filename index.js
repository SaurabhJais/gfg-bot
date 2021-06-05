let express = require("express")
let app = express()
let calcLinks = require("./bot")
let path = require("path")
let http = require("http").Server(app)
let io = require("socket.io")(http)

app.set("view engine", "ejs" )
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "/node_modules/socket.io/client-dist/")))




app.get("/", (req, res) => {
    calcLinks(167, 168, io);
    res.render("home")
})

io.on("connection", (socket)=>{
    console.log("A device connected")
})

http.listen(3000, () => {
    console.log("Application runing like a charm")
})
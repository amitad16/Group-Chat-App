const express = require("express");
const bodyParser = require("body-parser");
let app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = 3000;

// Configuration of view engine and directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res) => {
  res.render("index");
});

let users = [];

// SOCKET
io.on("connection", socket => {
  console.log("user connected");
  socket.on("join", data => {
    console.log("user joininig::", data);
    // Join
    socket.join(data.room);
    console.log(`${data.user.email} joined the room : ${data.room}`);
    users.push({ user: data.user, room: data.room, id: socket.id });

    console.log(users);
    console.log("=================================");
    console.log("=================================");
    console.log("=================================");

    // DO ASYNC TASKS

    // Broadcasting
    socket.broadcast.to(data.room).emit("new user joined", {
      user: data.user,
      message: "has joined this room",
      room: data.room
    });
  });

  // Message
  socket.on("send new message", data => {
    console.log("new message::", data);

    // DO ASYNC TASKS

    io.in(data.room).emit("receive new message", {
      user: data.user.email,
      message: data.message
    });
  });
});

http.listen(PORT, () => console.log(`Listening to port ${PORT}`));

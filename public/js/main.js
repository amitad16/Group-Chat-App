let URL = "http://localhost:3000";

const email = `${Math.round(Math.random() * 1000)}@gmail.com`;

// EVENT EMMISIONS
const JOIN_ROOM = "join";
const SEND_NEW_MESSAGE = "send new message";

// EVENT LISTENERS
const NEW_USER_JOINED = "new user joined";
const RECEIVE_NEW_MESSAGE = "receive new message";

const socketIO = io(URL);

function joinRoom(room, user) {
  let data = { room, user };
  socketIO.emit(JOIN_ROOM, data);
}

(function newUserJoinedRoom() {
  socketIO.on(NEW_USER_JOINED, data => {
    console.log("new user joinded:::", data);
  });
})();

function sendNewMessage(room, user, message) {
  console.log("send new message");
  socketIO.emit(SEND_NEW_MESSAGE, { room, user, message });
}

(function receiveNewMessage() {
  socketIO.on(RECEIVE_NEW_MESSAGE, data => {
    console.log("receive new message");
    console.log(data);
    appendMessageToChat(data.message, data.user === email ? true : false);
  });
})();

// Join new user instantly on page load
joinRoom("1", { email });

// **************************************
// **************************************
// Manipulate DOM
// **************************************
// **************************************

// GET DOM ELEMENTS
const input = document.querySelector("input#input-message");
const chatWrapper = document.querySelector("ul#chat-wrapper");

input.addEventListener("keypress", e => {
  if (e.keyCode === 13) {
    let message = e.target.value.trim();
    e.target.value = "";

    if (message) {
      console.log(message);
      sendNewMessage("1", { email }, message);
      //   appendMessageToChat(message, true);
    }
  }
});

function appendMessageToChat(message, self) {
  let li = document.createElement("li");
  li.style.width = "100%";

  let msj = document.createElement("div");
  msj.classList.add(`${self ? "msj-rta" : "msj"}`, "macro");

  let text = document.createElement("div");
  text.classList.add("text", `${self ? "text-r" : "text-l"}`);

  let messageP = document.createElement("p");
  messageP.innerText = message;

  let timeP = document.createElement("p");
  let timePSmall = document.createElement("small");
  timePSmall.innerText = "3:00 PM";
  timeP.appendChild(timePSmall);

  let avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.style.padding = "0 0 0 10px !important";

  text.appendChild(messageP);
  text.appendChild(timeP);
  text.appendChild(avatar);
  li.appendChild(msj).appendChild(text);

  chatWrapper.appendChild(li);
}

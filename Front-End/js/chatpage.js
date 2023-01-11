const form = document.querySelector(".home-msg-form");
// console.log(form, "this is form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let chatMsg = document.querySelector(".message").value;
  let token = localStorage.getItem("token");
  let res = await axios.post(
    "http://localhost:3000/message",
    { message: chatMsg },
    {
      headers: { Authorization: token },
    }
  );
  chatMsg = "";
});

window.addEventListener("DOMContentLoaded", () => {
  try {
    // setInterval(() => {
    //   displayOnLoad();
    // }, 1000);
    displayOnLoad();
  } catch (error) {
    console.log(error, "error in displaying data");
  }
});

async function displayOnLoad() {
  let oldText = JSON.parse(localStorage.getItem("messages"));
  let lastMsgId;
  if (!oldText) {
    oldText = [];
    lastMsgId = 0;
  }
  if (lastMsgId != 0) {
    lastMsgId = oldText[oldText.length - 1].id;
  }
  let respose = await axios.get(
    `http://localhost:3000/message/?lastId=${lastMsgId}`
  );
  console.log(respose.data.message);
  if (respose.status == 200) {
    const newMsg = respose.data.message;
    const msg = oldText.concat(newMsg);
    if (msg.length > 20) {
      msg = msg.slice(msg.length - 20, msg.length);
    }
    localStorage.setItem("messages", JSON.stringify(msg));
    showChat(msg);
  }
}

function showChat(allMessage) {
  const chatBox = document.querySelector(".home-chat-msg-box");
  chatBox.innerHTML = "";
  allMessage.forEach((element) => {
    chatBox.innerHTML += `<p>${element.message}<p> <br>`;
  });
}

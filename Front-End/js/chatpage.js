const form = document.querySelector(".home-msg-form");
// console.log(form, "this is form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let chatMsg = document.querySelector(".message").value;
  //   console.log(box);
  let token = localStorage.getItem("token");
  let res = await axios.post(
    "http://localhost:3000/message",
    { message: chatMsg },
    {
      headers: { Authorization: token },
    }
  );
  chatMsg.value = "";
});

window.addEventListener("DOMContentLoaded", () => {
  try {
    setInterval(() => {
      displayOnLoad();
    }, 1000);
  } catch (error) {
    console.log(error, "error in displaying data");
  }
});

async function displayOnLoad() {
  let respose = await axios.get("http://localhost:3000/message");
  console.log(respose.data.message);
  let allMessage = respose.data.message;
  showChat(allMessage);
}

function showChat(allMessage) {
  const chatBox = document.querySelector(".home-chat-msg-box");
  chatBox.innerHTML = "";
  allMessage.forEach((element) => {
    chatBox.innerHTML += `<p>${element.message}<p> <br>`;
  });
}

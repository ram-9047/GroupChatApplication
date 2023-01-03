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
});

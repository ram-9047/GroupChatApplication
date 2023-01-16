const addGroupBtn = document.querySelector(".add-group-btn");
const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "chatpage.html";
});

addGroupBtn.addEventListener("click", async () => {
  let groupName = document.querySelector(".add-group-box").value;
  console.log(groupName);
  let token = localStorage.getItem("token");
  let res = await axios.post(
    `http://localhost:3000/createGroup`,
    {
      groupName,
    },
    {
      headers: { Authorization: token },
    }
  );
  console.log(res);
  if (res.status == 200) {
    window.location.href = "chatpage.html";
  }
});

// memberBackBtn.addEventListener("click", () => {
//   window.location.href = "chatpage.html";
// });

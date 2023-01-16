const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "chatpage.html";
});

const addMember = document.querySelector(".add-member-btn");
addMember.addEventListener("click", async () => {
  const email = document.querySelector(".member").value;
  let token = localStorage.getItem("token");
  let groupId = localStorage.getItem("activeGroup");
  //   console.log(groupId);
  let res = await axios.post(
    `http://localhost:3000/addMember`,
    {
      email,
      groupId,
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

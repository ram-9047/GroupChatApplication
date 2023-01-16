const form = document.querySelector(".home-msg-form");
// console.log(form, "this is form");
const createNewGroup = document.querySelector(".add-group-btn");
createNewGroup.addEventListener("click", () => {
  window.location.href = "addGroup.html";
});

const addNewMember = document.querySelector(".add-member-btn");
// console.log(addNewMember);
addNewMember.addEventListener("click", () => {
  window.location.href = "addMember.html";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let chatMsg = document.querySelector(".message").value;
  let token = localStorage.getItem("token");
  let groupId = localStorage.getItem("activeGroup");
  console.log(token, chatMsg);
  let res = await axios.post(
    "http://localhost:3000/message",
    { message: chatMsg, groupId },
    {
      headers: { Authorization: token },
    }
  );
  console.log(res, "this is reponse from backedn");
  chatMsg = "";
});

window.addEventListener("DOMContentLoaded", () => {
  try {
    // setInterval(() => {
    //   displayOnLoad();
    // }, 1000);
    displayGroupOnLoad();
  } catch (error) {
    console.log(error, "error in displaying data");
  }
});

async function displayGroupOnLoad() {
  let token = localStorage.getItem("token");
  let respose = await axios.get(`http://localhost:3000/getAllGroup`, {
    headers: { Authorization: token },
  });
  // console.log(respose, "response from backend");

  let groupBox = document.querySelector(".group-box-list");
  groupBox.innerHTML = "";
  let groupName = respose.data.groups;

  groupName.forEach((group) => {
    groupBox.innerHTML += `
    <div class="group-box" id=${group.id}>
            <h5>${group.name}</h5>
            <button class="del-btn">Del</button>
          </div>

    `;
  });
}

async function fetchAndShowMembers(groupId) {
  let token = localStorage.getItem("token");
  let respose = await axios.get(
    `http://localhost:3000/getAllMembers/?groupId=${groupId}`,
    {
      headers: { Authorization: token },
    }
  );
  if (respose.status == 200) {
    let allMembers = respose.data.members;
    // console.log(allMembers);
    showMembers(allMembers);
  }
}
function showMembers(allMembers) {
  let memberBody = document.querySelector(".member-name");
  memberBody.addEventListener("click", (e) => handleUsers(e));
  memberBody.innerHTML = "";
  allMembers.forEach((member) => {
    if (member.isAdmin) {
      memberBody.innerHTML += `<li class="member-list">
                    ${member.dataValues.name} <b>-Admin</b>
                    <div class="edit-box">
                    <button class="rmadminbtn" id="${member.dataValues.id}">Remove Admin</button>
                    <button class="rmuserbtn" id="${member.dataValues.id}">Remove User</button>
                    </div>
                </li>`;
    } else {
      memberBody.innerHTML += `<li class="member-list">
                    ${member.dataValues.name}
                    <div class="edit-box">
                    <button class="makeadminbtn" id="${member.dataValues.id}">Make Admin</button>
                    <button class="rmuserbtn" id="${member.dataValues.id}">Remove User</button>
                    </div>
                </li>`;
    }
  });
}

function handleUsers(e) {
  let userId = e.target.id;
  let name = e.target.className;
  let token = localStorage.getItem("token");
  let groupID = localStorage.getItem("activeGroup");
  // console.log(name, id);
  if (name == "makeadminbtn") {
    // console.log(userId, groupID);
    makeAdmin(userId, token, groupID);
  }
  if (name == "rmadminbtn") {
    // console.log(userId, groupID);
    removeAdmin(userId, token, groupID);
  }
  if (name == "rmuserbtn") {
    // console.log(userId, groupID);
    removeUser(userId, token, groupID);
  }
}

async function makeAdmin(userId, token, groupID) {
  let res = await axios.post(
    "http://localhost:3000/makeAdmin",
    {
      groupID,
      userId,
    },
    {
      headers: { Authorization: token },
    }
  );
  console.log(res);
  if (res.status == 200) {
    fetchAndShowMembers(groupID);
  }
  if (res.status == 403) {
    alert("permission denied");
  }
}

async function removeAdmin(userId, token, groupID) {
  let res = await axios.post(
    "http://localhost:3000/removeAdmin",
    {
      groupID,
      userId,
    },
    {
      headers: { Authorization: token },
    }
  );
  console.log(res, "this is res");
  if (res.status == 200) {
    fetchAndShowMembers(groupID);
  }
}

async function removeUser(userId, token, groupID) {
  try {
    let res = await axios.post(
      "http://localhost:3000/removeMember",
      {
        groupID,
        userId,
      },
      {
        headers: { Authorization: token },
      }
    );
    console.log(res, "this is response");
    if (res.status == 200) {
      fetchAndShowMembers(groupID);
    }
  } catch (error) {
    if (error.response.status == 403) {
      alert("permission denied");
    }
  }
}
//------------------ Group functions
let groupBox = document.querySelector(".group-box-list");
groupBox.addEventListener("click", (e) => {
  let groupId;
  let previntervalId = localStorage.getItem("intervalId");
  if (previntervalId) {
    clearInterval(previntervalId);
  }
  if (e.target.nodeName == "H5") {
    groupId = e.target.parentElement.id;
    document.getElementById("activeGroup").innerHTML = e.target.innerHTML;
  }
  if (e.target.nodeName == "DIV") {
    groupId = e.target.id;
    document.getElementById("activeGroup").innerHTML = e.target.innerHTML;
  }
  if (e.target.nodeName == "BUTTON") {
    groupId = e.target.parentElement.id;
    return deleteGroup(groupId);
  }

  localStorage.setItem("activeGroup", `${groupId}`);
  fetchAndShowMembers(groupId);

  let intervalId = setInterval(() => {
    fetchChatAndShow(groupId, intervalId);
  }, 1000);
});

async function deleteGroup() {
  let id = localStorage.getItem("activeGroup");
  let token = localStorage.getItem("token");
  let res = await axios.post(
    "http://localhost:3000/deleteGroup",
    {
      id: id,
    },
    {
      headers: { Authorization: token },
    }
  );

  if (res.status == 200) {
    alert("Group Deleted");
    displayGroupOnLoad();
  } else {
    alert("You are not an ADMIN");
  }
}

// ----------------chat function

async function fetchChatAndShow(groupId, intervalId) {
  // let groupId = groupId;
  localStorage.setItem("intervalId", intervalId);
  let oldText = JSON.parse(localStorage.getItem("messages"));
  let lastMsgId;
  // console.log(oldText);
  if (!oldText || oldText.length == 0) {
    oldText = [];
    lastMsgId = 0;
  }
  if (lastMsgId != 0) {
    lastMsgId = oldText[oldText.length - 1].id;
  }
  // console.log(lastMsgId);
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

    const msgToShow = msg.filter((item) => item.groupId == groupId);
    showChat(msgToShow);
  }
}

function showChat(allMessage) {
  const chatBox = document.querySelector(".home-chat-msg-box");
  chatBox.innerHTML = "";
  allMessage.forEach((element) => {
    chatBox.innerHTML += `<p>${element.message}<p> <br>`;
  });
}

const form = document.getElementById("signup_form");

form.addEventListener("submit", async function onSubmit(e) {
  e.preventDefault();
  console.log("submit");
  let userName = document.getElementById("userName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let number = document.getElementById("number").value;
  console.log(userName, email, password, number);

  if (userName && email && password && number) {
    let res = await axios.post("http://localhost:3000/signup", {
      userName,
      email,
      password,
      number,
    });
    userName = "";
    email = "";
    password = "";
    number = "";

    console.log(res, "this is response from backend");
    if (res.status == 200) {
      swal({
        title: "Account Created",
        text: "Click on Login",
        icon: "success",
        button: "Login",
      });
      window.location.href = "./signin.html";
    } else if (res.status == 201) {
      swal({
        title: "❌❌ Error ❌❌",
        text: "Email already exist.",
        icon: "error",
      });
      window.location.href = "./signup.html";
    } else {
      swal({
        title: "❌❌ Error ❌❌",
        text: "Incorrect credentials.",
        icon: "error",
      });
      window.location.href = "./signup.html";
    }
  } else if (userName == "") {
    swal({
      title: " ⚠️⚠️ Warning !!! ⚠️⚠️",
      text: "Please enter your full name",
      icon: "warning",
    });
  } else if (email == "") {
    swal({
      title: " ⚠️⚠️ Warning !!! ⚠️⚠️",
      text: "Please enter your email-id",
      icon: "warning",
    });
  } else if (password == "") {
    swal({
      title: " ⚠️⚠️ Warning !!! ⚠️⚠️",
      text: "Please enter the password",
      icon: "warning",
    });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  // alert("hi");
  // swal({ warning: "nope" });
  // swal({
  //   title: "Account Created",
  //   text: "Click on Login",
  //   icon: "success",
  //   button: "Login",
  // });
});

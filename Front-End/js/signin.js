const form = document.querySelector(".login-card-form");
// console.log(form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (email && password) {
    try {
      let res = await axios.post("http://localhost:3000/signin", {
        email,
        password,
      });
      console.log(res);
      console.log(res.data.user[0].isPremium, "response form backend");
      if (res.status == 200) {
        let token = res.data.token;
        // console.log(token);
        localStorage.setItem("token", `${token}`);
        alert("loggin in ");
        window.location.href = "./homepage.html";
      }
    } catch (error) {
      if (error.response.status == 401) {
        alert("Wrong Password");
      } else {
        alert("User Not Found");
      }
      window.location.href = "./signin.html";
    }
  }
});

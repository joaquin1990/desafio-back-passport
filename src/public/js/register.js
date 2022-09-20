// Register logic
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(registerForm);
  let obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status == 200) {
        window.location.href = "/";
      }
    })
    .catch((error) => console.log(error));
});

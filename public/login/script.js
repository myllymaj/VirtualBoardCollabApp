const loginForm = document.getElementById("loginForm");
const loggedInUser = document.getElementById("loggedInUser");
const loggedInContent = document.getElementById("loggedInContent");
const logoutButton = document.getElementById("logoutButton");
const boardButton = document.getElementById("boardButton");
const myForm = document.getElementById("myForm");
const registerButton = document.getElementById("registerButton");
const modal = document.getElementById("myModal");
const btn = document.getElementById("closeModal");
const registrationForm = document.getElementById("registrationForm");
const content = document.getElementById("content");
//chatgpt modification
//chatgpt modification
//chatgpt modification

document.addEventListener("DOMContentLoaded", function () {

  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    loginForm.style.display = "none";
    registerButton.style.display = "none";
    loggedInUser.style.display = "flex";
    loggedInContent.style.display = "flex";
    logoutButton.style.display = "flex";
    boardButton.style.display = "flex";
    myForm.style.display = "flex";
    content.style.display = "flex";
    const usernameDisplay = document.getElementById('loggedInUser');
    const usernamer = localStorage.getItem('username')
    //console.log(usernamer)
    usernameDisplay.innerHTML = `Välkommen &nbsp;<span style="text-transform:uppercase;">${usernamer}</span>`;




    // tokenDisplay.textContent = `JWT token: ${data.token}
    //console.log("Cookie sparad "+localStorage.getItem("jwtToken"));

    populateDropdown();
  }

  // Add your event listeners and other JavaScript functionality here
});



//login

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const tokenDisplay = document.getElementById('tokenDisplay');



  const apiUrl = 'http://localhost:3030/users/login';

  try {

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {

      const isLoginSuccessful = true;
      if (isLoginSuccessful) {
        loginForm.style.display = "none";
        registerButton.style.display = "none";
        loggedInUser.textContent = "You are logged in!";
        loggedInUser.style.display = "flex";
        loggedInContent.style.display = "flex";
        logoutButton.style.display = "flex";
        boardButton.style.display = "flex";
        myForm.style.display = "flex";
        content.style.display = "flex";
      }


      //console.log(data.username)
      const usernameDisplay = document.getElementById('loggedInUser');
      usernameDisplay.innerHTML = `Välkommen &nbsp;<span style="text-transform:uppercase;">${data.username}</span>`;
      const tokenDisplay = document.getElementById('tokenDisplay');
      localStorage.setItem("jwtToken", data.token);
      // console.log('JWT token:', data.token);
      //  console.log('ID:', data.userId);
      //console.log("Roles: ", data.roles)
      //  console.log("Boards: ", data.boards)
      localStorage.setItem('username', data.username);
      localStorage.setItem('boards', JSON.stringify(data.boards));


      // tokenDisplay.textContent = `JWT token: ${data.token}
      //console.log("Cookie sparad "+localStorage.getItem("jwtToken"));

      populateDropdown();
    } else {
      console.error('Error:', data.msg);
    }
  } catch (error) {
    console.error('Error:', error);
  }



});
logoutButton.addEventListener("click", function () {

  loginForm.style.display = "flex";
  registerButton.style.display = "flex";
  loggedInUser.style.display = "none";
  logoutButton.style.display = "none";
  loggedInContent.style.display = "none";
  logoutButton.style.display = "none";
  myForm.style.display = "none";
  content.style.display = "none";
  //localStorage.clear();
  localStorage.removeItem("jwtToken")
  localStorage.removeItem("username")
  localStorage.removeItem("boards")
  location.reload();
});



//dropdown
//chatgpt modification
//chatgpt modification
//chatgpt modification


async function populateDropdown() {
  const dropdown = document.getElementById('dropdown');
  const checkToken = localStorage.getItem("jwtToken")
  const userBoards = JSON.parse(localStorage.getItem('boards'))


  // console.log('userBoards:', userBoards);

  try {

    dropdown.innerHTML = '';
    for (const id of userBoards) {

      const response = await fetch(`http://localhost:3030/board/${id}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + checkToken,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const board = await response.json();

      const option = document.createElement('option');
      option.value = board.boardName;
      option.textContent = board.boardName;
      dropdown.appendChild(option);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

registerButton.onclick = function () {
  modal.style.display = "block";
}


btn.onclick = function () {
  modal.style.display = "none";
}


window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const thankYouModal = document.getElementById("thankYouModal");
const closeThankYouModal = document.getElementById("closeThankYouModal");

//chatgpt modification
//chatgpt modification
//chatgpt modification

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;


  const userData = {
    username: username,
    email: email,
    password: password,
    roles: ["new member"],
    boards: ["651b00fc54de3de09dd28dbc"]
  };


  fetch('http://localhost:3030/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Server response:', data);

      closeModal();
      thankYouModal.style.display = "block";

    })
    .catch((error) => {
      console.error('Error:', error);

    });
  function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";


    usernameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  }


  closeThankYouModal.onclick = function () {
    thankYouModal.style.display = "none";
  }
});





////////////////////////////////////
////////////WebSockets/////////////
///////////////////////////////////


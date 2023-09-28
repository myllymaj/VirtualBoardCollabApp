


//login
const loginForm = document.getElementById("loginForm");
const loggedInUser = document.getElementById("loggedInUser");
const loggedInContent = document.getElementById("loggedInContent");
const logoutButton = document.getElementById("logoutButton");
const boardButton = document.getElementById("boardButton");
const myForm = document.getElementById("myForm");
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
            populateDropdown();
            const isLoginSuccessful = true;
            if (isLoginSuccessful) {
                loginForm.style.display = "none";
                loggedInUser.textContent = "You are logged in!";
                loggedInUser.style.display = "flex";
                loggedInContent.style.display = "flex";
                logoutButton.style.display = "flex";
                boardButton.style.display = "flex";
                myForm.style.display = "flex";
            }


            console.log(data.username)
            const usernameDisplay = document.getElementById('loggedInUser');
            usernameDisplay.innerHTML = `Välkommen &nbsp;<span style="text-transform:uppercase;">${data.username}</span>`;

            console.log('JWT token:', data.token);
            console.log('ID:', data.userId);
            console.log("Roles: ", data.roles)
            console.log("Boards: ", data.boards)

            const tokenDisplay = document.getElementById('tokenDisplay');
            // tokenDisplay.textContent = `JWT token: ${data.token}`;
            localStorage.setItem("jwtToken", data.token);
            //console.log("Cookie sparad "+localStorage.getItem("jwtToken"));
        } else {
            console.error('Error:', data.msg);
        }
    } catch (error) {
        console.error('Error:', error);
    }



});
logoutButton.addEventListener("click", function () {

    loginForm.style.display = "flex";
    loggedInUser.style.display = "none";
    logoutButton.style.display = "none";
    loggedInContent.style.display = "none";
    logoutButton.style.display = "none";
    myForm.style.display = "none";
    //localStorage.clear();
    location.reload();
});



//dropdown
async function populateDropdown() {
    const dropdown = document.getElementById('dropdown');
    const checkToken = localStorage.getItem("jwtToken")
    try {
  
      const response = await fetch('http://localhost:3030/board', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' +checkToken, 
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const boards = await response.json();
      dropdown.innerHTML = '';
      boards.forEach((board) => {
        const option = document.createElement('option');
        option.value = board.id;
        option.textContent = board.board;
        dropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }


 

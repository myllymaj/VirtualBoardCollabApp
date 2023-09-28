


//login
const loginForm = document.getElementById("loginForm");
const loggedInUser = document.getElementById("loggedInUser");
const loggedInContent = document.getElementById("loggedInContent");
const logoutButton = document.getElementById("logoutButton");
const boardButton = document.getElementById("boardButton");
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
                loggedInUser.textContent = "You are logged in!";
                loggedInUser.style.display = "flex";
                loggedInContent.style.display = "flex";
                logoutButton.style.display = "flex";
                boardButton.style.display = "flex";
            }


            console.log(data.username)
            const usernameDisplay = document.getElementById('loggedInUser');
            usernameDisplay.innerHTML = `Välkommen &nbsp;<span style="text-transform:uppercase;">${data.username}</span>`;

            console.log('JWT token:', data.token);
            console.log('ID:', data.userId);
            console.log("roller: ", data.roles)

            const tokenDisplay = document.getElementById('tokenDisplay');
            // tokenDisplay.textContent = `JWT token: ${data.token}`;
            localStorage.setItem("jwtToken", data.token);
            //onsole.log("Cookie sparad "+localStorage.getItem("jwtToken"));
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
    localStorage.clear();
    location.reload();
});


document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var selectedOption = document.getElementById('dropdown').value;
    
    // Send a GET request with the selected option
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/path_to_your_server_endpoint?selectedOption=' + selectedOption, true);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Success, do something with the response
            document.getElementById('result').innerHTML = xhr.responseText;
        } else {
            // Error handling
            console.error(xhr.statusText);
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error');
    };
    
    xhr.send();
});

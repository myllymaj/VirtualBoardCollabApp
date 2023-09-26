


//login
const loginForm = document.getElementById("loginForm");
const loggedInUser = document.getElementById("loggedInUser");
const logoutButton = document.getElementById("logoutButton");
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
        loggedInUser.style.display = "block";
        logoutButton.style.display ="block";
    }

    
        console.log(data.username)
        const usernameDisplay = document.getElementById('loggedInUser');
        usernameDisplay.innerHTML = `Välkommen <strong>${data.username}</strong>`;

        console.log('JWT token:', data.token);
        console.log('ID:', data.userId);

        const tokenDisplay = document.getElementById('tokenDisplay');
        tokenDisplay.textContent = `JWT token: ${data.token}`;
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
    logoutButton.style.display ="none";
    location.reload();
});
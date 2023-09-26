function toggleRegisterForm() {
    var registerForm = document.getElementById("registerForm");
    registerForm.classList.toggle("hidden");
}


function toggleRegisterForm() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.remove('hidden');
}

function returnToLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('registerPage').classList.add('hidden');
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {

});

document.getElementById('registerForm').addEventListener('submit', async function (event) {

});
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tokenDisplay = document.getElementById('tokenDisplay');
        



  
''




    function updateDisplay(value) {
        if (value) {
            tokenDisplay.textContent = 'none';
        } else {
            tokenDisplay.style.display = value;
        }
    }


    const randVal = ''; 
    
    updateDisplay(randVal);
    
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
            console.log('Inloggad');
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

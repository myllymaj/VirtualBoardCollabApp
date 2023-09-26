
function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const cookieValue = encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
  document.cookie = name + "=" + cookieValue;
}


function getCookie(name) {
  const cookieName = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
    }
  }
  return null;
}



function isLoggedIn() {
    return !!localStorage.getItem('jwtToken') || !!getCookie('jwtToken');
  }

  if (isLoggedIn()) {
    console.log('User is logged in.');
    fetchUserBoards(); // 
  } else {
    console.log('User is not logged in.');
  }
  






//login

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tokenDisplay = document.getElementById('tokenDisplay');
/*
    function updateDisplay(value) {
  if (value) {
    tokenDisplay.style.display = 'none';
  } else {
    tokenDisplay.style.display = value;
  }
}
updateDisplay();
*/

    
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
      
            const jwtTok = data.token;
            console.log('JWT token:', data.token);
            localStorage.setItem('jwtToken',jwtTok);
            setCookie('jwtToken', jwtTok,1);
            console.log('ID:', data.userId);
          
            const tokenDisplay = document.getElementById('tokenDisplay');
          
            console.log(localStorage.getItem('jwtToken'))
            //tokenDisplay.textContent = `JWT token: ${data.token}`;
            
           
            fetchUserBoards();
          } else {
            console.error('Error:', data.msg);
          }
    } catch (error) {
        console.error('Error:', error);
    }



});

//hämta boards om successful login
async function fetchUserBoards() {
console.log("hämta in boards")
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (!jwtToken) {
      console.error('JWT token is missing.');
      return;
    }
  
    const apiUrl = 'http://localhost:3030/boards'; 
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': jwtToken,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        
        const boardsList = document.getElementById('boardsList');
        boardsList.innerHTML = ''; 
  
        if (data.length === 0) {
          boardsList.textContent = 'Ingen Virtual Board hittades';
        } else {
          data.forEach((board) => {
            const boardItem = document.createElement('li');
            boardItem.textContent = board.name; 
            boardsList.appendChild(boardItem);
          });
        }
  
    
        document.getElementById('userBoards').style.display = 'block';
      } else {
        console.error('Error:', data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  


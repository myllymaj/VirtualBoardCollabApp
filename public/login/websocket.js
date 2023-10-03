//chatgpt
//chatgpt
//chatgpt




let socket;
// Define a function to create or update the WebSocket connection

//kan kalla på createWebsocket från en annat script, i detta fall i script.js nör jag väljer dropdown option
window.createWebSocketConnection = function () {
    const boardId = localStorage.getItem('currentBoardId');
    const WS_TOKEN = localStorage.getItem('access_token');

    // Construct the WebSocket URL with the new boardId
    const WS_URL = `ws://localhost:5000?token=${WS_TOKEN}&board_id=${boardId}`;
    console.log(WS_URL);

    // Close the existing WebSocket connection (if it exists)
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    // Create a new WebSocket connection
    socket = new WebSocket(WS_URL);

    // Connection established 
    socket.onopen = function (event) {
        console.log('Connected to WebSocket server');
    };

    // Message listener
    socket.onmessage = function (event) {
        console.log('Received message:', event.data);
        const data = JSON.parse(event.data);

        if (data.type == 'paste') {
            document.querySelector('#out').innerHTML = data.text;
            document.querySelector('#err').innerHTML = '';
        } else if (data.type == 'error') {
            document.querySelector('#err').innerHTML = data.msg;
        }
    };

    // Connection closed 
    socket.onclose = function (event) {
        console.log('Connection closed');
    };

    document.querySelector('#in').addEventListener('input', (evt) => {
        socket.send(JSON.stringify({
            type: 'paste',
            text: evt.target.value
        }));
    });
}



// Initial WebSocket connection creation
window.createWebSocketConnection();

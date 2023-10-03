

let socket;
// Define a function to create or update the WebSocket connection

//kan kalla på createWebsocket från en annat script, i detta fall i script.js nör jag väljer dropdown option
window.createWebSocketConnection = function () {
    const boardId = localStorage.getItem('currentBoardId');
    const WS_TOKEN = localStorage.getItem('access_token');

    // Construct the WebSocket URL with the new boardId
    const WS_URL = `ws://localhost:5000?token=${WS_TOKEN}&board_id=${boardId}`;
    //console.log(WS_URL);

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
    
        if (data.type === 'createStickyNote') {
            // Create a new sticky note with the received data
            const note = document.createElement("div");
            note.classList.add("sticky-note");
            note.style.left = data.left;
            note.style.top = data.top;
            note.style.backgroundColor = data.backgroundColor;
    
            const deleteButton = document.createElement("span");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "x";
    
            const textarea = document.createElement("textarea");
            textarea.value = data.text;
    
            note.appendChild(deleteButton);
            note.appendChild(textarea);
            app.appendChild(note);
        }
    };
    // Connection closed 
    socket.onclose = function (event) {
        console.log('Connection closed');
    };

    document.querySelector('#app').addEventListener('input', (evt) => {
        socket.send(JSON.stringify({
            type: 'paste',
            text: evt.target.value
        }));
    });
}


const newNoteButton = document.getElementById("newNoteButton");
newNoteButton.addEventListener("click", createStickyNote);
let noteCounter = 0;
function createStickyNote() {
    const note = document.createElement("div");
    note.classList.add("sticky-note");
    note.style.left = "200px";
    note.style.top = "200px";

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", () => {
        // Handle delete button click here (e.g., remove the note)
        app.removeChild(note);
    });

    const colors = ["lightgreen", "lightblue", "pink"];
    for (const color of colors) {
        const colorButton = document.createElement("span");
        colorButton.classList.add("color-button");
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener("click", () => {
            note.style.backgroundColor = color;
        });
        note.appendChild(colorButton);
    }

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Type your note here...";
    const textareaId = `stickyNoteTextArea${noteCounter}`;
    textarea.id = textareaId;

    note.appendChild(deleteButton);
    note.appendChild(textarea);
    app.appendChild(note);

    // Now that the note is fully configured, send a WebSocket message to inform the server about the new sticky note
    socket.send(JSON.stringify({
        type: 'createStickyNote',
        left: note.style.left,
        top: note.style.top,
        backgroundColor: note.style.backgroundColor,
        text: textarea.value,
        id: textareaId
    }));
    noteCounter++;
}



// Initial WebSocket connection creation
window.createWebSocketConnection();

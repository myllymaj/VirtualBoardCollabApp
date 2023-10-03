
//chatgpt
//chatgpt
//chatgpt

let socket;

function displayNotesForCurrentBoard(boardId) {
    const allNotes = document.querySelectorAll(".sticky-note");
    
    allNotes.forEach((note) => {
        const noteBoardId = note.getAttribute("data-board-id");

        if (noteBoardId === boardId) {
           
            note.style.display = "block";
        } else {
         
            note.style.display = "none";
        }
    });
}

window.createWebSocketConnection = function () {
    const boardId = localStorage.getItem('currentBoardId');
    const WS_TOKEN = localStorage.getItem('access_token');


    const WS_URL = `ws://localhost:5000?token=${WS_TOKEN}&board_id=${boardId}`;
    //console.log(WS_URL);


    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }


    socket = new WebSocket(WS_URL);


    socket.onopen = function (event) {
        console.log('Connected to WebSocket server');
    };


    socket.onmessage = function (event) {
        console.log('Received message:', event.data);
        const data = JSON.parse(event.data);

        if (data.type === 'paste') {
            const textareaId = data.id;
            const text = data.text;
            const boardId = data.boardId;

  
            const existingNote = document.getElementById(textareaId);

            if (existingNote) {
         
                existingNote.style.left = data.left;
                existingNote.style.top = data.top;
                existingNote.style.backgroundColor = data.backgroundColor;
                existingNote.value = text; 
            } else {
              
                const note = document.createElement("div");
                note.classList.add("sticky-note");
                note.style.left = data.left;
                note.style.top = data.top;
                note.style.backgroundColor = data.backgroundColor;

                const deleteButton = document.createElement("span");
                deleteButton.classList.add("delete-button");
                deleteButton.innerHTML = "x";

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
                textarea.value = text; 
                textarea.id = textareaId;

                note.appendChild(deleteButton);
                note.appendChild(textarea);
                app.appendChild(note);
               
            }
          
        }
    };

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

window.addEventListener('storage', (e) => {
    if (e.key === 'noteCounter') {

        const updatedValue = e.newValue;
        localStorage.setItem('noteCounter', updatedValue);

        noteCounter = updatedValue;
    }
});
let noteCounter = localStorage.getItem('noteCounter') || 0;

function createStickyNote() {
    const boardId = localStorage.getItem('currentBoardId');
    const note = document.createElement("div");
    note.classList.add("sticky-note");


    const initialLeft = "50px";
    const initialTop = "50px";
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "x";


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
    note.setAttribute("data-board-id", boardId);
    const currentBoardId = localStorage.getItem('currentBoardId');
displayNotesForCurrentBoard(currentBoardId);

    socket.send(JSON.stringify({
        type: 'paste',
        left: initialLeft,
        top: initialTop,
        backgroundColor: note.style.backgroundColor,
        text: textarea.value,
        id: textareaId,
        boardId: boardId,
    }));
    noteCounter++;
    localStorage.setItem('noteCounter', noteCounter);
}



window.createWebSocketConnection();

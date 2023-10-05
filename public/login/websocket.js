function displayNotesForCurrentBoard(boardId) {
    const allNotes = document.querySelectorAll(".sticky-note");

    allNotes.forEach((note) => {
        const noteBoardId = note.getAttribute("data-board-id");

        if (noteBoardId != boardId) {
            note.style.display = "none"; // Hide notes with different boardId
        }
    });
}
window.addEventListener('storage', (e) => {
    console.log('Storage event fired:', e.key, e.newValue);
    if (e.key === 'currentBoardId') {
        const updatedBoardId = e.newValue;
        console.log('Updated boardId:', updatedBoardId);
        
        displayNotesForCurrentBoard(updatedBoardId);
    }
});
const noteC = document.getElementById("noteC");


noteC.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("sticky-note")) {
        isDragging = true;
        currentNote = e.target;
        
        const rect = currentNote.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        currentNote.style.zIndex = zIndex++;
    }
});

noteC.addEventListener("mousemove", (e) => {
    if (isDragging) {
        e.preventDefault(); // Prevent text selection while dragging
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        currentNote.style.left = x + "px";
        currentNote.style.top = y + "px";
    }
});

noteC.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
    }
});
let socket;

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

document.addEventListener("DOMContentLoaded", () => {
const newNoteButton = document.getElementById("newNoteButton");
newNoteButton.addEventListener("click", createStickyNote);






/////////////////////////////////////////////////////////////////////////////get notes
/////////////////////////////////////////////////////////////////////////////get notes
/////////////////////////////////////////////////////////////////////////////get notes
const boardId = localStorage.getItem('currentBoardId');
window.getNotesByBoardId =async function (boardId) {
    const checkToken = localStorage.getItem("jwtToken")
    try {
        const xd = localStorage.getItem('currentBoardId');
        displayNotesForCurrentBoard(xd);
      

        const response = await fetch(`http://localhost:3030/notes/?boardId=${boardId}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + checkToken,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const notes = await response.json();
      

        
        // Assuming you want to create a new container for the notes
        
        noteC.classList.add("sticky-note-container"); // You can use any class name you prefer

        notes.forEach((note) => {
            const noteId = note.id
            const noteElement = document.createElement("div");
            noteElement.classList.add("sticky-note");
            noteElement.style.left = note.x + "px";
            noteElement.style.top = note.y + "px";

            noteElement.style.backgroundColor = note.color;
            const colors = ["lightgreen", "lightblue", "pink"];
            for (const color of colors) {
                const colorButton = document.createElement("span");
                colorButton.classList.add("color-button");
                colorButton.style.backgroundColor = color;
                colorButton.addEventListener("click", () => {
                    noteElement.style.backgroundColor = color;
                });
                noteElement.appendChild(colorButton);
            }

            const deleteButton = document.createElement("span");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "x";
           
            deleteButton.addEventListener("click", async () => {
                try {
                    // Send a DELETE request to the server to delete the note
                    const deleteResponse = await fetch(`http://localhost:3030/notes/${noteId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + checkToken,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (deleteResponse.ok) {
                        // If the delete request is successful, remove the note from the UI
                        noteC.removeChild(noteElement);
                    } else {
                        throw new Error('Failed to delete note');
                    }
                } catch (error) {
                    console.error('Error deleting note:', error);
                }
            });




            
        
            const textarea = document.createElement("textarea");
            textarea.value = note.content; 
            textarea.placeholder = "Type your note here...";
            noteElement.id = noteId;
         
                noteElement.addEventListener("mousedown", (e) => {
                    currentNote = e.target; 
                    const currId= currentNote.id
                    console.log("hee " +noteElement.boardId)
                    const updatedContent = textarea.value;
                    const updatedData = {
                      content: updatedContent,
                      color: currentNote.style.backgroundColor,
                      x: parseFloat(currentNote.style.left),
                      y: parseFloat(currentNote.style.top),
                      boardId: boardId,
                    };
                    updateNote(currId, updatedData);
            
                });
        
       
         
            if (currentNote) {
                const noteId = currentNote.id; // Get the note ID
                console.log("Current note ID: " + noteId);
            } else {
                console.log("No current note selected.");
            }
           noteElement.appendChild(deleteButton);
            noteElement.appendChild(textarea);

            noteElement.setAttribute("data-board-id", boardId);
            noteC.appendChild(noteElement);
         
        });

       
        document.body.appendChild(noteC);

        console.log('Notes:', notes);
       
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

const board = localStorage.getItem('currentBoardId');
getNotesByBoardId(board)

// Call this function with the appropriate boardId



//////////////////////////////////////////////////////////////skapa note knapp
async function createStickyNote() {
    const boardId = localStorage.getItem('currentBoardId');


    const note = document.createElement("div");

    note.classList.add("sticky-note-container");
    note.classList.add("sticky-note");
    note.style.left = "150px"
    note.style.top = "150px"

    const initialLeft =   note.style.left
    const initialTop = note.style.top


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

  


        note.addEventListener("mousedown", (e) => {
            currentNote = e.target; 
            const currId= currentNote.id
            const updatedContent = textarea.value;
            const updatedData = {
                content: updatedContent,
                color: currentNote.style.backgroundColor,
                x: parseFloat(currentNote.style.left),
                y: parseFloat(currentNote.style.top),
                boardId: boardId,
            };
            updateNote(currId, updatedData);
    
        });






      note.appendChild(deleteButton);
    note.appendChild(textarea);
    app.appendChild(note);
    note.setAttribute("data-board-id", boardId);
    noteC.appendChild(app);
    const currentBoardId = localStorage.getItem('currentBoardId');





const checkToken = localStorage.getItem("jwtToken")
const x = parseFloat(initialLeft);
const y = parseFloat(initialTop);
console.log("current boardid" +currentBoardId)
//save to db
const noteData = {
    content: " ",
    color: note.style.backgroundColor,
    x: x,
    y: y,
    boardId: currentBoardId,
};

const response = await fetch('http://localhost:3030/notes', {
    method: 'POST',
    headers: {
        Authorization: 'Bearer ' + checkToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
})
const data = await response.json();
//console.log(data.id)

const saveId = data.id;
console.log("current note id" +saveId)
note.id = saveId;





    socket.send(JSON.stringify({
        type: 'paste',
        left: initialLeft,
        top: initialTop,
        backgroundColor: note.style.backgroundColor,
        text: textarea.value,
        id: saveId,
        boardId: currentBoardId,
    }));

 

    
    deleteButton.addEventListener("click", async (e) => {
        try {
            const checkToken = localStorage.getItem("jwtToken")
            // Send a DELETE request to the server to delete the note
            const deleteResponse = await fetch(`http://localhost:3030/notes/${saveId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + checkToken,
                    'Content-Type': 'application/json',
                },
            });

            if (deleteResponse.ok) {
                if (e.target.classList.contains("delete-button")) {
                    e.target.parentElement.remove();
                }
            } else {
                throw new Error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    });

}

async function updateNote(noteId, updatedData) {
    try {
        const checkToken = localStorage.getItem("jwtToken")
        
        console.log(noteId)
      const response = await fetch(`http://localhost:3030/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + checkToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        // The update was successful
      } else {
        throw new Error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }


  



});

    window.createWebSocketConnection();


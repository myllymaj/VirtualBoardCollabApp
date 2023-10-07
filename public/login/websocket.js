//ALOT OF CHATGPT HELP.
//ALOT OF CHATGPT HELP.
//ALOT OF CHATGPT HELP.
//     :)
async function updateNote(noteId, updatedData) {
    try {
        const checkToken = localStorage.getItem("jwtToken")
//http://localhost:3030/
        const response = await fetch(`https://virtualboardcollabapp.azurewebsites.net/notes/${noteId}`, {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + checkToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            console.log("Note saved.")
        }

        else {
            throw new Error('Failed to update note');
        }
    } catch (error) {
        //console.error('Error updating note:', error);
    }

    socket.send(JSON.stringify({
        type: 'paste',
        left: updatedData.x,
        top: updatedData.y,
        backgroundColor: updatedData.color,
        text: updatedData.content,
        id: noteId,
        boardId: updatedData.boardId,
    }));
}
function displayNotesForCurrentBoard(boardId) {
    const allNotes = document.querySelectorAll(".sticky-note");

    allNotes.forEach((note) => {
        const noteBoardId = note.getAttribute("data-board-id");

        if (noteBoardId != boardId) {
            note.style.display = "none";
        }
    });
}
window.addEventListener('storage', (e) => {
    //console.log('Storage event fired:', e.key, e.newValue);
    if (e.key === 'currentBoardId') {
        const updatedBoardId = e.newValue;
        //console.log('Updated boardId:', updatedBoardId);

        displayNotesForCurrentBoard(updatedBoardId);
    }
});



const app = document.getElementById("app");
let zIndex = 1;
let isDragging = false;
let offsetX, offsetY, currentNote;
app.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("sticky-note")) {
        isDragging = true;
        currentNote = e.target;
        //console.log(currentNote.id)
        const rect = currentNote.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        currentNote.style.zIndex = zIndex++;
    }
});

app.addEventListener("mousemove", (e) => {
    if (isDragging) {
        e.preventDefault();
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        //console.log(currentNote.id)
        currentNote.style.left = x + "px";
        currentNote.style.top = y + "px";
    }
});

app.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
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
        e.preventDefault();
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

    //http://localhost:5000/
    const WS_URL = `wss://vbwebsocket.azurewebsites.net?token=${WS_TOKEN}&board_id=${boardId}`;
    //console.log(WS_URL);




    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }


    socket = new WebSocket(WS_URL);


    socket.onopen = function (event) {
        console.log('Connected to WebSocket server');
    };


    socket.onmessage = function (event) {
        //console.log('Received message:', event.data);
        const data = JSON.parse(event.data);
        //console.log(data)
        if (data.type === 'paste') {


            const updatedNote = document.getElementById(data.id);
            //console.log(data)

            if (updatedNote) {
                updatedNote.style.left = data.left + 'px';
                updatedNote.style.top = data.top + 'px';
                updatedNote.style.backgroundColor = data.backgroundColor;
                updatedNote.querySelector('textarea').value = data.text;
            }
        }
        if (data.type === 'deleteNote') {
            const deletedNote = document.getElementById(data.id);

            deletedNote.parentNode.removeChild(deletedNote);

        }
        if (data.type === 'createNote') {

            const note = document.createElement("div");

            note.classList.add("sticky-note-container");
            note.classList.add("sticky-note");
            note.style.left = "150px"
            note.style.top = "150px"
            note.id = data.id;
            const nott = data.id
            const deleteButton = document.createElement("span");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "x";
            deleteButton.addEventListener("click", async (e) => {
                try {
                    const checkToken = localStorage.getItem("jwtToken")
                    //http://localhost:3030/
                    const deleteResponse = await fetch(`https://virtualboardcollabapp.azurewebsites.net/notes/${nott}`, {
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

                        socket.send(JSON.stringify({
                            type: 'deleteNote',
                            id: nott,
                            boardId: boardId,
                        }));
                    } else {

                        throw new Error('Failed to delete note');


                    }
                } catch (error) {
                    console.error('Error deleting note:', error);
                }
            });

            const noteId = data.id;
            const textarea = document.createElement("textarea");
            textarea.value = data.text;
            textarea.placeholder = "Type your note here...";
            const noted = note.id
            const colors = ["lightgreen", "lightblue", "pink"];
            for (const color of colors) {
                const colorButton = document.createElement("span");
                colorButton.classList.add("color-button");
                colorButton.style.backgroundColor = color;
                colorButton.addEventListener("click", () => {
                    note.style.backgroundColor = color;
                    const updatedData = {
                        content: textarea.value,
                        color: color,
                        x: parseFloat(note.style.left),
                        y: parseFloat(note.style.top),
                        boardId: boardId,
                    };
                    updateNote(noteId, updatedData);


                });
                note.appendChild(colorButton);
            }



            textarea.addEventListener("input", (e) => {


                const updatedContent = e.target.value
                const updatedData = {
                    content: updatedContent,
                    color: note.style.backgroundColor,
                    x: parseFloat(note.style.left),
                    y: parseFloat(note.style.top),
                    boardId: boardId,
                };

                updateNote(noted, updatedData);

                socket.send(JSON.stringify({
                    type: 'paste',
                    left: updatedData.x,
                    top: updatedData.y,
                    backgroundColor: updatedData.color,
                    text: updatedData.content,
                    id: noted,
                    boardId: updatedData.boardId,
                }));
            });
            note.addEventListener("mouseleave", (e) => {
                currentNote = e.target;
                const currId = currentNote.id

                const updatedContent = textarea.value;
                const updatedData = {
                    content: updatedContent,
                    color: currentNote.style.backgroundColor,
                    x: parseFloat(currentNote.style.left),
                    y: parseFloat(currentNote.style.top),
                    boardId: boardId,
                };





                updateNote(currId, updatedData);
                socket.send(JSON.stringify({
                    type: 'paste',
                    left: updatedData.x,
                    top: updatedData.y,
                    backgroundColor: updatedData.color,
                    text: updatedData.content,
                    id: noted,
                    boardId: updatedData.boardId,
                }));
            });
            note.addEventListener("mouseup", (e) => {
                currentNote = e.target;
                const currId = currentNote.id

                const updatedContent = textarea.value;
                const updatedData = {
                    content: updatedContent,
                    color: currentNote.style.backgroundColor,
                    x: parseFloat(currentNote.style.left),
                    y: parseFloat(currentNote.style.top),
                    boardId: boardId,
                };





                updateNote(currId, updatedData);
                socket.send(JSON.stringify({
                    type: 'paste',
                    left: updatedData.x,
                    top: updatedData.y,
                    backgroundColor: updatedData.color,
                    text: updatedData.content,
                    id: noted,
                    boardId: updatedData.boardId,
                }));
            });





            note.appendChild(deleteButton);
            note.appendChild(textarea);
            app.appendChild(note);
            note.setAttribute("data-board-id", boardId);
            noteC.appendChild(app);

        }

    }

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
    //const boardId = localStorage.getItem('currentBoardId');

    window.getNotesByBoardId = async function (boardId) {


        const checkToken = localStorage.getItem("jwtToken")
        try {
            const xd = localStorage.getItem('currentBoardId');
            displayNotesForCurrentBoard(xd);

//http://localhost:3030/
            const response = await fetch(`https://virtualboardcollabapp.azurewebsites.net/notes/?boardId=${boardId}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + checkToken,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {


            }

            const notes = await response.json();




            noteC.classList.add("sticky-note-container");

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
                        const updatedData = {
                            content: textarea.value,
                            color: color,
                            x: parseFloat(noteElement.style.left),
                            y: parseFloat(noteElement.style.top),
                            boardId: boardId,
                        };
                        updateNote(noteId, updatedData);
                        socket.send(JSON.stringify({
                            type: 'paste',
                            left: updatedData.x,
                            top: updatedData.y,
                            backgroundColor: updatedData.color,
                            text: updatedData.content,
                            id: noteId,
                            boardId: updatedData.boardId,
                        }));

                    });
                    noteElement.appendChild(colorButton);
                }

                const deleteButton = document.createElement("span");
                deleteButton.classList.add("delete-button");
                deleteButton.innerHTML = "x";

                deleteButton.addEventListener("click", async (e) => {
                    try {
                        const checkToken = localStorage.getItem("jwtToken")
                        //http://localhost:3030/
                        const deleteResponse = await fetch(`https://virtualboardcollabapp.azurewebsites.net/notes/${noteId}`, {
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
                            const noteId = note.id
                            socket.send(JSON.stringify({
                                type: 'deleteNote',
                                id: noteId,
                                boardId: boardId,
                            }));
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
                const noted = note.id
                noteElement.id = noteId;
                const xdid = note.id
                textarea.addEventListener("input", (e) => {


                    const updatedContent = e.target.value
                    const updatedData = {
                        content: updatedContent,
                        color: noteElement.style.backgroundColor,
                        x: parseFloat(noteElement.style.left),
                        y: parseFloat(noteElement.style.top),
                        boardId: boardId,
                    };
                    const noted = note.id
                    updateNote(xdid, updatedData);

                    socket.send(JSON.stringify({
                        type: 'paste',
                        left: updatedData.x,
                        top: updatedData.y,
                        backgroundColor: updatedData.color,
                        text: updatedData.content,
                        id: noted,
                        boardId: updatedData.boardId,
                    }));
                });
                noteElement.addEventListener("mouseleave", (e) => {
                    currentNote = e.target;
                    const currId = currentNote.id

                    const updatedContent = textarea.value;
                    const updatedData = {
                        content: updatedContent,
                        color: currentNote.style.backgroundColor,
                        x: parseFloat(currentNote.style.left),
                        y: parseFloat(currentNote.style.top),
                        boardId: boardId,
                    };





                    updateNote(currId, updatedData);
                    socket.send(JSON.stringify({
                        type: 'paste',
                        left: updatedData.x,
                        top: updatedData.y,
                        backgroundColor: updatedData.color,
                        text: updatedData.content,
                        id: noted,
                        boardId: updatedData.boardId,
                    }));
                });
                noteElement.addEventListener("mouseup", (e) => {
                    currentNote = e.target;
                    const currId = currentNote.id

                    const updatedContent = textarea.value;
                    const updatedData = {
                        content: updatedContent,
                        color: currentNote.style.backgroundColor,
                        x: parseFloat(currentNote.style.left),
                        y: parseFloat(currentNote.style.top),
                        boardId: boardId,
                    };





                    updateNote(currId, updatedData);
                    socket.send(JSON.stringify({
                        type: 'paste',
                        left: updatedData.x,
                        top: updatedData.y,
                        backgroundColor: updatedData.color,
                        text: updatedData.content,
                        id: noted,
                        boardId: updatedData.boardId,
                    }));
                });





                if (currentNote) {
                    const noteId = currentNote.id;
                    //console.log("Current note ID: " + noteId);
                } else {
                    //console.log("No current note selected.");
                }
                noteElement.appendChild(deleteButton);
                noteElement.appendChild(textarea);

                noteElement.setAttribute("data-board-id", boardId);
                noteC.appendChild(noteElement);

            });


            document.body.appendChild(noteC);

            //console.log('Notes:', notes);

        } catch (error) {
            //console.error('Error fetching notes:', error);
        }
    }
    const boarded = localStorage.getItem('currentBoardId');
    if (boarded !== null) {
        window.getNotesByBoardId(boarded);
    }


    //////////////////////////////////////////////////////////////skapa note knapp
    //////////////////////////////////////////////////////////////skapa note knapp
    //////////////////////////////////////////////////////////////skapa note knapp
    async function createStickyNote() {
        const boardId = localStorage.getItem('currentBoardId');


        const note = document.createElement("div");

        note.classList.add("sticky-note-container");
        note.classList.add("sticky-note");
        note.style.left = "150px"
        note.style.top = "150px"

        const initialLeft = note.style.left
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






        note.appendChild(deleteButton);
        note.appendChild(textarea);
        app.appendChild(note);
        note.setAttribute("data-board-id", boardId);
        noteC.appendChild(app);
        const currentBoardId = localStorage.getItem('currentBoardId');





        const checkToken = localStorage.getItem("jwtToken")
        const x = parseFloat(initialLeft);
        const y = parseFloat(initialTop);
        //console.log("current boardid" + currentBoardId)

        const noteData = {
            content: " ",
            color: note.style.backgroundColor,
            x: x,
            y: y,
            boardId: currentBoardId,
        };
//http://localhost:3030/
        const response = await fetch('https://virtualboardcollabapp.azurewebsites.net/notes', {
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
        //console.log("current note id" + saveId)
        note.id = saveId;

        textarea.addEventListener("input", (e) => {


            const updatedContent = e.target.value
            const updatedData = {
                content: updatedContent,
                color: note.style.backgroundColor,
                x: parseFloat(note.style.left),
                y: parseFloat(note.style.top),
                boardId: boardId,
            };

            updateNote(saveId, updatedData);


        });
        note.addEventListener("mouseleave", (e) => {
            currentNote = e.target;
            const currId = currentNote.id

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
        note.addEventListener("mouseup", (e) => {
            currentNote = e.target;
            const currId = currentNote.id

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


        note.addEventListener("mousedown", (e) => {
            currentNote = e.target;
            const currId = currentNote.id
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






        socket.send(JSON.stringify({
            type: 'createNote',
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

                //http://localhost:3030/
                const deleteResponse = await fetch(`https://virtualboardcollabapp.azurewebsites.net/notes/${saveId}`, {
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

                    socket.send(JSON.stringify({
                        type: 'deleteNote',
                        id: saveId,
                        boardId: boardId,
                    }));
                } else {

                    throw new Error('Failed to delete note');


                }
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        });
    }







});


window.createWebSocketConnection();


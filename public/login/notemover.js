

const app = document.getElementById("app");
let zIndex = 1;
let isDragging = false;
let offsetX, offsetY, currentNote;
app.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("sticky-note")) {
        isDragging = true;
        currentNote = e.target;
        const rect = currentNote.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        currentNote.style.zIndex = zIndex++;
    }
});

app.addEventListener("mousemove", (e) => {
    if (isDragging) {
        e.preventDefault(); // Prevent text selection while dragging
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        currentNote.style.left = x + "px";
        currentNote.style.top = y + "px";
    }
});

app.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
    }
});

app.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        e.target.parentElement.remove();
    }
});
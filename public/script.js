window.addEventListener('DOMContentLoaded', () => {

setInterval(loadComments, 5000); // Refresh comments every 5 seconds

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
let selectedDay = '';

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        selectedDay = button.dataset.day;
        console.log("Selected day:", selectedDay); // Debugging line
        console.log("Button clicked! Data-day is:", button.dataset.day);
        openModal(modal);
    });
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    });
}); 

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
})

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

const inputElement = document.getElementById('userInput');
const submitButton = document.getElementById('submitButton');
const output = document.getElementById('output');

submitButton.addEventListener('click', () => {
    const value = inputElement.value;
    console.log("Selected day at submit:", selectedDay); // ← ADD THIS LINE
    output.textContent = `You entered: ${value}`;
    const data = { 
        comment: value,
        day: selectedDay
    };

    fetch('https://scheduler2-ffp8.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        output.textContent = message; // Shows response from backend
        inputElement.value = '';
        loadComments();
    })
    .catch(error => {
        output.textContent = 'Error sending data';
        console.error('Error:', error);
    });
});

function loadComments() {
    fetch('https://scheduler2-ffp8.onrender.com')
        .then(response => response.json())
        .then(comments => {
            for (const day in comments) {
                const box = document.getElementById(`${day}-box`);
                if (box) {
                    if (comments[day].length === 0) {
                        box.innerHTML = 'No comments yet';
                    } else {
                        box.innerHTML = comments[day].map(c => `<p>${c}</p>`).join('');
                    }
                }
            }
        })
        .catch(err => {
            console.error('Error fetching data:', err);
        });
}

loadComments(); // Initial load of comments 

const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', () => {
  fetch('http://localhost:3000/clear', {
    method: 'POST'
  })
  .then(res => res.text())
  .then(message => {
    console.log(message);
    loadComments(); // reload after clearing
  })
  .catch(err => {
    console.error('Error clearing comments:', err);
  });
});

});

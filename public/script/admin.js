// Example: Dynamically loading event data from an API or local storage
fetch('events.json')
    .then(response => response.json())
    .then(data => {
        const eventTable = document.getElementById('event-table');
        data.forEach(event => {
            const row = eventTable.insertRow();
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td><button>Edit</button> <button>Delete</button></td>
            `;
        });
    });

// Example: Handling event creation form submission
const createEventForm = document.getElementById('create-event-form');
createEventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Handle form data and send it to the server
    console.log('Event created successfully!');
});
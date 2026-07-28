const API = "https://express-crud-swart.vercel.app/api/v1/todo";
const render = document.querySelector('.render');

function getTodayFormatted() {
  const today = new Date();
  
  const day = today.getDate();
  const year = today.getFullYear();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const month = monthNames[today.getMonth()];

  return `${day} ${month} ${year}`;
}

function getTodayFormattedWithTime() {
  const now = new Date();

  // Date components
  const day = now.getDate();
  const year = now.getFullYear();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[now.getMonth()];

  // Time components (Local Time)
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Example usage:
console.log(); 
// Output: "29 July 2026, 2:32:02 AM"
const getAllTodo = () => {
    render.innerHTML = `
      <div class="state-message">
        <h3>⏳ Loading todos...</h3>
      </div>`;

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");

    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';

    fetch(API)
        .then(res => res.json())
        .then(res => {
            const allItems = res.todos || [];
            
            if (allItems.length === 0) {
                render.innerHTML = `
                  <div class="state-message">
                    <h3>No tasks yet</h3>
                    <p>Add a task above to get started!</p>
                  </div>`;
                return;
            }

            // Build all HTML at once before updating DOM
            render.innerHTML = allItems.map(item => `
                <li class="todo-item">
                    <div class="todo-content">
                    ${getTodayFormatted()}
                    ${getTodayFormattedWithTime()}
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-small btn-edit" onclick="editTodo('${item._id}')">Edit</button>
                        <button class="btn btn-small btn-delete" onclick="deleteTodo('${item._id}')">Delete</button>
                    </div>
                </li>
            `).join('');

        }).catch(error => {
            console.error(error);
            render.innerHTML = `
              <div class="state-message">
                <h3 style="color: var(--danger)">Error loading tasks</h3>
                <p>Please try again later.</p>
              </div>`;
        });
}

const addTodo = () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
        alert("Please fill in both the title and description.");
        return;
    }

    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    })
    .then(res => res.json())
    .then(() => {
        getAllTodo();
    })
    .catch(error => {
        console.error(error);
        alert("Failed to add task.");
    });
}

const editTodo = (id) => {
    const updatedTitle = prompt("Enter updated title:");
    if (updatedTitle === null) return; // User cancelled prompt

    const updatedDescription = prompt("Enter updated description:");
    if (updatedDescription === null) return;

    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription
        })
    })
    .then(res => res.json())
    .then(() => {
        getAllTodo();
    })
    .catch(err => {
        console.error(err);
        alert("Failed to update task.");
    });
}

const deleteTodo = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
        fetch(`${API}/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => {
                getAllTodo();
            })
            .catch(err => {
                console.error(err);
                alert("Failed to delete task.");
            });
    }
}

// Initial Fetch
getAllTodo();
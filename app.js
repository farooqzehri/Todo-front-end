const API = "https://express-crud-swart.vercel.app/api/v1/todo";
const render = document.querySelector('.render');

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
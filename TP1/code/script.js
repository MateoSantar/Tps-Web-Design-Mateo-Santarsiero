const endpoint = "https://jsonplaceholder.typicode.com/posts";
function getPosts() {
    let miPromise = getPromise();
    const tbody = document.getElementById("tableBody");
    miPromise
        .then((data) => {
            document.querySelector("table").classList.remove("hidden");
            data.forEach((post) => {
                addRow(post);
            });
            revealTable();
        })
        .catch((error) => {
            console.error(error);
            alert("Error al obtener los posts: " + error);
        });
}

function getPromise() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", endpoint);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Error: " + xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject("Error: " + xhr.statusText);
        };
        xhr.send();
    });
}

function postPost() {
    let title = document.getElementById("postTitle").value;
    let body = document.getElementById("postBody").value;
    let userId = document.getElementById("postUserId").value;
    if (!title || !body) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    let miPromise = postPromise({ title, body, userId });
    miPromise
        .then((data) => {
            alert(`Post creado con éxito, ID = ${data.id}.`);
            addRow(data);
            revealTable();
        })
        .catch((error) => {
            console.error(error);
            alert("Error al crear el post: " + error);
        });
}

function postPromise(data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Error: " + xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject("Error: " + xhr.statusText);
        };
        xhr.send(JSON.stringify(data));
    });
}

function putPost() {
    dataToPut = {
        id: document.getElementById("modalId").value,
        title: document.getElementById("modalTitle").value,
        body: document.getElementById("modalBody").value,
        userId: document.getElementById("modalUserId").value,
    };
    let miPromise = putPromise(dataToPut);
    document.getElementById('modal-container').style.display = 'none';
    miPromise
        .then((data) => {
            alert("Post actualizado con éxito.");
            const tbody = document.getElementById("tableBody");
            const rows = tbody.getElementsByTagName("tr");
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const idCell = row.cells[0];
                if (idCell.innerHTML == data.id) {
                    idCell.innerHTML = data.id;
                    row.cells[1].innerHTML = data.title;
                    row.cells[2].innerHTML = data.body;
                }
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Error al actualizar el post: " + error);
        });
}

function putPromise(dataToPut) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", `${endpoint}/${dataToPut.id}`);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Error: " + xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject("Error: " + xhr.statusText);
        };
        console.log(JSON.stringify(dataToPut));
        xhr.send(JSON.stringify(dataToPut));
    });
}

function deletePost(id) {
    if (!id) {
        alert("Por favor, completa el campo ID.");
        return;
    }
    let miPromise = deletePromise(id);

    miPromise
        .then((data) => {
            const tbody = document.getElementById("tableBody");
            const rows = tbody.getElementsByTagName("tr");
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const idCell = row.cells[0];
                if (idCell.innerHTML == id) {
                    alert("Post eliminado con éxito. ");
                    tbody.deleteRow(i);
                    break;
                }
            }
            // Puesto que la API de Jsonplaceholder no devuelve nada al eliminar, no se puede usar el data
        })
        .catch((error) => {
            console.error(error);
            alert("Error al eliminar el post: " + error);
        });
}

function deletePromise(id) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", `${endpoint}/${id}`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Error: " + xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject("Error: " + xhr.statusText);
        };
        xhr.send();
    });
}

function showModal(id) {
    let originalData;
    for (let i = 0; i < document.getElementById("tableBody").rows.length; i++) {
        const row = document.getElementById("tableBody").rows[i];
        const idCell = row.cells[0];
        if (idCell.innerHTML == id) {
            originalData = {
                id: idCell.innerHTML,
                title: row.cells[1].innerHTML,
                body: row.cells[2].innerHTML,
                userId: row.cells[3].innerHTML,
            };
            break;
        }
    }
    document.getElementById('modalHeader').innerHTML = `Update Post ID: ${originalData.id}`;
    document.getElementById('modalId').value = originalData.id;
    document.getElementById('modalTitle').value = originalData.title;
    document.getElementById('modalBody').value = originalData.body;
    document.getElementById('modalUserId').value = originalData.userId;
    document.getElementById('modal-container').style.display = 'block';
}

function addRow(data) {
    const tbody = document.getElementById("tableBody");
    const row = tbody.insertRow();
    const idCell = row.insertCell(0);
    const titleCell = row.insertCell(1);
    const bodyCell = row.insertCell(2);
    const userIdCell = row.insertCell(3);
    const updateCell = row.insertCell(4);
    updateCell.classList.add("actionCell");
    const deleteCell = row.insertCell(5);
    deleteCell.classList.add("actionCell");

    idCell.innerHTML = data.id;
    titleCell.innerHTML = data.title;
    bodyCell.innerHTML = data.body;
    userIdCell.innerHTML = data.userId;
    updateCell.innerHTML = `<button class="actionbtn" onclick="showModal(${data.id})">Update</button>`;
    deleteCell.innerHTML = `<button class="actionbtn" onclick="deletePost(${data.id})">Delete</button>`;
    tbody.appendChild(row);
}

function revealTable() {
    document.getElementById("tableDiv").classList.remove("hidden");
}

window.onload = () => {
    getPosts();
};

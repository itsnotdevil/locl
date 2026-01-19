function loadUsers() {
  fetch('http://127.0.0.1:5000/users')
    .then(res => res.json())
    .then(data => {
      const users = data.users;
      let html = `<table><tr>
        <th>ID</th><th>Full Name</th><th>Username</th><th>Email</th><th>Password</th><th>Emoji</th><th>Actions</th>
      </tr>`;
      users.forEach(u => {
        html += `<tr>
          <td>${u[0]}</td>
          <td><input value="${u[1]}" id="fn${u[0]}" /></td>
          <td><input value="${u[2]}" id="un${u[0]}" /></td>
          <td><input value="${u[3]}" id="em${u[0]}" /></td>
          <td><input value="${u[4]}" id="pw${u[0]}" /></td>
          <td>
            <select id="emoji${u[0]}">
              <option value="🌞" ${u[5] === "🌞" ? "selected" : ""}>🌞</option>
              <option value="🌟" ${u[5] === "🌟" ? "selected" : ""}>🌟</option>
              <option value="🌍" ${u[5] === "🌍" ? "selected" : ""}>🌍</option>
              <option value="🔥" ${u[5] === "🔥" ? "selected" : ""}>🔥</option>
            </select>
          </td>
          <td>
            <button onclick="updateUser(${u[0]})">✏️</button>
            <button onclick="deleteUser(${u[0]})">🗑️</button>
          </td>
        </tr>`;
      });
      html += `</table>`;
      document.getElementById('usersTable').innerHTML = html;
    });
}

function updateUser(id) {
  const fullname = document.getElementById('fn'+id).value;
  const username = document.getElementById('un'+id).value;
  const email = document.getElementById('em'+id).value;
  const password = document.getElementById('pw'+id).value;
  const emoji = document.getElementById('emoji'+id).value;
  fetch('http://127.0.0.1:5000/update-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, fullname, username, email, password, emoji })
  }).then(() => {
    loadUsers();
    showMessage("User updated successfully!", "info");
  });
}

function deleteUser(id) {
  fetch('http://127.0.0.1:5000/delete-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  }).then(() => {
    loadUsers();
    showMessage("User deleted successfully!", "info");
  });
}

function addUser() {
  const fullname = document.getElementById('newFullname').value;
  const username = document.getElementById('newUsername').value;
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  fetch('http://127.0.0.1:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, username, email, password })
  }).then(() => {
    loadUsers();
    showMessage("User added successfully!", "info");
  });
}

function showMessage(msg, type="info") {
  const msgBox = document.getElementById('adminMsgBox');
  msgBox.textContent = msg;
  msgBox.style.color = type === "error" ? "#ff4d4d" : "#19d4ff";
  setTimeout(() => { msgBox.textContent = ""; }, 2500);
}

document.getElementById('searchInput').oninput = function() {
  const term = this.value.toLowerCase();
  const rows = document.querySelectorAll('#usersTable table tr');
  rows.forEach((row, idx) => {
    if (idx === 0) return;
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
};

window.onload = loadUsers;
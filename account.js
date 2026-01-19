document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const accountMsg = document.getElementById('accountMsg');
  const userGreeting = document.getElementById('userGreeting');
  const greetingText = document.getElementById('greetingText');
  const signOutBtn = document.getElementById('signOutBtn');

  // Tab switching
  loginTab.onclick = function() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    accountMsg.textContent = '';
  };
  registerTab.onclick = function() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    accountMsg.textContent = '';
  };
  loginTab.click();

  // Registration handler
  registerSection.addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = document.getElementById('regFullname').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!fullname || !username || !email || !password) {
      accountMsg.textContent = "Please fill all fields.";
      return;
    }
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, username, email, password })
    })
    .then(res => res.json())
    .then(data => {
      accountMsg.textContent = data.message;
      if (data.status === 'success') {
        registerSection.reset();
        loginTab.click();
      }
    })
    .catch(() => {
      accountMsg.textContent = "Could not connect to server.";
    });
  });

  // Login handler
  loginSection.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
      accountMsg.textContent = "Please enter email and password.";
      return;
    }
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      accountMsg.textContent = data.message;
      if (data.status === 'success') {
        const name = email.split('@')[0];
        localStorage.setItem('user', JSON.stringify({ name }));
        showUserGreeting(name);
        window.location.href = "index.html";
      }
    })
    .catch(() => {
      accountMsg.textContent = "Could not connect to server.";
    });
  });

  function showUserGreeting(name) {
    greetingText.textContent = `Hello, ${name}`;
    userGreeting.style.display = 'flex';
    signOutBtn.style.display = 'inline-block';
  }

  // Show greeting if logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.name) showUserGreeting(user.name);

  signOutBtn.onclick = function() {
    localStorage.removeItem('user');
    location.reload();
  };

  // Admin Login Modal logic
  document.getElementById('adminLoginBtn').onclick = function() {
    document.getElementById('adminModal').style.display = 'flex';
  };
  document.getElementById('closeAdminModal').onclick = function() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminMsg').textContent = '';
  };
  document.getElementById('adminPanelLoginBtn').onclick = function() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    fetch('http://127.0.0.1:5000/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        window.location.href = "admin-panel.html";
      } else {
        document.getElementById('adminMsg').textContent = data.message;
      }
    })
    .catch(() => {
      document.getElementById('adminMsg').textContent = "Could not connect to server.";
    });
  };
});
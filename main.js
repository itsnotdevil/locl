// js/main.js - global helpers
document.addEventListener('DOMContentLoaded', () => {
  // highlight active nav by pathname
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    const page = location.pathname.split('/').pop() || 'index.html';
    if (href === page) a.classList.add('active');
  });

  const userGreeting = document.getElementById('userGreeting');
  const greetingText = document.getElementById('greetingText');
  const signOutBtn = document.getElementById('signOutBtn');

  // Check localStorage for user
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.name) {
    greetingText.textContent = `Hello, ${user.name}`;
    userGreeting.style.display = 'flex';
    signOutBtn.style.display = 'inline-block';
  } else {
    userGreeting.style.display = 'none';
  }

  // Sign out
  if (signOutBtn) {
    signOutBtn.onclick = () => {
      localStorage.removeItem('user');
      location.reload();
    };
  }
});

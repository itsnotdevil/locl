// js/reviews.js - simple client-side review submission & display (localStorage)
document.addEventListener('DOMContentLoaded', () => {
  const submit = document.getElementById('submitReview');
  const list = document.getElementById('reviewsList');

  // load saved reviews
  function loadReviews(){
    try { return JSON.parse(localStorage.getItem('sunReviews')||'[]'); }
    catch(e){ return []; }
  }
  function saveReviews(arr){ localStorage.setItem('sunReviews', JSON.stringify(arr)); }

  function render(){
    const arr = loadReviews();
    if (!arr.length) { list.innerHTML = '<p class="muted">No reviews yet — be the first!</p>'; return; }
    list.innerHTML = arr.map(r => {
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      return `<div class="review"><div class="stars">${stars}</div><strong>${escape(r.name)}</strong><p>${escape(r.comment)}</p></div>`;
    }).join('');
  }
  function escape(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  submit.addEventListener('click', () => {
    const name = document.getElementById('reviewerName').value.trim() || 'Anonymous';
    const rating = parseInt(document.getElementById('rating').value || 5);
    const comment = document.getElementById('comment').value.trim() || '';
    if (!comment) return alert('Please add a comment');
    const arr = loadReviews();
    arr.unshift({name, rating, comment, date: new Date().toISOString()});
    saveReviews(arr);
    render();
    document.getElementById('reviewerName').value = '';
    document.getElementById('rating').value = '5';
    document.getElementById('comment').value = '';
  });

  render();
});

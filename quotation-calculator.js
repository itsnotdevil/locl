// js/quotation-calculator.js - read query params for prefill and calculate
document.addEventListener('DOMContentLoaded', () => {
  const panelsEl = document.getElementById('panels');
  const panelPriceEl = document.getElementById('panelPrice');
  const inverterEl = document.getElementById('inverterPrice');
  const installEl = document.getElementById('installCost');
  const btn = document.getElementById('quoteBtn');
  const res = document.getElementById('quoteSummary');

  // prefill from URL params (e.g. ?pkg=family&panels=6)
  const params = new URLSearchParams(location.search);
  if (params.get('panels')) panelsEl.value = params.get('panels');
  if (params.get('panelPrice')) panelPriceEl.value = params.get('panelPrice');

  btn.addEventListener('click', () => {
    const panels = parseInt(panelsEl.value || 0);
    const panelPrice = parseFloat(panelPriceEl.value || 0);
    const inverter = parseFloat(inverterEl.value || 0);
    const install = parseFloat(installEl.value || 0);
    if (panels <= 0) return alert('Enter number of panels');
    const panelsTotal = panels * panelPrice;
    const subtotal = panelsTotal + inverter + install;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    res.innerHTML = `
      <p>Panels (${panels} × LKR ${panelPrice.toLocaleString()}): LKR ${panelsTotal.toLocaleString()}</p>
      <p>Inverter: LKR ${inverter.toLocaleString()}</p>
      <p>Installation: LKR ${install.toLocaleString()}</p>
      <p>Subtotal: LKR ${subtotal.toLocaleString()}</p>
      <p>Tax (8%): LKR ${tax.toLocaleString()}</p>
      <h3>Total: LKR ${total.toLocaleString()}</h3>
    `;
    document.getElementById('quoteResult').classList.remove('hidden');
  });
});

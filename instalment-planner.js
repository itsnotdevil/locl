// js/instalment-planner.js - amortization calc and print
document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');
  const printBtn = document.getElementById('printBtn');

  calcBtn.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value || 0);
    const down = parseFloat(document.getElementById('down').value || 0);
    const months = parseInt(document.getElementById('months').value || 1);
    const rate = parseFloat(document.getElementById('rate').value || 0) / 100 / 12;
    if (amount <= 0) return alert('Enter loan amount');
    const principal = Math.max(0, amount - down);
    let monthly;
    if (rate === 0) monthly = principal / months;
    else monthly = (principal * rate) / (1 - Math.pow(1 + rate, -months));
    const total = monthly * months + down;
    document.getElementById('summary').innerHTML = `
      <p>Principal after down payment: LKR ${Math.round(principal).toLocaleString()}</p>
      <p>Monthly payment (${months} months): LKR ${monthly.toFixed(2).toLocaleString()}</p>
      <p>Total to pay (incl. interest): LKR ${Math.round(total).toLocaleString()}</p>
    `;
    document.getElementById('result').classList.remove('hidden');
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });
});

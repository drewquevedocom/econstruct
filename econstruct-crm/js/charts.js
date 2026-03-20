/* eConstruct CRM — Charts (Donut, Sparklines) */

// ============ DONUT CHART ============
const donutData = [
  { label: 'LADBS Permits', value: 620, color: '#B8963E' },
  { label: 'Deed Transfers', value: 107, color: '#9A7B2F' },
  { label: 'Pre-Permit Signals', value: 45, color: '#C4A254' },
  { label: 'Architect Referrals', value: 32, color: '#1C1C1E' },
  { label: 'PA Referrals', value: 18, color: '#6B6B6F' },
  { label: 'Geotech Reports', value: 12, color: '#9A9A9E' },
  { label: 'RE Agent', value: 9, color: '#BDBDBD' }
];

function initDonutChart() {
  const legendEl = document.getElementById('donutLegend');
  if (!legendEl) return;
  
  donutData.forEach(d => {
    const pct = ((d.value / 843) * 100).toFixed(1);
    legendEl.innerHTML += `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background:${d.color}"></span>
        <span class="donut-legend-label">${d.label}</span>
        <span class="donut-legend-value">${d.value} (${pct}%)</span>
      </div>`;
  });

  const ctx = document.getElementById('donutChart').getContext('2d');
  window.donutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: donutData.map(d => d.label),
      datasets: [{
        data: donutData.map(d => d.value),
        backgroundColor: donutData.map(d => d.color),
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C1C1E',
          titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const val = context.parsed;
              const pct = ((val / 843) * 100).toFixed(1);
              return ` ${context.label}: ${val} (${pct}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 800
      }
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initDonutChart);

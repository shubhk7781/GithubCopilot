const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currencyDetails = {
  INR: { name: "Indian rupee", symbol: "₹", inrRate: 1 },
  USD: { name: "United States dollar", symbol: "$", inrRate: 83 },
  EUR: { name: "Euro", symbol: "€", inrRate: 90 },
  GBP: { name: "Pound sterling", symbol: "£", inrRate: 105 }
};
let selectedCurrency = "INR";
let money = createFormatter();
const financialData = months.map((month) => ({ month, income: 0, expenses: 0 }));
let moneyChart;

function createFormatter() {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: selectedCurrency });
}

const convertFromInr = (value) => (value || 0) / currencyDetails[selectedCurrency].inrRate;
const convertToInr = (value) => (value || 0) * currencyDetails[selectedCurrency].inrRate;
const formatMoney = (value) => money.format(convertFromInr(value));
const formatInputValue = (value) => value ? convertFromInr(value).toFixed(2) : "";
const getNumber = (input) => {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

function renderRows() {
  const rows = document.querySelector("#tracker-rows");
  rows.innerHTML = financialData.map((item, index) => `
    <tr>
      <td><span class="month-number">${String(index + 1).padStart(2, "0")}</span><span class="month-name">${item.month}</span></td>
      <td><label class="visually-hidden" for="income-${index}">${item.month} income</label><div class="input-money-group"><span class="input-currency-symbol">${currencyDetails[selectedCurrency].symbol}</span><input class="money-input income-input" id="income-${index}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" value="${formatInputValue(item.income)}"></div></td>
      <td><label class="visually-hidden" for="expense-${index}">${item.month} expenses</label><div class="input-money-group"><span class="input-currency-symbol">${currencyDetails[selectedCurrency].symbol}</span><input class="money-input expense-input" id="expense-${index}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" value="${formatInputValue(item.expenses)}"></div></td>
      <td class="d-none d-md-table-cell"><span class="monthly-net" id="net-${index}">${formatMoney(0)}</span></td>
    </tr>`).join("");

  document.querySelectorAll(".money-input").forEach((input) => input.addEventListener("input", updateFromInputs));
}

function updateFromInputs() {
  financialData.forEach((item, index) => {
    item.income = convertToInr(getNumber(document.querySelector(`#income-${index}`)));
    item.expenses = convertToInr(getNumber(document.querySelector(`#expense-${index}`)));
    const netElement = document.querySelector(`#net-${index}`);
    const net = item.income - item.expenses;
    netElement.textContent = formatMoney(net);
    netElement.classList.toggle("negative", net < 0);
  });
  updateSummary();
  updateChart();
}

function updateSummary() {
  const income = financialData.reduce((total, item) => total + item.income, 0);
  const expenses = financialData.reduce((total, item) => total + item.expenses, 0);
  const net = income - expenses;
  document.querySelector("#total-income").textContent = formatMoney(income);
  document.querySelector("#total-expenses").textContent = formatMoney(expenses);
  document.querySelector("#net-cash-flow").textContent = formatMoney(net);
  document.querySelector("#net-cash-flow").style.color = net < 0 ? "var(--coral)" : "var(--ink)";
  document.querySelector("#net-detail").textContent = net < 0 ? "Expenses are above income" : "Income minus expenses";
}

function updateChart() {
  if (!moneyChart) return;
  const hasValues = financialData.some((item) => item.income > 0 || item.expenses > 0);
  document.querySelector("#chart-empty").classList.toggle("visible", !hasValues);
  moneyChart.data.datasets[0].data = financialData.map((item) => convertFromInr(item.income));
  moneyChart.data.datasets[1].data = financialData.map((item) => convertFromInr(item.expenses));
  moneyChart.update("none");
}

function createChart() {
  if (typeof Chart === "undefined") return;
  const chartContext = document.querySelector("#money-chart");
  moneyChart = new Chart(chartContext, {
    type: "bar",
    data: { labels: months.map((month) => month.slice(0, 3)), datasets: [
      { label: "Income", data: financialData.map((item) => item.income), backgroundColor: "#1f7257", hoverBackgroundColor: "#15513f", borderRadius: 2, maxBarThickness: 25 },
      { label: "Expenses", data: financialData.map((item) => item.expenses), backgroundColor: "#e67a5d", hoverBackgroundColor: "#c75e44", borderRadius: 2, maxBarThickness: 25 }
    ] },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 500, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { display: false }, tooltip: { padding: 12, backgroundColor: "#17231f", callbacks: { label: (context) => ` ${context.dataset.label}: ${formatSelectedMoney(context.raw)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#6e7973", font: { family: "DM Sans", size: 11 } } },
        y: { beginAtZero: true, grid: { color: "#edf0ec" }, border: { display: false }, ticks: { color: "#6e7973", padding: 8, font: { family: "DM Sans", size: 10 }, callback: (value) => formatAxisValue(value) } }
      }
    }
  });
  updateChart();
}

function formatAxisValue(value) {
  if (value >= 1000000) return `${currencyDetails[selectedCurrency].symbol}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${currencyDetails[selectedCurrency].symbol}${(value / 1000).toFixed(0)}k`;
  return `${currencyDetails[selectedCurrency].symbol}${Number(value).toFixed(0)}`;
}

function formatSelectedMoney(value) {
  return money.format(value || 0);
}

function downloadChartAsPng() {
  if (!moneyChart || !moneyChart.canvas) return;

  const canvas = moneyChart.canvas;
  const link = document.createElement("a");
  const fileName = `bucks2bar-chart-${new Date().toISOString().slice(0, 10)}.png`;

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
    return;
  }

  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}

function updateCurrency() {
  selectedCurrency = document.querySelector("#currency-select").value;
  money = createFormatter();
  const details = currencyDetails[selectedCurrency];
  document.querySelector("#currency-symbol").textContent = details.symbol;
  document.querySelector("#currency-code").textContent = selectedCurrency;
  document.querySelector("#currency-name").textContent = details.name;
  document.querySelector(".input-badge").textContent = `Amounts shown in ${selectedCurrency} | Stored in INR`;
  renderRows();
  updateSummary();
  updateChart();
}

function setupTabs() {
  const tabButtons = document.querySelectorAll("[data-bs-toggle='tab']");
  if (typeof bootstrap !== "undefined") {
    document.querySelector("#chart-tab").addEventListener("shown.bs.tab", () => moneyChart?.resize());
    return;
  }
  tabButtons.forEach((button) => button.addEventListener("click", () => {
    tabButtons.forEach((tab) => { tab.classList.remove("active"); tab.setAttribute("aria-selected", "false"); });
    document.querySelectorAll(".tab-pane").forEach((panel) => panel.classList.remove("show", "active"));
    button.classList.add("active"); button.setAttribute("aria-selected", "true");
    document.querySelector(button.dataset.bsTarget).classList.add("show", "active");
    moneyChart?.resize();
  }));
}

renderRows();
updateSummary();
createChart();
setupTabs();
document.querySelector("#currency-select").addEventListener("change", updateCurrency);
document.querySelector("#download-chart").addEventListener("click", downloadChartAsPng);

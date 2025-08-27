// Seletores principais
const elements = {
  currencyCodeOne: document.querySelector("#currencyCodeOne"),
  currencyCodeTwo: document.querySelector("#currencyCodeTwo"),
  inputValue: document.querySelector("#inputValue"),
  display: document.querySelector("#display"),
  displayCurencySymbol: document.querySelector("#displayCurencySymbol"),
  swapButton: document.querySelector("#swapButton"),
  ctx: document.querySelector("#myChart").getContext('2d'),
  currencyCountryImgOne: document.querySelector("#currencyCountryImgOne"),
  currencyCountryImgTwo: document.querySelector("#currencyCountryImgTwo"),
  loader: document.querySelector(".loader"),
  leftContent: document.querySelector(".left-content"),
  rightContent: document.querySelector(".right-content"),
  tBody: document.querySelector("#tb"),
  tHead: document.querySelector("#thead"),
};

// Flags
const countryFlagsByCurrencyCode = {
  "EUR": ["https://img.icons8.com/fluency/48/undefined/euro-pound-exchange.png", "European_union_flag"],
  "CNY": ["https://img.icons8.com/fluency/48/undefined/china-circular.png", "Chinese_flag"],
  "CAD": ["https://img.icons8.com/fluency/48/undefined/canada-circular.png", "Canada_flag"],
  "JPY": ["https://img.icons8.com/fluency/48/undefined/japan-circular.png", "Japanese_flag"],
  "BRL": ["https://img.icons8.com/fluency/48/undefined/brazil-circular.png", "Brazilian_flag"],
  "USD": ["https://img.icons8.com/fluency/48/undefined/usa-circular.png", "united_states_flag"],
  "BTC": ['https://img.icons8.com/color/48/000000/bitcoin--v1.png', 'bitcoin_image']
};

// Util: atualizar flag de uma moeda
const updateFlag = (currencyCode, imgElement) => {
  const flagData = countryFlagsByCurrencyCode[currencyCode];
  if (flagData) {
    [imgElement.src, imgElement.alt] = flagData;
  }
};

// Atualiza todas as flags
const updateFlags = () => {
  updateFlag(elements.currencyCodeOne.value, elements.currencyCountryImgOne);
  updateFlag(elements.currencyCodeTwo.value, elements.currencyCountryImgTwo);
};

// Loader
const showLoader = () => {
  elements.leftContent.style.display = 'none';
  elements.rightContent.style.display = 'none';
  elements.loader.style.visibility = 'visible';
};

const hideLoader = () => {
  elements.loader.style.visibility = 'hidden';
  elements.leftContent.style.display = 'flex';
  elements.rightContent.style.display = 'flex';
};

// API
const getServerData = async (currencyCodeOne, currencyCodeTwo, inputValue) => {
  const payload = { currencyCodeOne, currencyCodeTwo, inputValue };
  const response = await fetch("https://conversordemoedas.onrender.com/handle_conversion", {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};

// Exibir resultado
const updateDisplay = (message, options = {}) => {
  elements.display.innerHTML = message;
  elements.display.className = options.className || '';
  elements.display.style.color = options.color || '#CAD2C5';
  elements.display.style.fontSize = options.fontSize || '2rem';
};

// Converter
const callServerData = async () => {
  updateFlags();
  elements.inputValue.value = elements.inputValue.value.replace(",", ".");

  const { value } = elements.inputValue;
  if (!value) return updateDisplay("0.00");

  if (elements.currencyCodeOne.value === elements.currencyCodeTwo.value) {
    return updateDisplay("Escolha duas moedas diferentes para converter.", { className: 'error' });
  }

  if (isNaN(value)) {
    return updateDisplay("Valor inválido, digite um valor numérico.", { className: 'error', color: 'red' });
  }

  try {
    const data = await getServerData(elements.currencyCodeOne.value, elements.currencyCodeTwo.value, value);
    if (data.error) {
      updateDisplay(data.error);
    } else {
      updateDisplay(`${data.symbolOne}${data.value}`, { color: '#CAD2C5' });
      elements.displayCurencySymbol.innerHTML = data.symbolTwo;
    }
  } catch (err) {
    updateDisplay("Erro ao obter dados do servidor.", { className: 'error', color: 'red' });
  }
};

// Swap moedas
const swapCurrency = () => {
  [elements.currencyCodeOne.value, elements.currencyCodeTwo.value] =
    [elements.currencyCodeTwo.value, elements.currencyCodeOne.value];
  updateFlags();
  callServerData();
};

// Gráfico
const getChartData = async () => {
  showLoader();
  const response = await fetch('https://conversordemoedas.onrender.com/get_chart_data');
  const cData = await response.json();
  hideLoader();

  // Cabeçalho da tabela
  const trHead = document.createElement('tr');
  trHead.innerHTML = `<th>Data</th><th>Cotação</th>`;
  elements.tHead.appendChild(trHead);

  // Corpo da tabela
  cData.data.slice(0, 7).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(item.timestamp * 1000).toLocaleDateString('pt-br')}</td>
      <td>R$ ${Number(item.bid)}</td>
    `;
    elements.tBody.appendChild(tr);
  });

  const labels = cData.data.map(d => new Date(d.timestamp * 1000).toLocaleDateString('pt-br')).reverse();
  const values = cData.data.map(d => d.bid).reverse();

  new Chart(elements.ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Valor do dólar',
        data: values,
        borderWidth: 2,
        backgroundColor: 'rgb(19, 201, 255)',
        borderColor: 'rgb(19, 201, 255)',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: 'rgb(202, 210, 197)' } }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 2,
            color: 'rgb(202, 210, 197)',
          }
        },
        y: {
          ticks: { maxTicksLimit: 5, color: 'rgb(202, 210, 197)' }
        }
      },
      elements: { point: { radius: 1 } }
    }
  });
};

// Eventos
let debounceTimeout;
elements.inputValue.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callServerData, 100);
});

elements.swapButton.addEventListener('click', swapCurrency);
[elements.currencyCodeOne, elements.currencyCodeTwo].forEach(el =>
  el.addEventListener('change', () => { updateFlags(); callServerData(); })
);

// Inicialização
updateFlags();
getChartData();

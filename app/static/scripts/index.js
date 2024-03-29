const currencyCodeOne = document.querySelector("#currencyCodeOne")
const currencyCodeTwo = document.querySelector("#currencyCodeTwo")
const inputValue = document.querySelector("#inputValue")
const display = document.querySelector("#display")
const tBody = document.querySelector("#tb");
const swapButton = document.querySelector("#swapButton")
const ctx = document.querySelector("#myChart").getContext('2d')
const currencyCountryImgOne = document.querySelector("#currencyCountryImgOne")
const currencyCountryImgTwo = document.querySelector("#currencyCountryImgTwo")
const loader = document.querySelector('.loader')
const leftContent = document.querySelector('.left-content')
const rightContent = document.querySelector('.right-content')
const tHead = document.querySelector('#thead')
const countryFlagsByCurrencyCode = {"EUR": ["https://img.icons8.com/fluency/48/undefined/euro-pound-exchange.png", "European_union_flag"],
                                    "CNY": ["https://img.icons8.com/fluency/48/undefined/china-circular.png", "Chinese_flag"], 
                                    "CAD": ["https://img.icons8.com/fluency/48/undefined/canada-circular.png", "Canada_flag"], 
                                    "JPY": ["https://img.icons8.com/fluency/48/undefined/japan-circular.png", "Japanese_flag"],
                                    "BRL": ["https://img.icons8.com/fluency/48/undefined/brazil-circular.png", "Brazilian_flag"], 
                                    "USD": ["https://img.icons8.com/fluency/48/undefined/usa-circular.png", "united_states_flag"],
                                    "BTC": ['https://img.icons8.com/color/48/000000/bitcoin--v1.png', 'bitcoin_image']
                                }




const displayCurencySymbol = document.querySelector("#displayCurencySymbol")

currencyCountryImgOne.src = countryFlagsByCurrencyCode[currencyCodeOne.value][0]
currencyCountryImgOne.alt = countryFlagsByCurrencyCode[currencyCodeOne.value][1]

currencyCountryImgTwo.src = countryFlagsByCurrencyCode[currencyCodeTwo.value][0]
currencyCountryImgTwo.alt = countryFlagsByCurrencyCode[currencyCodeTwo.value][1]

let timeout = null;

inputValue.addEventListener('input', () => {
    clearTimeout(timeout)

    setTimeout(() => {
        callServerData()
    }, 100)
})


swapButton.addEventListener('click', () => {
    swapCurrency()
})

currencyCodeOne.addEventListener('change', () => {
    changeCurrencyCountryFlag()
    callServerData()
})
currencyCodeTwo.addEventListener('change', () => {
    changeCurrencyCountryFlag()
    callServerData()
})

const getServerData = async (currencyCodeOne, currencyCodeTwo, inputValue) => {

    const currencyDataToSend = {"currencyCodeOne": currencyCodeOne,
        	                    "currencyCodeTwo": currencyCodeTwo, 
                                "inputValue": inputValue}

    const request = await fetch("https://conversordemoedas.onrender.com/handle_conversion", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currencyDataToSend),
        
    })

    return request
}

const changeCurrencyCountryFlag = () => {

    if (currencyCodeOne.value in countryFlagsByCurrencyCode) {
        currencyCountryImgOne.src = countryFlagsByCurrencyCode[currencyCodeOne.value][0]
        currencyCountryImgOne.alt = countryFlagsByCurrencyCode[currencyCodeOne.value][1]
    }

    if (currencyCodeTwo.value in countryFlagsByCurrencyCode) {
        currencyCountryImgTwo.src = countryFlagsByCurrencyCode[currencyCodeTwo.value][0]
        currencyCountryImgTwo.alt = countryFlagsByCurrencyCode[currencyCodeTwo.value][1]

    }
    
}

const swapCurrency = () => {
    const aux = currencyCodeOne.value
    currencyCodeOne.value = currencyCodeTwo.value
    currencyCodeTwo.value = aux

    changeCurrencyCountryFlag()
    callServerData()

}


const callServerData = () => {
    changeCurrencyCountryFlag(currencyCodeOne, currencyCodeTwo)
    inputValue.value = inputValue.value.replace(",", ".")
    if (inputValue.value == '') {
        display.innerHTML = "0.00"
        display.style.color = '#CAD2C5'
        display.style.fontSize = '2rem'
        
    }else {
        
        if (currencyCodeOne.value == currencyCodeTwo.value) {
            display.innerHTML = "Escolha duas moedas diferentes para converter."
            display.classList = 'error'
        }else {
            if (isNaN(inputValue.value)) {
                display.classList = 'error'
                display.style.color = 'red'
                display.innerHTML = "Valor invalido, digite um valor númerico."
            }else {
                serverResponse = getServerData(currencyCodeOne.value, currencyCodeTwo.value, inputValue.value)
                serverResponse.then((res) => {
                    return res.json()
                }).then((data) => {
                    if (data.error) {
                        display.innerHTML = `${data.error}`
                    }else {
                        display.innerHTML = `${data.symbolOne}${data.value}`
                        display.classList = ''
                        display.style.color = '#CAD2C5'
                        displayCurencySymbol.innerHTML = `${data.symbolTwo}`
                    }
                }) 
            }
        }

    }

}

function showLoader() {
    leftContent.style.display = 'none'
    rightContent.style.display = 'none'
    loader.style.visibility = 'visible'
}
function hideLoader() {
    loader.style.visibility = 'hidden'
    leftContent.style.display = 'flex'
    rightContent.style.display = 'flex'
}

const getChartData = async () => {
    showLoader()
    const dates = []
    const arr = []
    const serverData = await fetch('https://conversordemoedas.onrender.com/get_chart_data', {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}
    })

    hideLoader()
    const cData = await serverData.json()

    const trHead = document.createElement('tr')
    const thData = document.createElement('th')
    const thCotacao = document.createElement('th')

    thData.innerHTML = 'Data'
    thCotacao.innerHTML = 'Cotação'

    trHead.append(thData, thCotacao)
    thead.appendChild(trHead)

    for (let i=0; i<7; i++) {
        const tr = document.createElement('tr')
        const tdDate = document.createElement('td')
        const tdValue = document.createElement('td')
        tdDate.innerHTML = new Date(cData.data[i].timestamp*1000).toLocaleDateString('pt-br')
        const currencyValue = cData.data[i].bid
        tdValue.innerHTML = `R$ ${Number(currencyValue)}`

        tr.append(tdDate, tdValue)
        tBody.appendChild(tr)
    }
    cData.data.map(data => {
        arr.push(data.bid)
    })
    cData.data.map(date => {
      let newDate = new Date(date.timestamp*1000).toLocaleDateString('pt-br')
      dates.push(newDate)
    })
    const data = {
      labels: dates.reverse(),
      datasets: [{
        label: 'Valor do dolar',
        borderWidth: 2,
        backgroundColor: 'rgb(19, 201, 255)',
        borderColor: 'rgb(19, 201, 255)',
        data: arr.reverse(),
      }]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        plugins: {
            legend: {
                labels: {
                    color: 'rgb(202, 210, 197)'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxis: {
            grid: {
                display: false,
            },
            ticks: {
                callback: (value, index, values) => {
                  if (index === 8 || index === 21) {
                      return data.labels[index]
                  }
                },
                beginAtZero: false,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: 2,
                color: 'rgb(202, 210, 197)'
            },
          },
          yAxis: {
            ticks: {
                maxTicksLimit: 5,
                color: 'rgb(202, 210, 197)'
            }
          },
        },
        elements: {
          point:{
              radius: 1
          },
          
      }
      }
    };
    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
}

getChartData()
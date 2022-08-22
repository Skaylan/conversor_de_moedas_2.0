const currencyCodeOne = document.querySelector("#currencyCodeOne")
const currencyCodeTwo = document.querySelector("#currencyCodeTwo")
const inputValue = document.querySelector("#inputValue")
const display = document.querySelector("#display")
const swapButton = document.querySelector("#swapButton")
const ctx = document.querySelector("#myChart").getContext('2d')
const currencyCountryImgOne = document.querySelector("#currencyCountryImgOne")
const currencyCountryImgTwo = document.querySelector("#currencyCountryImgTwo")
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


inputValue.addEventListener('input', () => {
    callServerDataFunction()
})

swapButton.addEventListener('click', () => {
    swapCurrency()
})

currencyCodeOne.addEventListener('change', () => {
    changeCurrencyCountryFlag()
    callServerDataFunction()
})
currencyCodeTwo.addEventListener('change', () => {
    changeCurrencyCountryFlag()
    callServerDataFunction()
})

const getServerData = async (currencyCodeOne, currencyCodeTwo, inputValue) => {

    const currencyDataToSend = {"currencyCodeOne": currencyCodeOne,
        	                    "currencyCodeTwo": currencyCodeTwo, 
                                "inputValue": inputValue}

    const request = await fetch("http://192.168.0.10:5000/handle_conversion", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currencyDataToSend),
        
    })

    return request
}

// const changedisplayCurencySymbol = (currencyCodeOne) => {
//     displayCurencySymbol.value = currencyCodeOne
// }

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
    console.log("swap")
    const aux = currencyCodeOne.value
    currencyCodeOne.value = currencyCodeTwo.value
    currencyCodeTwo.value = aux

    changeCurrencyCountryFlag()
    callServerDataFunction()

}


const callServerDataFunction = () => {
    changeCurrencyCountryFlag(currencyCodeOne, currencyCodeTwo)
    // changedisplayCurencySymbol(currencyCodeOne)

    inputValue.value = inputValue.value.replace(",", ".")

    if (inputValue.value == '') {
        display.innerHTML = "Digite um valor a ser convertido."
        display.classList = 'warning'
    }else {
        
        if (currencyCodeOne.value == currencyCodeTwo.value) {
            display.innerHTML = "Escolha duas moedas diferentes para converter."
            display.classList = 'error'
        }else {
            if (isNaN(inputValue.value)) {
                display.innerHTML = "Valor invalido, digite um valor númerico."
                display.classList = 'error'
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
                        displayCurencySymbol.innerHTML = `${data.symbolTwo}`
                    }
                }) 
            }
        }

    }

}


const getChartData = async () => {
    const dates = []
    const arr = []
    const serverData = await fetch('http://192.168.0.10:5000/get_chart_data')
    const cData = await serverData.json()
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
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxis: {
                ticks: {
                    beginAtZero: false,
                    maxTicksLimit: 5,
                }
            }
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
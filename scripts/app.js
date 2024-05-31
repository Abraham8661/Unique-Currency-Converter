const form = document.getElementById('convert-form');
const fromSelectBox = document.getElementById('from-select-box');
const toSelectBox = document.getElementById('to-select-box');
const amountSec = document.getElementById('amount-section');
const formBtn = document.getElementById('form-button');
const resultBox = document.getElementById('result-box');
const baseSymbol = document.getElementById('base-symbol');


const MY_API_KEY = 'e58e7885f40442e58e86468c';

function sendRequest(url){
    return fetch(url, {
        method: 'GET',
    }).then(response=>{
        if(response.status >= 200 && response.status <=300){
            return response.json()
        }else{
            throw new Error('Something went wrong, please try again')
        }
    }).catch(error=>{
        throw new Error('An unexpected server error occurred!')
    })
}


async function allCurrencies(){
    try{
        const response = await sendRequest(`https://v6.exchangerate-api.com/v6/${MY_API_KEY}/codes`);

        //const supported_codes = response.supported_codes[1][1]
        const supported_codes = response.supported_codes
        //console.log(supported_codes)
        for(const code of supported_codes){
            //console.log(code[1])
            const option = document.createElement('option');
            option.value = code[0];
            option.textContent = `${code[0]}-${code[1]}`;
            fromSelectBox.append(option)
        }
        for(const code of supported_codes){
            //console.log(code[1])
            const option = document.createElement('option');
            option.value = code[0];
            option.textContent = `${code[0]}-${code[1]}`;
            toSelectBox.append(option)
        }
    }catch(error){
        alert(error.message)
    }
}
allCurrencies()

async function convertCurrency(){
    const convertFrom = fromSelectBox.value;
    const convertTo = toSelectBox.value;
    const amount = amountSec.value;
    try{
        const response = await sendRequest(`https://v6.exchangerate-api.com/v6/${MY_API_KEY}/pair/${convertFrom}/${convertTo}/${amount}`);
        return response;
    }catch(error){
        alert(error.message)
    }
}

async function getRate(){
    try{
        const response = await sendRequest(`https://v6.exchangerate-api.com/v6/${MY_API_KEY}/latest/${toSelectBox.value}`)
        return response;
    }catch(error){
        alert(error.message)
    }
}

function showResultUI(){
    formBtn.classList.toggle('hidden')
    resultBox.classList.toggle('hidden')
}

function currencyConverter(targetCurrency, amount){
    const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: `${targetCurrency}` })
    const formattedAmount = formatCurrency.format(amount);
    return formattedAmount;
}

function conversionResult(){
    const conversion = document.getElementById('conversion');
    const convertFromDes = document.getElementById('convert-from-des')
    const baseCurrency = document.getElementById('base-currency');
    const targetCurrency = document.getElementById('target-currency');
    try{
        convertCurrency().then(result=>{
            const formattedAmount = currencyConverter(result.target_code, result.conversion_result)
            conversion.textContent = `${formattedAmount}`
            const formatedVersion = currencyConverter(result.base_code, amountSec.value)
            convertFromDes.textContent = `${formatedVersion} =`
            baseCurrency.textContent = `1 ${result.base_code} = ${result.conversion_rate} ${result.target_code}`
        })
        getRate().then(result=>{
            targetCurrency.textContent = `1 ${result.base_code} = ${result.conversion_rates[fromSelectBox.value]} ${fromSelectBox.value}`
        })
    }catch(error){
        alert(error)
    }
}

form.addEventListener('submit', event=>{
    event.preventDefault()
    showResultUI()
    conversionResult()
    getRate()
    //convertCurrency()
})

fromSelectBox.addEventListener('click', event=>{
    event.preventDefault()
    conversionResult()
    getRate()
    const formBtn = document.getElementById('form-button');
    formBtn.classList.add('hidden')
    resultBox.classList.remove('hidden')
    resultBox.classList.add('flex')
    baseSymbol.textContent = fromSelectBox.value;
})

toSelectBox.addEventListener('click', event=>{
    event.preventDefault()
    conversionResult()
    getRate()
    const formBtn = document.getElementById('form-button');
    formBtn.classList.add('hidden')
    resultBox.classList.remove('hidden')
    resultBox.classList.add('flex')
    //convertCurrency()
})

amountSec.addEventListener('input', event=>{
    event.preventDefault()
    conversionResult()
    getRate()
    const formBtn = document.getElementById('form-button');
    formBtn.classList.add('hidden')
    resultBox.classList.remove('hidden')
    resultBox.classList.add('flex')
    //convertCurrency()
})
//incorporate table for current positions
//Express JS and MongoDB Atlas
//sell button needs to validate available shares to sell
//needs validation for withdraws that exceed available cash
//styling Div for visual appeal
//closures as a way to retain data retrieved from fetch
//clean up code, bring assignment declarations to top of .js and split scripts into separate files
//add a news section/api call ingetrated with inputSearch



//nav bar toggle
const hamburgerButton = document.getElementsByClassName('hamburger-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
let quoteTable;
let inputSearch;
let runningCashTotal = 0;
let inputQuantity;

//0 cash as starting value into HTML
document.getElementById('runningCashTotal').innerHTML = `Available Cash: $${runningCashTotal}`;

hamburgerButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

//name and email input
document.getElementById('nameSubmit').onclick = function () {
    inputFName = document.getElementById('fName').value;
    document.getElementById('displayName').innerHTML = inputFName;
}

//search input
//alphavantage API key: 0PLG7TU5UCLCIXN9
//polygon URL/API key https://api.polygon.io/v2/last/nbbo/AAPL?apiKey=QvSfpHQm4pw_QxWpME0ZGlAWnZ8ApOj4
//test API: https://api.publicapis.org/entries
document.getElementById('searchSubmit').onclick = function () {
    inputSearch = document.getElementById('dataSearch').value;
    const searchRequest = new Request(`https://api.stockdata.org/v1/data/quote?symbols=${inputSearch}&api_token=vCTVEcNfSsddr1B79XDxOjvxv5Zl9woMT9xniDJP`, {
        method: 'GET'
    });
    // const searchRequest = new Request(`https://api.polygon.io/v2/aggs/ticker/${inputSearch}/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=QvSfpHQm4pw_QxWpME0ZGlAWnZ8ApOj4`, {
    //     method: 'GET'
    // });

    async function getResponse() {
        const response = await fetch(searchRequest);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error! Status: ${response.status}`);
        }
    }
    getResponse().then((data) => {
        // test API
        //console.log(data.entries[0]);
        // const stockData = data.entries[0];
        const stockData = data.data[0];
        console.log('Success:', stockData);

        displayQuote(stockData);

        function displayQuote(stockData) {

            for (const [key, value] of Object.entries(stockData)) {
                console.log(`${key}: ${value}`);
                quoteTable = document.getElementById('staticQuote');
                let row = `<tr>
                        <td>${key}: ${value}<br></td>
                        </tr>`;
                quoteTable.innerHTML += row;
            }
        }
        document.getElementById('name').innerHTML = `Name: ${stockData.name}`;
        document.getElementById('ticker').innerHTML = `Ticker: ${stockData.ticker}`;
        document.getElementById('price').innerHTML = `${stockData.price}`;
        document.getElementById('dayChange').innerHTML = `Day Change: ${stockData.day_change}`;
    });
}


document.getElementById('refreshButton').onclick = function () {
    inputSearch = document.getElementById("dataSearch").value;
    const searchRequest = new Request(`https://api.stockdata.org/v1/data/quote?symbols=${inputSearch}&api_token=vCTVEcNfSsddr1B79XDxOjvxv5Zl9woMT9xniDJP`, {
        method: 'GET'
    });
    async function getResponse() {
        const response = await fetch(searchRequest);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error! Status: ${response.status}`);
        }
    }
    getResponse().then((data) => {
        const stockData = data.data[0];
        console.log('Success:', stockData);
        displayQuote(stockData);

        function displayQuote(stockData) {
            for (const [key, value] of Object.entries(stockData)) {
                console.log(`${key}: ${value}`);
                quoteTable = document.getElementById('staticQuote');
                let row = `<tr>
                        <td>${key}: ${value}<br></td>
                        </tr>`;
                quoteTable.innerHTML += row;
            }
        }

        document.getElementById('name').innerHTML = `Name: ${stockData.name}`;
        document.getElementById('ticker').innerHTML = `Ticker: ${stockData.ticker}`;
        document.getElementById('price').innerHTML = `${stockData.price}`;
        document.getElementById('dayChange').innerHTML = `Day Change: ${stockData.day_change}`;

    });
}
//imitates a buy order

document.getElementById('buyButton').onclick = function (inputQuantity, stockPrice) {
    stockPrice = Number(document.getElementById('price').innerHTML);
    inputQuantity = Number(document.getElementById('quantity').value);
    console.log(typeof (runningCashTotal));
    console.log(typeof (runningCashTotal));
    let costBasis = inputQuantity * stockPrice;
    console.log(`check 1: ${costBasis}`);
    console.log(`check 1: ${runningCashTotal}`);
    console.log(typeof (runningCashTotal));
    console.log(`check 1: ${inputQuantity}`);
    console.log(`check 1: ${stockPrice}`);
    if (runningCashTotal <= costBasis) {
        alert('Not enough available cash for Buy Order...deposit more money!');
    } else {
        runningCashTotal = runningCashTotal - costBasis;

        console.log(`check 2: ${costBasis}`);
        console.log(`check 2: ${runningCashTotal}`);
        document.getElementById('runningCashTotal').innerHTML = `Available Cash: $${runningCashTotal}`;
        return runningCashTotal;
    }
    console.log(`check 3: ${runningCashTotal}`);
}
console.log(`check 4: ${runningCashTotal}`);

//imitates a sell order

//hide/unhide staticQuote and popupTicket

const staticQuoteDiv = document.getElementById('staticQuote');
const btnStaticQuoteDiv = document.getElementById('trade');
const popUpTicketDiv = document.getElementById('popUpTicket');
const btnPopUpTicketDiv = document.getElementById('changedMyMind');

btnStaticQuoteDiv.onclick = function () {
    if (staticQuoteDiv.style.display !== 'none') {
        staticQuoteDiv.style.display = 'none';
        popUpTicketDiv.style.display = 'block';
    } else {
        staticQuoteDiv.style.display = 'block';
        popUpTicketDiv.style.display = 'none';
    }
};


//running total of cash balance



document.getElementById('depositSubmit').onclick = function () {
    let inputDeposit = Number(document.getElementById('deposit').value);
    runningCashTotal = runningCashTotal + inputDeposit;
    document.getElementById('runningCashTotal').innerHTML = `Available Cash: $${runningCashTotal}`;
    // console.log(typeof (runningCashTotal));
    return runningCashTotal;
}

document.getElementById('withdrawSubmit').onclick = function () {
    let inputWithdraw = Number(document.getElementById('withdraw').value);
    if (runningCashTotal < inputWithdraw) {
        console.log((runningCashTotal));
        alert(`You're broke! Try a different dollar amount...`)
    } else {
        runningCashTotal = runningCashTotal - inputWithdraw;
        document.getElementById('runningCashTotal').innerHTML = `Available Cash: $${runningCashTotal}`;
        return runningCashTotal;
    }

}



//
// //search input
// let quoteTable;
// let inputSearch;
// //alphavantage API key: 0PLG7TU5UCLCIXN9
// //https://api.polygon.io/v2/last/nbbo/AAPL?apiKey=QvSfpHQm4pw_QxWpME0ZGlAWnZ8ApOj4
// document.getElementById("searchSubmit").onclick = function () {
//     inputSearch = document.getElementById("dataSearch").value;
//     // const searchRequest = new Request(`https://api.stockdata.org/v1/data/quote?symbols=${inputSearch}&api_token=vCTVEcNfSsddr1B79XDxOjvxv5Zl9woMT9xniDJP`, {
//     //     method: 'GET'
//     // });
//     const searchRequest = new Request(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=QvSfpHQm4pw_QxWpME0ZGlAWnZ8ApOj4`, {
//         method: 'GET'
//     });

//     fetch(searchRequest)
//         .then((response) => {
//             if (response.status === 200) {
//                 return response.json();
//             } else {
//                 console.log(`error ${response.status}`);
//             }
//         }).then((data) => {
//             const stockData = data.data[0];
//             displayQuote(stockData);
//             console.log('Success:', stockData);

//             function displayQuote(stockData) {
//                 for (const [key, value] of Object.entries(stockData)) {
//                     console.log(`${key}: ${value}`);
//                     quoteTable = document.getElementById('staticQuote');
//                     let row = `<tr>
//                         <td>${key}: ${value}<br></td>
//                         </tr>`;
//                     quoteTable.innerHTML += row;
//                 }
//             }
//         }).catch((error) => console.error('Error:', error));
// }
//

// console.log(inputSearch);
// const request = new XMLHttpRequest();
// request.open(`GET`, `https://api.stockdata.org/v1/data/quote?symbols=${inputSearch}&api_token=vCTVEcNfSsddr1B79XDxOjvxv5Zl9woMT9xniDJP`);

// request.onload = () => {
//     if (request.status === 200) {
//         console.log(JSON.parse(request.response));
//         (request.response);

//     } else {
//         console.log(`error ${request.status}`);
//     }
// }
// //
// request.send();



// const {
//     MongoClient,
//     ServerApiVersion
// } = require('mongodb');
// const uri = "mongodb+srv://firstuser:happytesting123@cluster0.d1w4uf0.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1
// });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });
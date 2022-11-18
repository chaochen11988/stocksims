//Express JS and MongoDB Atlas
//sell button needs to validate available shares to sell(can loop through an array of current positions)
//timer/countdown for when market closes or opens
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
document.getElementById('runningCashTotal').innerHTML = `Available Cash for Withdraw: $${runningCashTotal}`;

hamburgerButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

//name and email input
document.getElementById('infoSubmit').onclick = function () {
    let inputFName = document.getElementById('fName').value;
    let inputLName = document.getElementById('lName').value;
    let inputEmail = document.getElementById('email').value;
    document.getElementById('displayName').value = inputFName;
    document.getElementById('fNameFeedback').value = inputFName;
    document.getElementById('lNameFeedback').value = inputLName;
    document.getElementById('emailFeedback').value = inputEmail;
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
    // test API
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
        quoteTable = document.getElementById('staticQuote');
        displayQuote(stockData);

        function displayQuote(stockData) {
            quoteTable.innerHTML = '';

            let tr = document.createElement('tr');
            Object.entries(stockData).forEach(([key, value]) => {
                let td = document.createElement('td');
                td.innerHTML = `${key}: ${value}`;
                tr.appendChild(td);
            });
            quoteTable.appendChild(tr);

        }

        document.getElementById('name').innerHTML = `${stockData.name}`;
        document.getElementById('ticker').innerHTML = `Ticker: ${stockData.ticker}`;
        document.getElementById('price').innerHTML = `${stockData.price}`;
        document.getElementById('dayChange').innerHTML = `Day Change: ${stockData.day_change}`;
    });
    staticQuoteDiv.style.display = 'block';
    popUpTicketDiv.style.display = 'none';
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
        quoteTable = document.getElementById('staticQuote');

        function displayQuote(stockData) {
            quoteTable.innerHTML = '';
            let tr = document.createElement('tr');
            Object.entries(stockData).forEach(([key, value]) => {
                let td = document.createElement('td');
                td.innerHTML = `${key}: ${value}`;
                tr.appendChild(td);
            });
            quoteTable.appendChild(tr);

        }

        document.getElementById('name').innerHTML = `${stockData.name}`;
        document.getElementById('ticker').innerHTML = `Ticker: ${stockData.ticker}`;
        document.getElementById('price').innerHTML = `${stockData.price}`;
        document.getElementById('dayChange').innerHTML = `Day Change: ${stockData.day_change}`;

    });
}
//imitates a buy order

let currentPositions = [];

function acquisitionDate() {
    let date = new Date();
    let currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let currentTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let purchaseDateTime = currentDate + ' ' + currentTime;
    return purchaseDateTime;
}

function addPosition(Name, purchaseDateTime, Price, Quantity) {
    let eachPosition = {
        Name,
        purchaseDateTime,
        Price,
        Quantity
    };
    currentPositions.push(eachPosition);

    let positionTable = document.getElementById('currentPositions');
    currentPositions.forEach(currentPosition => {
        let tr = document.createElement('tr');
        Object.entries(currentPosition).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.innerHTML = `${value}`;
            tr.appendChild(td);
        });
        positionTable.appendChild(tr);
    });
}

document.getElementById('buyButton').onclick = function (inputQuantity, stockPrice) {
    stockName = document.getElementById('name').innerHTML;
    stockPrice = Number(document.getElementById('price').innerHTML);
    inputQuantity = Number(document.getElementById('quantity').value);
    let costBasis = inputQuantity * stockPrice;
    let purchaseDateTime = acquisitionDate();
    if (runningCashTotal <= costBasis) {
        let shortAvailableCash = runningCashTotal - costBasis;
        alert(`You need $${costBasis.toFixed(2)} in available cash to complete your Buy Order...you're short $${Math.abs(shortAvailableCash.toFixed(2))}, deposit more money!`);
    } else {
        runningCashTotal = runningCashTotal - costBasis;
        addPosition(stockName, purchaseDateTime, stockPrice, inputQuantity);
    }
    document.getElementById('runningCashTotal').innerHTML = `Total Cash: $${runningCashTotal.toFixed(2)}`;
    document.getElementById('availableCashForTrade').innerHTML = `Available Cash for Trade: $${runningCashTotal.toFixed(2)}`;
    return runningCashTotal;
}



//imitates a sell order



//hide/unhide staticQuote and popupTicket or reset tables

const staticQuoteDiv = document.getElementById('staticQuote');
const btnStaticQuoteDiv = document.getElementById('trade');
const popUpTicketDiv = document.getElementById('popUpTicket');
const btnResetQuotes = document.getElementById('reset');

btnStaticQuoteDiv.onclick = function () {
    staticQuoteDiv.style.display = 'none';
    popUpTicketDiv.style.display = 'block';
    // if (staticQuoteDiv.style.display !== 'none') {
    //     staticQuoteDiv.style.display = 'none';
    //     popUpTicketDiv.style.display = 'block';
    // } else {
    //     staticQuoteDiv.style.display = 'block';
    //     popUpTicketDiv.style.display = 'none';
    // }
};


btnResetQuotes.onclick = function () {
    staticQuoteDiv.innerHTML = '';
    document.getElementById('name').innerHTML = '';
    document.getElementById('ticker').innerHTML = '';
    document.getElementById('price').innerHTML = '';
    document.getElementById('dayChange').innerHTML = '';
    staticQuoteDiv.style.display = 'none';
    popUpTicketDiv.style.display = 'none';
};

//running total of cash balance

//functions for deposits and withdraws

document.getElementById('depositSubmit').onclick = function () {
    let inputDeposit = Number(document.getElementById('deposit').value);
    runningCashTotal = runningCashTotal + inputDeposit;
    document.getElementById('runningCashTotal').innerHTML = `Total Cash: $${runningCashTotal.toFixed(2)}`;
    document.getElementById('availableCashForTrade').innerHTML = `Available Cash for Trade: $${runningCashTotal.toFixed(2)}`;
    // console.log(typeof (runningCashTotal));
    alert(`$${inputDeposit.toFixed(2)} was deposited successfully! You have $${runningCashTotal.toFixed(2)} available for trade or withdraw.`);
    return runningCashTotal;
}

document.getElementById('withdrawSubmit').onclick = function () {
    let inputWithdraw = Number(document.getElementById('withdraw').value);
    if (runningCashTotal < inputWithdraw) {
        alert(`You currently have $${runningCashTotal.toFixed(2)} available for withdraw. Try withdrawing a different dollar amount...`);
    } else {
        runningCashTotal = runningCashTotal - inputWithdraw;
        document.getElementById('runningCashTotal').innerHTML = `Total Cash: $${runningCashTotal.toFixed(2)}`;
        document.getElementById('availableCashForTrade').innerHTML = `Available Cash for Trade: $${runningCashTotal.toFixed(2)}`;
        alert(`$${inputWithdraw.toFixed(2)} was withdrawn successfully! You have $${runningCashTotal.toFixed(2)} in your remaining balance.`);
        return runningCashTotal;
    }

}

//Character counter for textArea with maxlength of 600 char

const textArea = document.getElementById('message');
const characterCount = document.getElementById('characterCount');
// const wordCount = document.getElementById('wordCount');

textArea.oninput = () => {
    let characters = textArea.value;
    characterCount.textContent = characters.length;
    //code to exclude spaces 
    //characterCount.textContent = characters.replace(/\s/g, '').length;
    //word counter
    // let words = textArea.value.split(' ').filter((item) => {
    //     return item != '';
    // });
    // wordCount.textContent = words.length;
}

function sendEmail() {
    let inputFName = document.getElementById("fName").value;
    if (!document.getElementById('emailFeedback').value.includes("@")) {
        alert("Email address field must contain @ sign, please input a valid email address.");
    } else {
        Email.send({
            //working progress//
            Host: "smtp.gmail.com",
            Username: "chaochen11988testing@gmail.com",
            Password: "ruL7iU8aZSFd4F5",
            To: 'chaochen11988testing@gmail.com',
            From: document.getElementById("emailFeedback").value,
            Subject: "Feedback and suggestions",
            Body: "First name: " + document.getElementById("fNameFeedback").value +
                "<br> Last name: " + document.getElementById("lNameFeedback").value +
                "<br> Email address: " + document.getElementById("emailFeedback").value +
                "<br> Message: " + document.getElementById("message").value
        }).then(
            alert("Thank you for your inquiry," + " " + inputFName + "." + "\nI'll get back to you as soon as I can!"));
    }
}




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

// const express = require(`express`);

// const app = express();

// app.get(`/`, function (req, res) {
//     res.send(`Hello World!`);
// });

// app.listen(3000);
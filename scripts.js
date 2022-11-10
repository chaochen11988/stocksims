//nav bar
const hamburgerButton = document.getElementsByClassName("hamburger-btn")[0]
const navbarLinks = document.getElementsByClassName("navbar-links")[0]

hamburgerButton.addEventListener("click", () => {
    navbarLinks.classList.toggle("active")
})

//name and email input
let inputFName;
document.getElementById("nameSubmit").onclick = function () {
    inputFName = document.getElementById("fName").value;
    document.getElementById("displayName").innerHTML = inputFName;
}

//search input
let quoteTable;
let inputSearch;
//alphavantage API key: 0PLG7TU5UCLCIXN9
//polygon URL/API key https://api.polygon.io/v2/last/nbbo/AAPL?apiKey=QvSfpHQm4pw_QxWpME0ZGlAWnZ8ApOj4
//test API: https://api.publicapis.org/entries
document.getElementById("searchSubmit").onclick = function () {
    inputSearch = document.getElementById("dataSearch").value;
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
        document.getElementById("name").innerHTML = `Name: ${stockData.name}`;
        document.getElementById("ticker").innerHTML = `Ticker: ${stockData.ticker}`;
        document.getElementById("price").innerHTML = `Price: ${stockData.price}`;
        document.getElementById("dayChange").innerHTML = `Day Change: ${stockData.day_change}`;
    });
}




// refreshButton updates
// document.getElementById("refreshButton").onclick = function () {
//     inputSearch = document.getElementById("dataSearch").value;
//     const searchRequest = new Request(`https://api.stockdata.org/v1/data/quote?symbols=${inputSearch}&api_token=vCTVEcNfSsddr1B79XDxOjvxv5Zl9woMT9xniDJP`, {
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
//         }).catch((error) => console.error('Error:', error));
// }
// end of refreshButton updates


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
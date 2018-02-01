const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
const rp = require('request-promise');
// serve static assets normally
app.use(express.static(__dirname + '/public'))

// Handles all routes so you do not get a not found error
// app.get('*', function (request, response){
//     response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })

const page = data => {
    return `
    <html>
        <head>
            <title>Altcoin</title>
            <!--Stylesheet-->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <!--Container for React rendering-->
            <div id="container"></div>
            <!--Bundled file-->
            <script src="bundle.js"></script>
        </body>
    </html>
    `
}

let experied = false;
let _timestamp;
let cachedMarketSummary = [];
let cachedMarketDetails = {};

app.get('/api/markets', (req, res) => {
    const now = new Date();
    if (!_timestamp || now.getMilliseconds() - _timestamp.getMilliseconds() > 600000) {
        _timestamp = now;
        experied = true;
        rp('https://bittrex.com/api/v1.1/public/getmarkets')
        .then(res => {
            const result = JSON.parse(res);
            return result.result;
        }).then(data => {
            cachedMarketSummary = data.filter(element => element.IsActive);
            res.status(200).send(cachedMarketSummary);
        });
    } else {
        console.log('Using cached data for /api/markets');
        experied = false;
        res.status(200).send(cachedMarketSummary);
    }
});

app.get('/api/market', (req, res) => {
    const marketName = req.query.name;
    const now = new Date();
    if (!cachedMarketDetails[marketName] || experied) {
        rp(`https://bittrex.com/api/v1.1/public/getmarketsummary?market=${marketName}`)
        .then(res => {
            const result = JSON.parse(res);
            return result.result[0];
        }).then(data => {
            if (!cachedMarketDetails[marketName]) {
                cachedMarketDetails[marketName] = {};
                const found = cachedMarketSummary.find((element) => element.MarketName === marketName);
                if (found) {
                    cachedMarketDetails[marketName].LogoUrl = found.LogoUrl;
                }
            }
            cachedMarketDetails[marketName] = {...cachedMarketDetails[marketName], ...data};
            res.status(200).send(cachedMarketDetails[marketName]);
        });
    } else {
        console.log('Using cached data for /api/market');
        res.status(200).send(cachedMarketDetails[marketName]);
    }
});

app.get('/', (req, res) => {
    res.status(200).send(page());
});

app.listen(port)
console.log("server started on port " + port)

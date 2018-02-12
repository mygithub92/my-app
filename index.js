const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
const rp = require('request-promise');
const request = require('request');
const fs = require('fs');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
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

let favouriteMarkets = [];

app.post('/api/market/favourite', (req, res) => {
    let market = req.body.market;
    let favourite = req.body.favourite;
    if (favourite) {
        favouriteMarkets.push(market);
    } else {
        let index = favouriteMarkets.findIndex((element) => element.MarketName === market.MarketName);
        if (index > -1) {
            favouriteMarkets.splice(index, 1);
        }
    }
});

app.get('/api/favourites', (req, res) => {
    res.status(200).send(favouriteMarkets);
});

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

app.get('/api/icons', (req, res) => {
    rp('https://bittrex.com/api/v1.1/public/getmarkets')
        .then(res => {
            const result = JSON.parse(res);
            return result.result;
        }).then(data => {
            const cachedMarketSummary = data.filter(element => element.IsActive);
            cachedMarketSummary.forEach(element => {
                if(element.LogoUrl) {
                download(element.LogoUrl, element.marketName, () => {
                    console.log('done');
                });
            }
            })
        });
});


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(__dirname + '/public/icons/' + filename)).on('close', callback);
  });
};

app.get('/', (req, res) => {
    res.status(200).send(page());
});

app.listen(port)
console.log("server started on port " + port)

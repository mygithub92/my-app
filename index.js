const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
const rp = require('request-promise');
const request = require('request');
const fs = require('fs');
const download = require('image-downloader');

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

// app.get('/api/icons', (req, res) => {
//     rp('https://bittrex.com/api/v1.1/public/getmarkets')
//         .then(res => {
//             const result = JSON.parse(res);
//             return result.result;
//         }).then(data => {
//             data.forEach(element => {
//                 console.log(element.LogoUrl);
//                 if(element.LogoUrl) {
//                     download.image({
//                         url: element.LogoUrl,
//                         dest: __dirname + '/public/icons/'
//                     }).then(({filename, image}) => {
//                         console.log('File saved to', filename);
//                     }).catch(err => console.log(err))
//                 }
//             })
//         });
// });

app.get('/', (req, res) => {
    res.status(200).send(page());
});

app.listen(port)
console.log("server started on port " + port)

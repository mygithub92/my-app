const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
const rp = require('request-promise');
const request = require('request');
const fs = require('fs');
const download = require('image-downloader');
const admin = require('firebase-admin');
const firebase = require('firebase');


// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');
// Creates a client
const storage = new Storage();
//export GOOGLE_APPLICATION_CREDENTIALS="/Users/David/react/my-app/myapp-45947-firebase-adminsdk-eh7wx-ed0e85c773.json"
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const bucketName = 'gs://myapp-45947-icons';
const filename = '/Users/David/react/my-app/public/icons/d7711420-de59-4c1f-b4da-e4eb4846d56f.png';

var config = {
    apiKey: "AIzaSyDJrPj303CpQXP88XyNUJqjK_YDNHKbaZ4",
    authDomain: "myapp-45947.firebaseapp.com",
    databaseURL: "https://myapp-45947.firebaseio.com",
    projectId: "myapp-45947",
    storageBucket: "myapp-45947.appspot.com",
    messagingSenderId: "346617754136"
  };
firebase.initializeApp(config);
const database = firebase.database();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// serve static assets normally
app.use(express.static(__dirname + '/public'))



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

app.get('/api/persist', (req, res) => {
    firebase.auth().signInWithEmailAndPassword('linlwangster@gmail.com', '12345678').catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    database.ref('markets/' + 'LTC').set({"MarketCurrency":"LTC","BaseCurrency":"BTC","MarketCurrencyLong":"Litecoin","BaseCurrencyLong":"Bitcoin","MinTradeSize":0.01378854,"MarketName":"BTC-LTC","IsActive":true,"Created":"2014-02-13T00:00:00","Notice":null,"IsSponsored":null,"LogoUrl":"https://bittrexblobstorage.blob.core.windows.net/public/6defbc41-582d-47a6-bb2e-d0fa88663524.png"});
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

// app.get('/api/upload/icons', (req, res) => {
   
//     const path = __dirname + '/public/icons/'
//     fs.readdir(path, (err, files) => {
//         files.forEach(file => {
//             storage
//             .bucket(bucketName)
//             .upload(path + file)
//             .then(() => {
//               console.log(`${filename} uploaded to ${bucketName}.`);
//             })
//             .catch(err => {
//               console.error('ERROR:', err);
//             });
//             // console.log(path + file)
//         });
//     })
// });



app.get('/', (req, res) => {
    res.status(200).send(page());
});

app.listen(port)
console.log("server started on port " + port)

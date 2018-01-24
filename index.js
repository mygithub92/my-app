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
            <title>Altcoin2323232</title>
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

app.get('/api/retrieve', (req, res) => {
    rp('https://bittrex.com/api/v1.1/public/getmarkets')
    .then(res => {
        const result = JSON.parse(res);
        return result.result;
    }).then(data => {
        res.status(200).send(data);
    });
});

app.get('/', (req, res) => {
    res.status(200).send(page());
});

app.listen(port)
console.log("server started on port " + port)

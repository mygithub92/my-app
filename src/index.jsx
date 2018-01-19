import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Market from './market/market.component.jsx'
import MarketDetail from './market/market-details.component.jsx'

const data = JSON.parse('[{"MarketCurrency":"LTC","BaseCurrency":"BTC","MarketCurrencyLong":"Litecoin","BaseCurrencyLong":"Bitcoin","MinTradeSize":0.01469482,"MarketName":"BTC-LTC","IsActive":true,"Created":"2014-02-13T00:00:00","Notice":null,"IsSponsored":null,"LogoUrl":"https://bittrexblobstorage.blob.core.windows.net/public/6defbc41-582d-47a6-bb2e-d0fa88663524.png"},{"MarketCurrency":"DOGE","BaseCurrency":"BTC","MarketCurrencyLong":"Dogecoin","BaseCurrencyLong":"Bitcoin","MinTradeSize":274.72527473,"MarketName":"BTC-DOGE","IsActive":true,"Created":"2014-02-13T00:00:00","Notice":null,"IsSponsored":null,"LogoUrl":"https://bittrexblobstorage.blob.core.windows.net/public/a2b8eaee-2905-4478-a7a0-246f212c64c6.png"},{"MarketCurrency":"VTC","BaseCurrency":"BTC","MarketCurrencyLong":"Vertcoin","BaseCurrencyLong":"Bitcoin","MinTradeSize":0.58028875,"MarketName":"BTC-VTC","IsActive":true,"Created":"2014-02-13T00:00:00","Notice":null,"IsSponsored":null,"LogoUrl":"https://bittrexblobstorage.blob.core.windows.net/public/1f0317bc-c44b-4ea4-8a89-b9a71f3349c8.png"},{"MarketCurrency":"PPC","BaseCurrency":"BTC","MarketCurrencyLong":"Peercoin","BaseCurrencyLong":"Bitcoin","MinTradeSize":0.45880820,"MarketName":"BTC-PPC","IsActive":true,"Created":"2014-02-13T00:00:00","Notice":null,"IsSponsored":null,"LogoUrl":"https://bittrexblobstorage.blob.core.windows.net/public/c3409d42-a907-4764-ad03-118917761cc2.png"}]');

render(
    <Router history={browserHistory}>
        <Route>
            <Route path="/" component={Market}/>
            <Route path="/markets/:id" component={MarketDetail} data={data}/>
         </Route>
    </Router>,
    document.getElementById('container')
);

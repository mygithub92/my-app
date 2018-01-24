import React, { Component } from 'react';
import { render } from 'react-dom';
import Store from './stores/Store';
import App from './App';
// Import routing components
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Market from './market/market.component.jsx'
import MarketDetail from './market/market-details.component.jsx'


render(
    <App/>,
    document.getElementById('container')
);

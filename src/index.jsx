import React from 'react';
import Market from './market/market.component.jsx';
import MarketDetail from './market/market-details.component.jsx'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import { render } from 'react-dom';

render(            
    <Router history={browserHistory}>
        <Route path="/" component={Market}/>
        <Route path="/markets/:name" component={MarketDetail}/>
    </Router>,
    document.getElementById('container')
)



import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Market from './market/market.component.jsx';
import Favourite from './market/favourite.component.jsx';
import MarketDetail from './market/market-details.component.jsx'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import { render } from 'react-dom';

render(            
    <Tabs>
        <TabList>
            <Tab>All Coins</Tab>
            <Tab>Favourite</Tab>
        </TabList>
        <TabPanel>
            <Router history={browserHistory}>
                <Route path="/" component={Market}/>
                <Route path="/markets/:name" component={MarketDetail}/>
            </Router>
        </TabPanel>
        <TabPanel>
            <Favourite/>
        </TabPanel>
    </Tabs>,
    document.getElementById('container')
)



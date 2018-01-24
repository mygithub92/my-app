import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

class Market extends Component {
    render(){
        // Get data from route props
        const markets = this.props.data;
        // Map through cars and return linked cars
        const marketNode = markets.map((market) => {
            return (
                <Link
                    to={"/markets/"+market.MarketName}
                    className="list-group-item"
                    key={market.MarketName}>
                    <p><img src={market.LogoUrl} width="42" height="42"/>{market.MarketName}</p>
                    <p>{market.MinTradeSize}</p>
                </Link>
            )
        });
        return (
            <div>
                <h1>Markets</h1>
                <div className="list-group">
                    {marketNode}
                </div>
            </div>
        );
    }
}

export default Market
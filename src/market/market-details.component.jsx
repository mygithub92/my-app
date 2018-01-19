import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class MarketDetail extends Component {
    handleRedirect(){
        browserHistory.push('/');
    }
    render(){
        const markdets = this.props.route.data;
        const id = this.props.params.id;
        const market = markdets.filter(market => {
            if(market.MarketName == id) {
                return market;
            }
        })[0];

        return (
            <div>
                <h1>{market.MarketName}</h1>
                <div className="row">
                    <div className="col-sm-6 col-md-4">
                        <div className="thumbnail">
                            <img src={market.LogoUrl} alt={market.MarketName} width="300" height="300"/>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                       <ul>
                           <li><strong>Market Currency</strong>: {market.MarketCurrencyLong}</li>
                           <li><strong>Base Currency</strong>: {market.BaseCurrencyLong}</li>
                           <li><strong>Min Trade Size</strong>: {market.MinTradeSize}</li>
                           <li><strong>Created</strong>: {market.Created}</li>
                       </ul>
                    </div>
                    <div className="col-md-12">
                        <button className="btn btn-default" onClick={this.handleRedirect.bind(this)}>Go to Markets</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MarketDetail
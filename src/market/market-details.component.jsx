import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';

class MarketDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        const name = this.props.params.name;
        this.fetchData(name);
    };

    fetchData = (name) => {
        axios.get(`/api/market?name=${name}`).then(res => {
            this.setState({market: res.data});
        }).catch(err => console.log(err));
    };

    handleRedirect(){
        browserHistory.push('/');
    };

    render(){
        const market = this.state.market;
        if(!market) {
            return null;
        }

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
                           <li><strong>Market Name</strong>: {market.MarketName}</li>
                           <li><strong>High</strong>: {market.High + ''}</li>
                           <li><strong>Low</strong>: {market.Low + ''}</li>
                           <li><strong>Volume</strong>: {market.Volume + ''}</li>
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
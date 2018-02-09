import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import * as FontAwesome from 'react-icons/lib/fa'

class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {markets:[]};
        this.fetchData();
    };

    fetchData = () => {
        axios.get('/api/markets').then(res => {
            this.setState({markets: res.data});
        }).catch(err => console.log(err));
    }

    render(){
        const markets = this.state.markets;
        const marketNode = markets.map((market) => {
            return (
                <div className="list-group-item">
                    <div className="row">
                        <div className="col-10">
                        <Link
                            to={"/markets/"+market.MarketName}
                            key={market.MarketName}>
                            <p><img src={market.LogoUrl} width="42" height="42"/>{market.MarketName}</p>
                            <p>{market.MinTradeSize}</p>
                        </Link>
                        </div>
                        <div className="col-2">
                        <Favourite markdetName={market.MarketName}/>
                        </div>
                    </div>
                </div>
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

class Favourite extends Component {

    constructor(props) {
        super(props);
        this.state = {favourited: false};
    }

    handleClick = () => {
        this.setState({favourited: !this.state.favourited});
        axios.post('/api/market/favourite', {marketName: this.props.markdetName, favourite: !this.state.favourited});
    }

    render() {
        return <span onClick={this.handleClick}>
                {this.state.favourited ? <FontAwesome.FaStar size="50"/> : <FontAwesome.FaStarO size="50"/>}
            </span>;
    }
}

export default Market
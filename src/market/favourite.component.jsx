import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import * as FontAwesome from 'react-icons/lib/fa'

class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {markets:[]};
        this.fetchData();
    };

    fetchData = () => {
        axios.get('/api/favourites').then(res => {
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
                            <Delete market={market}/>
                        </div>
                    </div>
                </div>
            )
        });
        return (
            <div>
                <div className="list-group">
                    {marketNode}
                </div>
            </div>
        );
    }
}

class Delete extends Component {
    constructor(props) {
        super(props)
    }

    handleClick = () => {
        axios.post('/api/market/favourite', {market: this.props.market, favourite: false});
    }

    render() {
        return <span onClick={this.handleClick}>
            <FontAwesome.FaTrash size="50"/>
        </span>
    }
}
export default Favourite
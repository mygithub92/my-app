import React from 'react';
import Market from './market/market.component.jsx';
import MarketDetail from './market/market-details.component.jsx'
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {result:[]};
      axios.defaults.withCredentials = true;
      axios.get('/api/retrieve').then(res => {
          console.log(res.data);
          this.setState({result: res.data});
      }).catch(err => console.log(err));
    }

    render() {
      return (
        <div>
          <Market data={this.state.result}/>
        </div>
      );
    }
  }
  export default App;
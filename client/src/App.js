import './App.css';
import Homepage from './pages/homepage/homepage.component.jsx';
import Champions from './pages/champions/champions.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import {Switch, Route} from 'react-router-dom';

import axios from 'axios';

function App() {
  const getPlayers = () => {
    axios({
      url: '/lolapi',
      method: 'post'
    }).then(response => console.log(response));
  }
  

  return (
    <div className="App">
      <button onClick={getPlayers}>GET CHALLENGER PLAYERS</button>
      <Switch>
        <Route exact path='/'>
          <Homepage/>
        </Route>
        <Route exact path='/champions'>
          <Champions/>
        </Route>
        <Route path='/champions/:champion'>
          <ChampionDetails/>
        </Route>
      </Switch>
        
    </div>
    
  );
}

export default App;

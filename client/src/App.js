import './App.css';
import Homepage from './pages/homepage/homepage.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import MatchDetails from './pages/matchdetails/matchdetails.component.jsx';
import ErrorBoundary from './components/errorboundary/errorboundary.component';
import {Switch, Route, Redirect} from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <Switch>
          <Route exact path='/'>
            <Homepage/>
          </Route>
          <Route path='/champions/:champion'>
            <ErrorBoundary>
              <ChampionDetails/>
            </ErrorBoundary>
          </Route>
          <Route path='/matches/:server/:gameid/:champion'>
            <ErrorBoundary>
              <MatchDetails/>
            </ErrorBoundary>
          </Route>
          <Redirect to='/'/>
      </Switch>
      
    </div>
  );
}

export default App;

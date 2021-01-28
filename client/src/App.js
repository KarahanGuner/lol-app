import './App.css';
import Homepage from './pages/homepage/homepage.component.jsx';
import Champions from './pages/champions/champions.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import ErrorBoundary from './components/errorboundary/errorboundary.component';
import {Switch, Route, Redirect} from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <Switch>
          <Route exact path='/'>
            <Homepage/>
          </Route>
          <Route exact path='/champions'>
            <Champions/>
          </Route>
          <Route path='/champions/:champion'>
            <ErrorBoundary>
              <ChampionDetails/>
            </ErrorBoundary>
          </Route>
          <Redirect to='/'/>
      </Switch>
      
    </div>
  );
}

export default App;

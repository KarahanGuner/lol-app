import './App.css';
import React, {useEffect} from 'react';
import Homepage from './pages/homepage/homepage.component.jsx';
import About from './pages/about/about.component.jsx';
import Champions from './pages/champions/champions.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import MatchDetails from './pages/matchdetails/matchdetails.component.jsx';
import ErrorBoundary from './components/errorboundary/errorboundary.component';
import {Switch, Route, Redirect} from 'react-router-dom';
import ReactGA from 'react-ga';

function App() {
  useEffect(() => {
    ReactGA.initialize('UA-192120680-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  });

  return (
    <div className="App">
      <Switch>
          <Route exact path='/'>
            <Homepage/>
          </Route>
          <Route exact path='/about'>
            <About/>
          </Route>
          <Route exact path='/champions'>
            <ErrorBoundary>
              <Champions/>
            </ErrorBoundary>
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

import './App.css';
import React, {useEffect} from 'react';
import Homepage from './pages/homepage/homepage.component.jsx';
import About from './pages/about/about.component.jsx';
import Champions from './pages/champions/champions.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import MatchDetails from './pages/matchdetails/matchdetails.component.jsx';
import ErrorBoundary from './components/errorboundary/errorboundary.component';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-192139836-1');


function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname); 
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

export default withRouter(App);

import './App.css';
import Homepage from './pages/homepage/homepage.component.jsx';
import About from './pages/about/about.component.jsx';
import Champions from './pages/champions/champions.component.jsx';
import ChampionDetails from './pages/championdetails/championdetails.component.jsx';
import MatchDetails from './pages/matchdetails/matchdetails.component.jsx';
import ErrorBoundary from './components/errorboundary/errorboundary.component';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Helmet} from "react-helmet";

function App() {
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Challenger Builds</title>
        <meta name="description" content="Challenger Builds helps players build the best items for their champions. It looks at the matches of hundreds of different challenger players across servers and finds the best builds." />
      </Helmet>
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

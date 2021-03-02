import React from 'react';
import './championdetailsbottom.styles.css';
import ResultRow from  '../resultrow/resultrow.component';
import ResultRowHeader from  '../resultrowheader/resultrowheader.component';
import Spinner from '../../components/spinner/spinner.component';
import {Link} from 'react-router-dom';

function ChampionDetailsBottom(props) {
  return (
    <div className="championdetailsbottom">
      {!props.loading ? <div className="results-container">
        <ResultRowHeader></ResultRowHeader> 
        {props.matches.map((match, i) =><Link style={{textDecoration: 'none'}} to={`/matches/${match.server}/${match.gameId}/${props.championDdragonName}`}><ResultRow key={i} championDdragonName={props.championDdragonName} match={match}/></Link>)}
      </div> : <Spinner/>}

      
    </div>
  );
}

export default ChampionDetailsBottom;

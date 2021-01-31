import React from 'react';
import './championdetailstop.styles.css';
import {currentPatch} from '../../miscData.js';

function ChampionDetailsTop(props) {
  const {championDdragonName, numberOfGames} = props;
  return (
    <div className="championdetailstop">
      <img className="champion-picture" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championDdragonName}.png`} alt="champion"/>
      <div className="championdetailstop-textgroup">
        <div className="championdetailstop-championname">{championDdragonName} </div>
        <div>Games Played:&nbsp;<span className="championdetailstop-thenumber">{numberOfGames}</span></div>
      </div>

    </div>
    
  );
}

export default ChampionDetailsTop;

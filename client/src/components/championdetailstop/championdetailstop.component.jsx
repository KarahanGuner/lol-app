import React from 'react';
import './championdetailstop.styles.css';
import {currentPatch, championNames} from '../../miscData.js';

function ChampionDetailsTop(props) {
  const {championDdragonName, numberOfGames, championNameForHeader} = props;
  return (
    <div className="championdetailstop">
      <img className="champion-picture" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championDdragonName}.png`} alt="champion"/>
      <div className="championdetailstop-textgroup">
        <div className="championdetailstop-championname">{championNames.find(champion => (champion.replace(/\s/g, '').toLowerCase()) == championNameForHeader)} </div>
        <div>Games Played:&nbsp;<span className="championdetailstop-thenumber">{numberOfGames}</span></div>
      </div>

    </div>
    
  );
}

export default ChampionDetailsTop;

import React from 'react';
import './championdetailstop.styles.css';
import {currentPatch} from '../../miscData.js';

function ChampionDetailsTop(props) {
  const {championDdragonName} = props;
  return (
    <div className="championdetailstop">
      <img className="champion-picture" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championDdragonName}.png`} alt="champion"/>&nbsp;
      {championDdragonName} 
    </div>
    
  );
}

export default ChampionDetailsTop;

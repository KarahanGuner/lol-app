import React, {useState} from 'react';
import './resultrow.styles.css';
import {currentPatch} from '../../miscData';

function ResultRow(props) {
  const itemReference = React.useRef(null);
  console.log('resultrow rerendered')
  const [hoveredDiv, changeHoveredDiv] = useState();

  return (
    <div className="result-row">
      {hoveredDiv ? <div style={{position:`fixed`,left:`${hoveredDiv.positionLeft}px`,top:`${hoveredDiv.positionTop-100}px`}}>{hoveredDiv.item}</div>: null}
      <div className="challengernamewon-container">
        {props.match.summonerName}
      </div>
      <div className="challengerimage-container"
        ref={itemReference} 
        onMouseEnter={() => {changeHoveredDiv({item:'champion', positionLeft:itemReference.current.offsetLeft, positionTop:itemReference.current.offsetTop})}} 
        onMouseLeave={() => {changeHoveredDiv();}}>
        <img className="champion-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${props.championDdragonName}.png`} alt="champion"/>
      </div>
      <div className="cross-container">
        X
      </div>
      <div className="vs-container">
        <img className="champion-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${props.match.versus}.png`} alt="champion"/>
      </div>
      <div className="score-container">
        <span className="score-green">{`${props.match.matchData.stats.kills}`}</span><span className="score-transparent">/</span><span className="score-red">{`${props.match.matchData.stats.deaths}`}</span><span className="score-transparent">/</span><span className="score-green">{`${props.match.matchData.stats.assists}`}</span>
      </div>
      <div className="level-container">
        {`${props.match.matchData.stats.champLevel}`}
      </div>
      <div className="items-container">
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item0.image}`} alt={`${props.match.matchData.stats.item0.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item1.image}`} alt={`${props.match.matchData.stats.item1.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item2.image}`} alt={`${props.match.matchData.stats.item2.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item3.image}`} alt={`${props.match.matchData.stats.item3.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item4.image}`} alt={`${props.match.matchData.stats.item4.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item5.image}`} alt={`${props.match.matchData.stats.item5.name}`}/>
        <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item6.image}`} alt={`${props.match.matchData.stats.item6.name}`}/>
      </div>
      <div className="gold-container">
        {`${props.match.matchData.stats.goldEarned}`}
      </div>
      <div className="keystone-container">
        <img className="row-icon" src={`https://ddragon.leagueoflegends.com/cdn/img/${props.match.matchData.stats.perk0.icon}`} alt={`${props.match.matchData.stats.perk0.key}`}/>
        <img className="secondary-rune-path-icon" src={`https://ddragon.leagueoflegends.com/cdn/img/${props.match.matchData.stats.perkSubStyle}`} alt="keystone"/>
      </div>
      <div className="summonerspells-container">
        <img className="row-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${props.match.matchData.spell1Id}`} alt={`${props.match.matchData.spell1Id}`}/>&nbsp;
        <img className="row-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${props.match.matchData.spell2Id}`} alt={`${props.match.matchData.spell2Id}`}/>
      </div>
    </div>
    
  );
}

export default ResultRow;

import React, {useState} from 'react';
import './resultrow.styles.css';
import {currentPatch} from '../../miscData';

function ResultRow(props) {
  const itemReferenceZero = React.useRef(null);
  const itemReferenceSix = React.useRef(null);
  console.log('resultrow rerendered')
  const [hoveredDiv, changeHoveredDiv] = useState();

  return (
    <div className="result-row">
      {hoveredDiv ? 
        <div style={{position:`absolute`, width:`auto`, maxWidth:`400px`, height:`auto`, backgroundColor:`black`,left:`${hoveredDiv.positionLeft-84}px`,top:`${hoveredDiv.positionTop+50}px`}}><div>{hoveredDiv.item.name}</div><div dangerouslySetInnerHTML={{ __html: hoveredDiv.item.description }} /></div>: 
        null
      }
      <div className={props.match.matchData.stats.win ? `challengernamewon-container`: `challengernameloss-container`}>
        {props.match.summonerName}
      </div>
      <div className="challengerimage-container">
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
        {props.match.matchData.stats.item0 ? 
          <img
            ref={itemReferenceZero} 
            onMouseEnter={() => {console.table('item reference'+ Object.entries(itemReferenceZero));console.log('offsetLeft = ' +itemReferenceZero.current.offsetLeft);console.log('offsetTop = ' +itemReferenceZero.current.offsetTop);changeHoveredDiv({item:props.match.matchData.stats.item0, positionLeft:itemReferenceZero.current.offsetLeft, positionTop:itemReferenceZero.current.offsetTop})}} 
            onMouseLeave={() => {changeHoveredDiv();}} 
            className="item-icon" 
            src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item0.image}`} 
            alt={`${props.match.matchData.stats.item0.name}`}/> :
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item1 ? <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item1.image}`} alt={`${props.match.matchData.stats.item1.name}`}/>:<div className="empty-item"></div>}
        {props.match.matchData.stats.item2 ? <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item2.image}`} alt={`${props.match.matchData.stats.item2.name}`}/>:<div className="empty-item"></div>}
        {props.match.matchData.stats.item3 ? <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item3.image}`} alt={`${props.match.matchData.stats.item3.name}`}/>:<div className="empty-item"></div>}
        {props.match.matchData.stats.item4 ? <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item4.image}`} alt={`${props.match.matchData.stats.item4.name}`}/>:<div className="empty-item"></div>}
        {props.match.matchData.stats.item5 ? <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item5.image}`} alt={`${props.match.matchData.stats.item5.name}`}/>:<div className="empty-item"></div>}
        {props.match.matchData.stats.item6 ? 
          <img 
            ref={itemReferenceSix} 
            onMouseEnter={() => {console.log('offsetLeft = ' +itemReferenceSix.current.offsetLeft);console.log('offsetTop = ' +itemReferenceSix.current.offsetTop);changeHoveredDiv({item:props.match.matchData.stats.item6, positionLeft:itemReferenceSix.current.offsetLeft, positionTop:itemReferenceSix.current.offsetTop})}} 
            onMouseLeave={() => {changeHoveredDiv();}} 
            className="item-icon" 
            src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item6.image}`} 
            alt={`${props.match.matchData.stats.item6.name}`}/>:
          <div className="empty-item"></div>}
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

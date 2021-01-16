import React, {useState} from 'react';
import './resultrow.styles.css';


function ResultRow() {
  const itemReference = React.useRef(null);
  console.log('resultrow rerendered')
  const [hoveredDiv, changeHoveredDiv] = useState();

  return (
    <div className="result-row">
      {hoveredDiv ? <div style={{position:`fixed`,left:`${hoveredDiv.positionLeft}px`,top:`${hoveredDiv.positionTop-100}px`}}>{hoveredDiv.item}</div>: null}
      <div className="challengernamewon-container">
        Thebausffs
      </div>
      <div className="challengerimage-container"
        ref={itemReference} 
        onMouseEnter={() => {changeHoveredDiv({item:'champion', positionLeft:itemReference.current.offsetLeft, positionTop:itemReference.current.offsetTop})}} 
        onMouseLeave={() => {changeHoveredDiv();}}>
        <img className="champion-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/Pantheon.png" alt="champion"/>
      </div>
      <div className="cross-container">
        X
      </div>
      <div className="vs-container">
        <img className="champion-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/Lucian.png" alt="champion"/>
      </div>
      <div className="score-container">
        2/53/53
      </div>
      <div className="lane-container">
        Jungle
      </div>
      <div className="items-container">
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
        <img className="item-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/item/3089.png" alt="item"/>
      </div>
      <div className="gold-container">
        12,243
      </div>
      <div className="keystone-container">
        <img className="row-icon" src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png" alt="keystone"/>
        <img className="secondary-rune-path-icon" src="https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png" alt="keystone"/>
      </div>
      <div className="summonerspells-container">
        <img className="row-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/spell/SummonerFlash.png" alt="summonerspell"/>
        <img className="row-icon" src="https://ddragon.leagueoflegends.com/cdn/10.25.1/img/spell/SummonerDot.png" alt="summonerspell"/>
      </div>
    </div>
    
  );
}

export default ResultRow;

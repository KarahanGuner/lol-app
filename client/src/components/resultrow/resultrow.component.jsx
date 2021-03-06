import React from 'react';
import './resultrow.styles.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'
import ContentForTooltip from '../contentfortooltip/contentfortooltip.component';
import {currentPatch} from '../../miscData';

function ResultRow(props) {

  return (
    <div className="result-row-container">
    <div className="result-row">
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
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item0.name} image={props.match.matchData.stats.item0.image} gold={props.match.matchData.stats.item0.gold} description={props.match.matchData.stats.item0.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item0.image}`} alt={`${props.match.matchData.stats.item0.name}`}/>
          </Tippy> :
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item1 ?
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item1.name} image={props.match.matchData.stats.item1.image} gold={props.match.matchData.stats.item1.gold} description={props.match.matchData.stats.item1.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item1.image}`} alt={`${props.match.matchData.stats.item1.name}`}/>
          </Tippy>:
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item2 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item2.name} image={props.match.matchData.stats.item2.image} gold={props.match.matchData.stats.item2.gold} description={props.match.matchData.stats.item2.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item2.image}`} alt={`${props.match.matchData.stats.item2.name}`}/>
          </Tippy>:
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item3 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item3.name} image={props.match.matchData.stats.item3.image} gold={props.match.matchData.stats.item3.gold} description={props.match.matchData.stats.item3.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item3.image}`} alt={`${props.match.matchData.stats.item3.name}`}/>
          </Tippy>:
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item4 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item4.name} image={props.match.matchData.stats.item4.image} gold={props.match.matchData.stats.item4.gold} description={props.match.matchData.stats.item4.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item4.image}`} alt={`${props.match.matchData.stats.item4.name}`}/>
          </Tippy>:
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item5 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item5.name} image={props.match.matchData.stats.item5.image} gold={props.match.matchData.stats.item5.gold} description={props.match.matchData.stats.item5.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item5.image}`} alt={`${props.match.matchData.stats.item5.name}`}/>
          </Tippy>:
          <div className="empty-item"></div>}
        {props.match.matchData.stats.item6 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.match.matchData.stats.item6.name} image={props.match.matchData.stats.item6.image} gold={props.match.matchData.stats.item6.gold} description={props.match.matchData.stats.item6.description}></ContentForTooltip>}>
            <img className="item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.match.matchData.stats.item6.image}`} alt={`${props.match.matchData.stats.item6.name}`}/>
          </Tippy>:
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
    </div>
    
  );
}

export default ResultRow;

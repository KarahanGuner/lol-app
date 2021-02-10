import React from 'react';
import './matchdetailsresultrow.styles.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'
import ContentForTooltip from '../contentfortooltip/contentfortooltip.component';
import {currentPatch} from '../../miscData';
import {Link} from 'react-router-dom';

function MatchDetailsResultRow(props) {
  console.log('matchdetailsresultrow rerendered')
  return (
    <div className="matchdetails-result-row-container">
    <div className="matchdetails-result-row">
      <Link style={{textDecoration: 'none', color: '#e7effa'}} to={`/matches/${props.linkProps.server}/${props.linkProps.gameId}/${props.linkProps.championName}`}>
        <div style={props.chosenParticipantKey == props.participantStats.championId ? {color: '#57D900'}: null} className="matchdetails-challengername">
          {props.participantIdentity}
        </div>
      </Link>  
      <div className="matchdetails-challengerimage-container">
        <img className="matchdetails-champion-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${props.participantStats.championName}.png`} alt="champion"/>
      </div>
      <div className="matchdetails-score-container">
        <span className="matchdetails-score-green">{`${props.participantStats.stats.kills}`}</span><span className="matchdetails-score-transparent">/</span><span className="matchdetails-score-red">{`${props.participantStats.stats.deaths}`}</span><span className="matchdetails-score-transparent">/</span><span className="matchdetails-score-green">{`${props.participantStats.stats.assists}`}</span>
      </div>
      <div className="matchdetails-level-container">
        {`${props.participantStats.stats.champLevel}`}
      </div>
      <div className="matchdetails-items-container">
        {props.participantStats.stats.item0 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item0.name} image={props.participantStats.stats.item0.image} gold={props.participantStats.stats.item0.gold} description={props.participantStats.stats.item0.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item0.image}`} alt={`${props.participantStats.stats.item0.name}`}/>
          </Tippy> :
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item1 ?
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item1.name} image={props.participantStats.stats.item1.image} gold={props.participantStats.stats.item1.gold} description={props.participantStats.stats.item1.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item1.image}`} alt={`${props.participantStats.stats.item1.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item2 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item2.name} image={props.participantStats.stats.item2.image} gold={props.participantStats.stats.item2.gold} description={props.participantStats.stats.item2.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item2.image}`} alt={`${props.participantStats.stats.item2.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item3 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item3.name} image={props.participantStats.stats.item3.image} gold={props.participantStats.stats.item3.gold} description={props.participantStats.stats.item3.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item3.image}`} alt={`${props.participantStats.stats.item3.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item4 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item4.name} image={props.participantStats.stats.item4.image} gold={props.participantStats.stats.item4.gold} description={props.participantStats.stats.item4.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item4.image}`} alt={`${props.participantStats.stats.item4.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item5 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item5.name} image={props.participantStats.stats.item5.image} gold={props.participantStats.stats.item5.gold} description={props.participantStats.stats.item5.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item5.image}`} alt={`${props.participantStats.stats.item5.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
        {props.participantStats.stats.item6 ? 
          <Tippy theme={'itemtippy'} touch={false} content={<ContentForTooltip itemName={props.participantStats.stats.item6.name} image={props.participantStats.stats.item6.image} gold={props.participantStats.stats.item6.gold} description={props.participantStats.stats.item6.description}></ContentForTooltip>}>
            <img className="matchdetails-item-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.participantStats.stats.item6.image}`} alt={`${props.participantStats.stats.item6.name}`}/>
          </Tippy>:
          <div className="matchdetails-empty-item"></div>}
      </div>
      <div className="matchdetails-gold-container">
        {`${props.participantStats.stats.goldEarned}`}
      </div>
      <div className="matchdetails-keystone-container">
        <img className="matchdetails-row-icon" src={`https://ddragon.leagueoflegends.com/cdn/img/${props.participantStats.stats.perk0.icon}`} alt={`${props.participantStats.stats.perk0.key}`}/>
        <img className="matchdetails-secondary-rune-path-icon" src={`https://ddragon.leagueoflegends.com/cdn/img/${props.participantStats.stats.perkSubStyle.icon}`} alt="keystone"/>
      </div>
      <div className="matchdetails-summonerspells-container">
        <img className="matchdetails-row-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${props.participantStats.spell1Id}`} alt={`${props.participantStats.spell1Id}`}/>&nbsp;
        <img className="matchdetails-row-icon" src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${props.participantStats.spell2Id}`} alt={`${props.participantStats.spell2Id}`}/>
      </div>
    </div>
    </div>
    
  );
}

export default MatchDetailsResultRow;

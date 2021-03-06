import React from 'react';
import './championcard.styles.css';
import {championLowerCaseNameDdragonNamePairs, currentPatch} from '../../miscData.js';

function ChampionCard(props) {
    const {championName} = props;
    return (
        <div className="champion-card">
            <img src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championLowerCaseNameDdragonNamePairs[`${championName.replace(/\s/g, '').toLowerCase()}`]}.png`} alt={championName}/>
            <div className="champion-card-championname">{championName}</div>
        </div>
    );
}

export default ChampionCard;
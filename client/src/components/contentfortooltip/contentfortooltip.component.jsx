import React from 'react';
import './contentfortooltip.styles.css';
import {currentPatch} from '../../miscData';

const ContentForTooltip = (props) => {
    return (
        <div>
            <div className="contentfortooltip-header">
                <div className="contentfortooltip-imageandname"><img src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${props.image}`} alt={`${props.itemName}`}/>
                <span className="contentfortooltip-itemname">{props.itemName}</span>
                </div>

                <span className="contentfortooltip-gold">{props.gold}G</span>
            </div>
            <div className="contentfortooltip-description" dangerouslySetInnerHTML={{__html: props.description}}></div>
        </div>
    )
}

export default ContentForTooltip;
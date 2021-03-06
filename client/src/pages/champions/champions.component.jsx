import React from 'react';
import './champions.styles.css';
import ChampionCard from '../../components/championcard/championcard.component.jsx'
import {championNames} from '../../miscData.js';
import {Link} from 'react-router-dom';


function Champions() {

  return (
    <div className="champions">
      <Link style={{textDecoration: 'none', color: '#eed15f'}} to="/">
        <div className="champions-header"><span className="champions-header-firstletter">C</span>HALLENGER<span className="champions-header-firstletter"> B</span>UILDS</div>
      </Link>  
      
      <div className="champions-container">
        {championNames.map(championName => <Link style={{textDecoration: 'none', color: '#e7effa', marginBottom: '20px'}} to={`/champions/${championName.replace(/\s/g, '').toLowerCase()}`}><ChampionCard championName={championName}/></Link>)}
      </div>
    </div>
    
  );
}

export default Champions;

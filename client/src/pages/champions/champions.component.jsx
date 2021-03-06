import React from 'react';
import './champions.styles.css';
import ChampionCard from '../../components/championcard/championcard.component.jsx'
import {championNames} from '../../miscData.js';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";


function Champions() {

  return (
    <div className="champions">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Champions - Challenger Builds</title>
        <meta name="description" content="Find the best build for the champion you want to play from challenger players." />
        <link rel="canonical" href="https://www.challengerbuilds.net/champions" />
      </Helmet>
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

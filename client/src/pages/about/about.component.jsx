import React from 'react';
import {Link} from 'react-router-dom';
import './about.styles.css';


function About() {

  return (
    <div className="about">
        <div className="about-container">
            <div className="about-header">ABOUT <Link style={{textDecoration: 'none', color: '#eed15f'}} to="/">CHALLENGER BUILDS</Link></div>
            <div className="about-content">Hello, I am Karahan Güner and I created Challenger Builds as a passion project in February of 2021. I wanted to create a website where players could get the best builds from challenger players. I automated a system that gets the challenger players across servers, their match history and their match data. This automated process happens once a day and keeps the data on this website always up to date. Only last 50 matches of players are fetched, making it impossible to serve outdated match data.</div>
            <div className="about-content">Challenger Builds isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</div>
            <div className="about-contact"><span className="about-contact-header">For Contact:</span> challengerbuildsnet@gmail.com</div>
        </div>
        
    </div>
    
  );
}

export default About;

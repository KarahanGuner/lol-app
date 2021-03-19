import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import './about.styles.css';


function About() {

  return (
    <div className="about">
        <Helmet>
          <meta charSet="utf-8" />
          <title>About - Challenger Builds</title>
          <meta name="description" content="Hello, I am Karahan Guner and I created Challenger Builds as a passion project in February of 2021. I wanted to create a website where players could get the best builds from challenger players. I automated a system that gets the challenger players across servers, their match history and their match data." />
          <link rel="canonical" href="https://www.challengerbuilds.net/about" />
        </Helmet>
        <div className="about-container">
            <div className="about-header">ABOUT <Link style={{textDecoration: 'none', color: '#eed15f'}} to="/">CHALLENGER BUILDS</Link></div>
            <div className="about-content">Hello, I am Karahan Guner and I created Challenger Builds as a passion project in February of 2021. I wanted to create a website where players could get the best builds from challenger players. I automated a system that gets the challenger players across servers, their match history and their match data. This automated process happens once a day and keeps the data on this app always up to date. Only last 50 matches of players are fetched, making it impossible to serve outdated match data.</div>
            <div className="about-content">Challenger Builds isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</div>
            <div className="about-contact"><span className="about-contact-header">For Contact:</span> challengerbuildsnet@gmail.com</div>
        </div>
        
    </div>
    
  );
}

export default About;

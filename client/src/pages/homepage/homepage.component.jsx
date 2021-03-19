import React from 'react';
import './homepage.styles.css';
import {Link} from 'react-router-dom';
import Search from '../../components/search/search.component.jsx'


function Homepage() {

  return (
    <div className="homepage">
      <div className="homepage-header"><Link style={{textDecoration: 'none', color: '#eed15f', marginRight: '3vw'}} to="/champions"><span>Champions</span></Link><Link style={{textDecoration: 'none', color: '#eed15f', marginRight: '3vw'}} to="/about"><span>About</span></Link></div>
      <div className="search">
        <Search/>
      </div>
      <div className="homepage-text">
        <div className="homepage-text-header">
          <span className="homepage-text-header-firstletter">C</span>HALLENGER <span className="homepage-text-header-firstletter">B</span>UILDS
        </div>
        <div className="homepage-text-content">
          Challenger Builds helps League of Legends players build the best items for their champions. It looks at the matches of hundreds of different challenger players across servers and finds the best builds.
        </div>
      </div>
    </div>
    
  );
}

export default Homepage;

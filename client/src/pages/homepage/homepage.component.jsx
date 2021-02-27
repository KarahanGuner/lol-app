import React from 'react';
import './homepage.styles.css';
import Search from '../../components/search/search.component.jsx'


function Homepage() {

  return (
    <div className="homepage">
      <div className="search">
        <Search/>
      </div>
      <div className="homepage-text">
        <div className="homepage-text-header">
          <span className="homepage-text-header-firstletter">C</span>HALLENGER <span className="homepage-text-header-firstletter">B</span>UILDS
        </div>
        <div className="homepage-text-content">
          Challenger Builds helps players build the best items for their champions. It looks at the matches of hundreds of different challenger players across servers and finds the best builds.
        </div>
      </div>
    </div>
    
  );
}

export default Homepage;

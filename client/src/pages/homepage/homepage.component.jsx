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
          THIS WEBSITE IS UNDER CONSTRUCTION.
        </div>
        <div className="homepage-text-content">
          DATA HAS BEEN FETCHED ONLY FOR THE CHAMPION "OLAF".
        </div>
      </div>
    </div>
    
  );
}

export default Homepage;

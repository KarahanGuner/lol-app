import React from 'react';
import './homepage.styles.css';
import Search from '../../components/search/search.component.jsx'


function Homepage() {

  return (
    <div className="homepage">
      <div className="search">
        <Search/>
      </div>
    </div>
    
  );
}

export default Homepage;

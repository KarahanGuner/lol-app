import React from 'react';
import './matchdetailsheader.styles.css';

function MatchDetailsHeader() {
  return (
    <div className="matchdetails-header-container">
    <div className="matchdetails-header">
      <div className="matchdetails-header-challenger-container">
        Challenger
      </div>
      <div className="matchdetails-header-score-container">
        Score
      </div>
      <div className="matchdetails-header-level-container">
        Level
      </div>
      <div className="matchdetails-header-items-container">
        Final Build
      </div>
      <div className="matchdetails-header-gold-container">
        Gold
      </div>
    </div>
    </div>
    
  );
}

export default MatchDetailsHeader;

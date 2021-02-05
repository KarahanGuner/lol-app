import React from 'react';
import './resultrowheader.styles.css';

function ResultRowHeader() {
  return (
    <div className="resultrow-header-container">
    <div className="resultrow-header">
      <div className="resultrow-header-challenger-container">
        Challenger
      </div>
      <div className="resultrow-header-versus-container">
        vs
      </div>
      <div className="resultrow-header-score-container">
        Score
      </div>
      <div className="resultrow-header-level-container">
        Level
      </div>
      <div className="resultrow-header-items-container">
        Final Build
      </div>
      <div className="resultrow-header-gold-container">
        Gold
      </div>
    </div>
    </div>
    
  );
}

export default ResultRowHeader;

import React from 'react';
import './championdetailsbottom.styles.css';
import ResultRow from  '../resultrow/resultrow.component';

function ChampionDetailsBottom() {

  return (
    <div className="championdetailsbottom">
      <div className="results-container">
        <div className="header">
          <div className="challenger-header">
            Challenger
          </div>
          <div className="vs-header">
            vs
          </div>
          <div className="score-header">
            Score
          </div>
          <div className="level-header">
            Level
          </div>
          <div className="finalbuild-header">
            Final&nbsp;Build
          </div>
          <div className="gold-header">
            Gold
          </div>
        </div>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
        <ResultRow/>
      </div>
      
    </div>
  );
}

export default ChampionDetailsBottom;

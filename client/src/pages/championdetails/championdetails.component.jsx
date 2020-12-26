import React from 'react';
import ChampionDetailsTop from '../../components/championdetailstop/championdetailstop.component';
import ChampionDetailsBottom from '../../components/championdetailsbottom/championdetailsbottom.component';
import {useParams} from 'react-router-dom';
import './championdetails.styles.css';


function ChampionDetails() {
    const {champion} = useParams();

  return (
    <div className="championdetails">
      <ChampionDetailsTop/>
      <ChampionDetailsBottom/>
    </div>
    
  );
}

export default ChampionDetails;

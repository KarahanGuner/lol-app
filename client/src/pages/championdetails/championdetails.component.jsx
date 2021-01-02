import React, {useState, useEffect} from 'react';
import ChampionDetailsTop from '../../components/championdetailstop/championdetailstop.component';
import ChampionDetailsBottom from '../../components/championdetailsbottom/championdetailsbottom.component';
import {useParams} from 'react-router-dom';
import './championdetails.styles.css';
import axios from 'axios';
import {championNameKeyPairs, championLowerCaseNameJsonNamePairs} from '../../miscData.js';

function ChampionDetails() {
  var {champion} = useParams();
  champion = (champion.replace(/\s/g, '')).toLowerCase();//i want people to be able to enter the champion name into the address bar and immediately get the champion they want. i want both "master yi" and "masteryi" to work. in the miscData file there are two objects. we take the value from useParams() and change it to a lowercase no space in between version of itself and find the champions key id from "championNameKeyPairs" object. we use "championLowerCaseNameJsonNamePairs" object to find how a champion is named in the champion.json file. we need to do this to access the information in the ddragon files.
  const championKey = championNameKeyPairs[champion];
  const championJsonName = championLowerCaseNameJsonNamePairs[champion];//need this version of the champ name to read data from champion.json file
  useEffect(() => {
    console.log(championKey)
    axios({
      url: `/championapi/${championKey}`,
      method: 'get',
    }).then(response => console.log(response));
    
  }, [championKey]);
  
  const getChampionDetails = () => {
    axios({
      url: `/championapi/${champion}`,
      method: 'get',
    }).then(response => console.log(response));
  }

  return (
    <div className="championdetails">
      <button onClick={getChampionDetails}>Get Champion Details</button>
      <ChampionDetailsTop/>
      <ChampionDetailsBottom/>
    </div>
    
  );
}

export default ChampionDetails;

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './matchdetails.styles.css';
import axios from 'axios';
import {championNameKeyPairs, championLowerCaseNameDdragonNamePairs} from '../../miscData.js';

function MatchDetails() {
  var {champion, server, gameid} = useParams();

  champion = (champion.replace(/\s/g, '')).toLowerCase();//i want people to be able to enter the champion name into the address bar and immediately get the champion they want. i want both "master yi" and "masteryi" to work. in the miscData file there are two objects. we take the value from useParams() and change it to a lowercase no space in between version of itself and find the champions key id from "championNameKeyPairs" object. we use "championLowerCaseNameDdragonNamePairs" object to find how a champion is named in the champion.json file. we need to do this to access the information in the ddragon files.
  const championKey = championNameKeyPairs[champion];
  const championDdragonName = championLowerCaseNameDdragonNamePairs[champion];//need this version of the champ name to read data from champion.json file
  
  useEffect(() => {
    axios({
      url: `/matchapi/${server}/${gameid}/${championKey}`,
      method: 'get',
    }).then(response => console.log(response));
  }, [championKey]);
  

  return (
    <div className="matchdetails">
        THIS IS MATCH DETAILS PAGE
    </div>
    
  );
}

export default MatchDetails;
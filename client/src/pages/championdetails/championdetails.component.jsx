import React, {useState, useEffect} from 'react';
import ChampionDetailsTop from '../../components/championdetailstop/championdetailstop.component';
import ChampionDetailsBottom from '../../components/championdetailsbottom/championdetailsbottom.component';
import {useParams} from 'react-router-dom';
import './championdetails.styles.css';
import axios from 'axios';
import {championNameKeyPairs, championLowerCaseNameDdragonNamePairs} from '../../miscData.js';

function ChampionDetails() {
  var {champion} = useParams();
  const [matches, updateMatches] = useState([]);
  console.log(matches);
  champion = (champion.replace(/\s/g, '')).toLowerCase();//i want people to be able to enter the champion name into the address bar and immediately get the champion they want. i want both "master yi" and "masteryi" to work. in the miscData file there are two objects. we take the value from useParams() and change it to a lowercase no space in between version of itself and find the champions key id from "championNameKeyPairs" object. we use "championLowerCaseNameDdragonNamePairs" object to find how a champion is named in the champion.json file. we need to do this to access the information in the ddragon files.
  const championKey = championNameKeyPairs[champion];
  const championDdragonName = championLowerCaseNameDdragonNamePairs[champion];//need this version of the champ name to read data from champion.json file
  
  useEffect(() => {
    axios({
      url: `/championapi/${championKey}`,
      method: 'get',
    }).then(response => {
      response.data.forEach(match =>{
        let enemyName;
        for(let _champion in championNameKeyPairs){
          if(championNameKeyPairs[_champion] == match.versus){
            enemyName = _champion;
            break;
          }
        }
        enemyName = championLowerCaseNameDdragonNamePairs[enemyName];
        match.versus = enemyName;
      });
      response.data.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
      updateMatches(response.data);
    });
  }, [championKey]);
  

  return (
    <div className="championdetails">
      <ChampionDetailsTop championDdragonName={championDdragonName} numberOfGames={matches.length} championNameForHeader={champion}/>
      <ChampionDetailsBottom championDdragonName={championDdragonName} matches={matches}/>
    </div>
    
  );
}

export default ChampionDetails;

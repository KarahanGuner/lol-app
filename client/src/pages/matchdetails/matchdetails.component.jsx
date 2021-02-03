import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './matchdetails.styles.css';
import axios from 'axios';
import {championNameKeyPairs, championLowerCaseNameDdragonNamePairs} from '../../miscData.js';
import MatchDetailsResultRow from '../../components/matchdetailsresultrow/matchdetailsresultrow.component';

function MatchDetails() {
  var {champion, server, gameid} = useParams();
  const [matchDetails, changeMatchDetails] = useState();
  champion = (champion.replace(/\s/g, '')).toLowerCase();//i want people to be able to enter the champion name into the address bar and immediately get the champion they want. i want both "master yi" and "masteryi" to work. in the miscData file there are two objects. we take the value from useParams() and change it to a lowercase no space in between version of itself and find the champions key id from "championNameKeyPairs" object. we use "championLowerCaseNameDdragonNamePairs" object to find how a champion is named in the champion.json file. we need to do this to access the information in the ddragon files.
  const championKey = championNameKeyPairs[champion];
  const championDdragonName = championLowerCaseNameDdragonNamePairs[champion];//need this version of the champ name to read data from champion.json file
  useEffect(() => {
    axios({
      url: `/matchapi/${server}/${gameid}/${championKey}`,
      method: 'get',
    }).then(response => {
        console.log(response);
        response.data[0].participants.forEach(participant => {
          let playerChampionName;
          for(let _champion in championNameKeyPairs){
            if(championNameKeyPairs[_champion] == participant.championId){
              playerChampionName = _champion;
              break;
            }
          }
          playerChampionName = championLowerCaseNameDdragonNamePairs[playerChampionName];
          participant.championName = playerChampionName;
        });
        changeMatchDetails(response.data)
      });
  }, [championKey]);
  

  return (
    <div className="matchdetails">
      <div className="matchdetails-container">
        <div className="matchdetails-scoreboard-container">
          BLUE TEAM WON
          {matchDetails ? matchDetails[0].participants.slice(0, 5).map((participant, i) => <MatchDetailsResultRow participantStats={participant} participantIdentity={matchDetails[0].participantIdentities[i].player.summonerName}/>): null}
          RED TEAM LOST
          {matchDetails ? matchDetails[0].participants.slice(5, 10).map((participant, i) => <MatchDetailsResultRow participantStats={participant} participantIdentity={matchDetails[0].participantIdentities[i+5].player.summonerName}/>): null}
        </div>
      </div>
    </div>
    
  );
}

export default MatchDetails;

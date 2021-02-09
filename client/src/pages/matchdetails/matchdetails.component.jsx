import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './matchdetails.styles.css';
import axios from 'axios';
import {championNameKeyPairs, championLowerCaseNameDdragonNamePairs, currentPatch} from '../../miscData.js';
import MatchDetailsResultRow from '../../components/matchdetailsresultrow/matchdetailsresultrow.component';
import MatchDetailsHeader from '../../components/matchdetailsheader/matchdetailsheader.component';

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
        //get rid of undos
        for(let i = 0; i < response.data[1].itemBuyingAndSelling.length; i++){
          if(response.data[1].itemBuyingAndSelling[i].type === "ITEM_UNDO"){
            response.data[1].itemBuyingAndSelling.splice(i-1, 2);
            i = i -2;
          }
        }
        //put same minute purchases into brackets array position represents minutes in game
        response.data[2] = []
        response.data[1].itemBuyingAndSelling.forEach(transaction => {
          let transactionTime = Math.floor(transaction.timestamp/60000);
          if(!(response.data[2][transactionTime])){
            response.data[2][transactionTime] =[];
          }
          response.data[2][transactionTime].push(transaction);
        });
        changeMatchDetails(response.data)
      });
  }, [championKey]);
  

  return (
    <div className="matchdetails">
      {matchDetails ?  
      <div className="matchdetails-container">
        <div className="matchdetails-scoreboard-container">
          <div className="matchdetails-scoreboard-blueteam"><div><span style={{color: '#acc2ff', fontSize: '20px'}}>BLUE TEAM</span> - {matchDetails[0].teams.win === "Win" ? `VICTORY` : `DEFEAT`}</div><div className="matchdetails-banned-champions">Bans:&nbsp;{matchDetails[0].teams[0].bans.map((bannedChampion, i) => {
            for(let _champion in championNameKeyPairs){
              if(championNameKeyPairs[_champion] == bannedChampion.championId){
                return <img key={`banned${i}`} src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championLowerCaseNameDdragonNamePairs[_champion]}.png`} alt="champion"/>;
              }
            }
          })}</div></div>
          <MatchDetailsHeader></MatchDetailsHeader>
          {matchDetails[0].participants.slice(0, 5).map((participant, i) => <MatchDetailsResultRow key={i} participantStats={participant} chosenParticipantKey={championKey} participantIdentity={matchDetails[0].participantIdentities[i].player.summonerName}/>)}
          <div className="matchdetails-scoreboard-redteam"><div><span style={{color: '#f85151', fontSize: '20px'}}>RED TEAM</span> - {matchDetails[0].teams.win === "Win" ? `DEFEAT` : `VICTORY`}</div><div className="matchdetails-banned-champions">Bans:&nbsp;{matchDetails[0].teams[1].bans.map((bannedChampion, i) => {
            for(let _champion in championNameKeyPairs){
              if(championNameKeyPairs[_champion] == bannedChampion.championId){
                return <img key={`banned${i+5}`} src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${championLowerCaseNameDdragonNamePairs[_champion]}.png`} alt="champion"/>;
              }
            }
          })}</div></div>
          <MatchDetailsHeader></MatchDetailsHeader>
          {matchDetails[0].participants.slice(5, 10).map((participant, i) => <MatchDetailsResultRow key={i+5} participantStats={participant} chosenParticipantKey={championKey} participantIdentity={matchDetails[0].participantIdentities[i+5].player.summonerName}/>)}
          <div className="matchdetails-scoreboard-gameduration">Game Duration: {`${Math.floor(matchDetails[0].gameDuration/60)} Minutes`}</div>
        </div>
        <div className="matchdetails-timeline-container">
          <div className="matchdetails-timeline-header">Timeline</div>
          <div className="matchdetails-timeline-items">
            {matchDetails[2].map((itemsInAMinute, i) => {
              return <div className="matchdetails-timeline-itemsinaminute-witharrow" key={`timelineitemsInAMinute${i}`}><div  className="matchdetails-timeline-itemsinaminute"><div className="matchdetails-timeline-itemsinaminute-item-container">
              {itemsInAMinute.map((item, j) => {
              return <div key={`timelineitem${i}${j}`} ><img src={`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${item.itemId}.png`} alt="item"/>{item.type === "ITEM_SOLD" ? <i className="matchdetails-timeline-cross"></i> :null}</div>
              })}
              </div><div className="matchdetails-timeline-itemsinaminute-minute">{`${i} min`}</div></div>{i == matchDetails[2].length-1 ? null :<i className="matchdetails-arrow-right"></i>}</div>})
            }
          </div>
        </div>
        <div className="matchdetails-abilityorder-container">
          <div className="matchdetails-abilityorder-header">Ability Order</div>
          <div className="matchdetails-abilityorder-content">
            <table className="matchdetails-abilityorder-table">
              <tbody>
              <tr>
                <th>Q</th>
                {matchDetails[1].skillOrder.map((levelUp, i) => {
                  if(levelUp.skillSlot == 1) {
                    return <td key={`Q${i}`} className="matchdetails-abilityorder-table-chosendata">{`${i+1}`}</td>
                  } 
                  return <td key={`Q${i}E`}></td>
                })}
              </tr>
              <tr>
                <th>W</th>
                {matchDetails[1].skillOrder.map((levelUp, i) => {
                  if(levelUp.skillSlot == 2) {
                    return <td key={`W${i}`} className="matchdetails-abilityorder-table-chosendata">{`${i+1}`}</td>
                  } 
                  return <td key={`W${i}E`}></td>
                })}
              </tr>
              <tr>
                <th>E</th>
                {matchDetails[1].skillOrder.map((levelUp, i) => {
                  if(levelUp.skillSlot == 3) {
                    return <td key={`E${i}`} className="matchdetails-abilityorder-table-chosendata">{`${i+1}`}</td>
                  } 
                  return <td key={`E${i}E`}></td>
                })}
              </tr>
              <tr>
                <th>R</th>
                {matchDetails[1].skillOrder.map((levelUp, i) => {
                  if(levelUp.skillSlot == 4) {
                    return <td key={`R${i}`} className="matchdetails-abilityorder-table-chosendata">{`${i+1}`}</td>
                  } 
                  return <td key={`R${i}E`}></td>
                })}
              </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>:
      <div>LOADING</div>}
     
    </div>
    
  );
}

export default MatchDetails;

const express = require('express');
const fs = require("fs");
const fse = require('fs-extra');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
var CronJob = require('cron').CronJob;
//are you gonna use compression??
//are you gonna use express-sslify?
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const amountOfPlayersFromEachServer = 15; //we look at the last 50 matches
//middlewares
app.use(bodyParser.json());//parse json
app.use(bodyParser.urlencoded({extended: true}));//parse strings arrays and if extended is true parse nested objects
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/test1', function(req, res){
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json')));
    var matchListForEachChampionNA1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionNA1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListNA1[i].summonerName;
        for(let j = 0; j < 50; j++){
            if(!(matchListForEachChampionNA1[matchListNA1[i].matches[j].champion])){
                matchListForEachChampionNA1[matchListNA1[i].matches[j].champion] = [];
            };
            matchListForEachChampionNA1[matchListNA1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListNA1[i].matches[j].gameId, server: "NA1"});
             
        }
    }
    //console.log(matchListForEachChampionNA1);
    matchListForEachChampionNA1 = matchListForEachChampionNA1.slice(0,5);
    Promise.all(matchListForEachChampionNA1.map(function(champion){
        return Promise.all(champion.map(function(match){
          return fetch(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json());
        }));
    })).then(function(data) {
        console.log(data);
    });
});

app.get('/championapi/:championkey', function(req, res){ //is gonna return 10 "getMatch" jsons
    const championKey = req.params.championkey;
    const matchListEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, `data/champions/${championKey}`, 'matchlisteuw1.json')));
    const matchListKR = JSON.parse(fs.readFileSync(path.join(__dirname, `data/champions/${championKey}`, 'matchlistkr.json')));
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, `data/champions/${championKey}`, 'matchlistna1.json')));
    var matchList = [];
    //push matches into a comman array one by one
    for(let i = 0; i < Math.max(matchListEUW1.length, matchListKR.length, matchListNA1.length); i++){
        if(matchListEUW1[i]){
            matchList.push(matchListEUW1[i])
        }
        if(matchListKR[i]){
            matchList.push(matchListKR[i])
        }
        if(matchListNA1[i]){
            matchList.push(matchListNA1[i])
        }
    }
    res.status(200).send(matchList)
});


app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//getting challenger lists
var getChallengerListEUW1Job = new CronJob('47 23 * * 0', function() {
    console.log('Getting Challenger Lists for EUW1');
    //EUW1
    fetch(`https://euw1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummonerideuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListKRJob = new CronJob('48 23 * * 0', function() {
    console.log('Getting Challenger Lists for KR');
    //KR
    fetch(`https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListNA1Job = new CronJob('49 23 * * 0', function() {
    console.log('Getting Challenger Lists for NA1');
    //NA1
    fetch(`https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridna1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
getChallengerListEUW1Job.start();
getChallengerListKRJob.start();
getChallengerListNA1Job.start();

//getting accountid from summonerid
var getAccountIDFromSummonerIDEUW1Job = new CronJob('50 23 * * 0', function() {
    console.log('Getting Account IDs from Summoner IDS for EUW1');
    //EUW1
    const dataEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengerssummonerideuw1.json')));
    const summonerIDsEUW1 = dataEUW1.entries.slice(0, amountOfPlayersFromEachServer);
    Promise.all(summonerIDsEUW1.map(summonerIDEUW1 => (
        fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${summonerIDEUW1.summonerId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({accountID: data.accountId, summonerName: data.name})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountideuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getAccountIDFromSummonerIDKRJob = new CronJob('51 23 * * 0', function() {
    console.log('Getting Account IDs from Summoner IDS for KR');
    //KR
    const dataKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridkr.json')));
    const summonerIDsKR = dataKR.entries.slice(0, amountOfPlayersFromEachServer);
    Promise.all(summonerIDsKR.map(summonerIDKR => (
        fetch(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/${summonerIDKR.summonerId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({accountID: data.accountId, summonerName: data.name})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getAccountIDFromSummonerIDNA1Job = new CronJob('52 23 * * 0', function() {
    console.log('Getting Account IDs from Summoner IDS for NA1');
    //NA1
    const dataNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridna1.json')));
    const summonerIDsNA1 = dataNA1.entries.slice(0, amountOfPlayersFromEachServer);
    Promise.all(summonerIDsNA1.map(summonerIDNA1 => (
        fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${summonerIDNA1.summonerId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({accountID: data.accountId, summonerName: data.name})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidna1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
getAccountIDFromSummonerIDEUW1Job.start();
getAccountIDFromSummonerIDKRJob.start();
getAccountIDFromSummonerIDNA1Job.start();

//getting match list from account id
var getMatchListFromAccountIDEUW1Job = new CronJob('53 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for EUW1');
    //EUW1
    const accountIDsEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountideuw1.json')));
    Promise.all(accountIDsEUW1.map(accountIDEUW1 => (
        fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDEUW1.accountID}?queue=420&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDEUW1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDKRJob = new CronJob('54 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for KR');
    //KR
    const accountIDsKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidkr.json')));
    Promise.all(accountIDsKR.map(accountIDKR => (
        fetch(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDKR.accountID}?queue=420&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDKR.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDNA1Job = new CronJob('55 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for NA1');
    //NA1
    const accountIDsNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidna1.json')));
    Promise.all(accountIDsNA1.map(accountIDNA1 => (
        fetch(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDNA1.accountID}?queue=420&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDNA1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
getMatchListFromAccountIDEUW1Job.start();
getMatchListFromAccountIDKRJob.start();
getMatchListFromAccountIDNA1Job.start();

//creating match lists for each champion
var createMatchListForEachChampionEUW1Job = new CronJob('56 23 * * 0', function() {
    console.log('Creating match lists for each champion for EUW1');
    const matchListEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json')));
    var matchListForEachChampionEUW1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionEUW1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListEUW1[i].summonerName;
        for(let j = 0; j < 50; j++){
            if(!(matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion])){
                matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion] = [];
            };
            matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListEUW1[i].matches[j].gameId, server: "EUW1"});
             
        }
    }
    //putting data from matchListForEachChampionEUW1 to json files
    for(let i = 0; i < matchListForEachChampionEUW1.length; i++){
        if(matchListForEachChampionEUW1[i]){
            fse.outputFile(path.join(__dirname, `data/champions/${i}`, 'matchlisteuw1.json'), JSON.stringify(matchListForEachChampionEUW1[i]), err => {
                if(err) {
                  console.log(err);
                } else {
                  console.log('The file was saved!');
                }
            });
        }
    }
}, null, false, 'America/Los_Angeles');
var createMatchListForEachChampionKRJob = new CronJob('57 23 * * 0', function() {
    console.log('Creating match lists for each champion for KR');
    const matchListKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json')));
    var matchListForEachChampionKR = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionKR
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListKR[i].summonerName;
        for(let j = 0; j < 50; j++){
            if(!(matchListForEachChampionKR[matchListKR[i].matches[j].champion])){
                matchListForEachChampionKR[matchListKR[i].matches[j].champion] = [];
            };
            matchListForEachChampionKR[matchListKR[i].matches[j].champion].push({summonerName: playerName, gameId:matchListKR[i].matches[j].gameId, server: "KR"});
             
        }
    }
    //putting data from matchListForEachChampionKR to json files
    for(let i = 0; i < matchListForEachChampionKR.length; i++){
        if(matchListForEachChampionKR[i]){
            fse.outputFile(path.join(__dirname, `data/champions/${i}`, 'matchlistkr.json'), JSON.stringify(matchListForEachChampionKR[i]), err => {
                if(err) {
                  console.log(err);
                } else {
                  console.log('The file was saved!');
                }
            });
        }
    }
}, null, false, 'America/Los_Angeles');
var createMatchListForEachChampionNA1Job = new CronJob('58 23 * * 0', function() {
    console.log('Creating match lists for each champion for NA1');
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json')));
    var matchListForEachChampionNA1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionNA1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListNA1[i].summonerName;
        for(let j = 0; j < 50; j++){
            if(!(matchListForEachChampionNA1[matchListNA1[i].matches[j].champion])){
                matchListForEachChampionNA1[matchListNA1[i].matches[j].champion] = [];
            };
            matchListForEachChampionNA1[matchListNA1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListNA1[i].matches[j].gameId, server: "NA1"});
             
        }
    }
    //putting data from matchListForEachChampionNA1 to json files
    for(let i = 0; i < matchListForEachChampionNA1.length; i++){
        if(matchListForEachChampionNA1[i]){
            fse.outputFile(path.join(__dirname, `data/champions/${i}`, 'matchlistna1.json'), JSON.stringify(matchListForEachChampionNA1[i]), err => {
                if(err) {
                  console.log(err);
                } else {
                  console.log('The file was saved!');
                }
            });
        }
    }
}, null, false, 'America/Los_Angeles');
createMatchListForEachChampionEUW1Job.start();
createMatchListForEachChampionKRJob.start();
createMatchListForEachChampionNA1Job.start();


app.listen(PORT, error => {
    if(error) throw error;
    console.log('Server running on port ' + PORT);
});
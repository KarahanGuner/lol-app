const express = require('express');
const fs = require("fs");
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
const amountOfPlayersFromEachServer = 15;
//middlewares
app.use(bodyParser.json());//parse json
app.use(bodyParser.urlencoded({extended: true}));//parse strings arrays and if extended is true parse nested objects
app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/championapi/:championkey', function(req, res){ //is gonna return 10 "getMatch" jsons
    const championKey = req.params.championkey;
    const matchListEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json')));
    const matchListKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json')));
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json')));
    var matchList = [];
    for(let i = 0; i < amountOfPlayersFromEachServer; i++){
        let player = matchListEUW1[i].matches
    }


    res.status(200).send('youve hit championapi/' + championkey)
    
});

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//getting challenger lists
var getChallengerListEUW1Job = new CronJob('50 23 * * 0', function() {
    console.log('Getting Challenger Lists for EUW1');
    //EUW1
    fetch(`https://euw1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummonerideuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListKRJob = new CronJob('51 23 * * 0', function() {
    console.log('Getting Challenger Lists for KR');
    //KR
    fetch(`https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListNA1Job = new CronJob('52 23 * * 0', function() {
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
var getAccountIDFromSummonerIDEUW1Job = new CronJob('53 23 * * 0', function() {
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
var getAccountIDFromSummonerIDKRJob = new CronJob('54 23 * * 0', function() {
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
var getAccountIDFromSummonerIDNA1Job = new CronJob('55 23 * * 0', function() {
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
var getMatchListFromAccountIDEUW1Job = new CronJob('56 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for EUW1');
    //EUW1
    const accountIDsEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountideuw1.json')));
    Promise.all(accountIDsEUW1.map(accountIDEUW1 => (
        fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDEUW1.accountID}?endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDEUW1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDKRJob = new CronJob('57 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for KR');
    //KR
    const accountIDsKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidkr.json')));
    Promise.all(accountIDsKR.map(accountIDKR => (
        fetch(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDKR.accountID}?endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDKR.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDNA1Job = new CronJob('58 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for NA1');
    //NA1
    const accountIDsNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidna1.json')));
    Promise.all(accountIDsNA1.map(accountIDNA1 => (
        fetch(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDNA1.accountID}?endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDNA1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
getMatchListFromAccountIDEUW1Job.start();
getMatchListFromAccountIDKRJob.start();
getMatchListFromAccountIDNA1Job.start();


app.listen(PORT, error => {
    if(error) throw error;
    console.log('Server running on port ' + PORT);
});
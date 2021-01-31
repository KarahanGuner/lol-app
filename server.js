const express = require('express');
const fs = require("fs");
const fse = require('fs-extra');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
var CronJob = require('cron').CronJob;
const util = require('util') 
const championBuckets = require('./data/misc/championBuckets');

//are you gonna use compression??
//are you gonna use express-sslify?
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;
const amountOfPlayersFromEachServer = 15; //we look at the last 50 matches
const beginTime = '1605225600000'; //will get matches starting from this epoch time point
const itemDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'item.json')));
const runesDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'runesReforged.json')));
const summonerSpellsDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'summoner.json')));
const readFileContent = util.promisify(fs.readFile);//makes readFile work as promise instead of callback

//middlewares
app.use(bodyParser.json());//parse json
app.use(bodyParser.urlencoded({extended: true}));//parse strings arrays and if extended is true parse nested objects
app.use(cors()); // will cors stay in production?

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/test1', function(req, res){

});

app.get('/championapi/:championkey', function(req, res){
    console.log('/championapi/:championkey have been hit');
    const championKey = req.params.championkey;
    var matchList = [];
    Promise.all([
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlisteuw1.json')).then(data => JSON.parse(data)).catch(e => console.log(e)),
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlistkr.json')).then(data => JSON.parse(data)).catch(e => console.log(e)),
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlistna1.json')).then(data => JSON.parse(data)).catch(e => console.log(e))]).then(matches => {
            //push matches into a comman array one by one
                for(let i = 0; i < Math.max(matches[0] ? matches[0].length : 0, matches[1] ? matches[1].length : 0, matches[2] ? matches[2].length : 0); i++){
                    if(matches[0] && matches[0][i]){
                        matchList.push(matches[0][i])
                    }
                    if(matches[1] && matches[1][i]){
                        matchList.push(matches[1][i])
                    }
                    if(matches[2] && matches[2][i]){
                        matchList.push(matches[2][i])
                    }
                }
                res.status(200).send(matchList)
        }).catch(e => {res.status(500).send(e);});
});

app.get('/matchapi/:server/:gameid/:championkey', function(req, res){
    const server = req.params.server;
    const gameid = req.params.gameid;
    const championkey = req.params.championkey;
    Promise.all([
        fetch(`https://${server}.api.riotgames.com/lol/match/v4/matches/${gameid}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e)),
        fetch(`https://${server}.api.riotgames.com/lol/match/v4/timelines/by-match/${gameid}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e))
    ]).then(data => {
            for(let i = 0; i < 10; i++){
                //getting info for items and pushing them
                for(let j = 0; j< 7; j++){
                    let itemId = data[0].participants[i].stats[`item${j}`];
                    if(itemId){
                        data[0].participants[i].stats[`item${j}`] = 
                        {
                            name: itemDdragon.data[`${itemId}`].name,
                            description: itemDdragon.data[`${itemId}`].description,
                            image: itemDdragon.data[`${itemId}`].image.full,
                            gold: itemDdragon.data[`${itemId}`].gold.total
                        }
                    }
                }
                //getting info for runes
                data[0].participants[i].stats.perk0 = runesDdragon.find(runeTree => runeTree.id == data[0].participants[i].stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == data[0].participants[i].stats.perk0);
                data[0].participants[i].stats.perkSubStyle = runesDdragon.find(runeTree => runeTree.id == data[0].participants[i].stats.perkSubStyle).icon;
                //getting info for summoner spells
                for (const summonerSpell in summonerSpellsDdragon.data) {
                    if(summonerSpellsDdragon.data[summonerSpell].key == data[0].participants[i].spell1Id){
                        data[0].participants[i].spell1Id = summonerSpellsDdragon.data[summonerSpell].image.full;
                        break;
                    }
                }
                for (const summonerSpell in summonerSpellsDdragon.data) {
                    if(summonerSpellsDdragon.data[summonerSpell].key == data[0].participants[i].spell2Id){
                        data[0].participants[i].spell2Id = summonerSpellsDdragon.data[summonerSpell].image.full;
                        break;
                    }
                }
            }
        res.status(200).send(data);
        }
    ).catch(e => {res.status(500).send(e);});
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
        fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDEUW1.accountID}?queue=420&beginTime=${beginTime}&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDEUW1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDKRJob = new CronJob('54 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for KR');
    //KR
    const accountIDsKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidkr.json')));
    Promise.all(accountIDsKR.map(accountIDKR => (
        fetch(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDKR.accountID}?queue=420&beginTime=${beginTime}&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDKR.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDNA1Job = new CronJob('55 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for NA1');
    //NA1
    const accountIDsNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidna1.json')));
    Promise.all(accountIDsNA1.map(accountIDNA1 => (
        fetch(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDNA1.accountID}?queue=420&beginTime=${beginTime}&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDNA1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
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
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json')));
    var matchListForEachChampionEUW1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionEUW1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListEUW1[i].summonerName;
        if(matchListEUW1[i].matches){
            for(let j = 0; j < matchListEUW1[i].matches.length; j++){
                if(!(matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion])){
                    matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion] = [];
                };
                matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListEUW1[i].matches[j].gameId, server: "EUW1", timestamp: matchListEUW1[i].matches[j].timestamp});
            }
        }
    }
    matchListForEachChampionEUW1 = matchListForEachChampionEUW1.slice(0,3);
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    Promise.all(matchListForEachChampionEUW1.map(function(champion){
        return Promise.all(champion.map(function(match){
            if(match.gameId){
                return fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
            } else {
                return undefined;
            }
          
        }));
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    let ourPlayer = data[i][j].participants.find(participant => participant.championId == i);//finds participant with the correct championId
                    //finding player position
                    let playerPosition = '';
                    let indexInPositionOrder;
                    if(ourPlayer.spell1Id == 11 || ourPlayer.spell2Id == 11) {
                        playerPosition = 'Jungle';
                        indexInPositionOrder = 4;
                    } else {
                        for(let h = 0; h<4; h++){
                            if(championBuckets[h].includes(i)){
                                playerPosition = positionOrder[h];
                                indexInPositionOrder = h;
                                break;
                            }
                        }
                    }
                    //finding versus
                    let versus; //participant object for the versus
                    let enemyTeam; // array of enemy participnts objects
                    if(ourPlayer.participantId < 6) {
                        enemyTeam = data[i][j].participants.slice(5,10);
                    } else {
                        enemyTeam = data[i][j].participants.slice(0,5);
                    }
                    if(playerPosition == 'Jungle'){
                        versus = enemyTeam.find(participant => (participant.spell1Id == 11 || participant.spell2Id == 11));
                    } else {
                        versus = enemyTeam.find(participant => {
                            let enemyPosition = '';
                            for(let h = 0; h<4; h++){
                                if(championBuckets[h].includes(participant.championId)){
                                    enemyPosition = positionOrder[h];
                                    indexInPositionOrder = h;
                                    break;
                                }
                            }
                            return (enemyPosition == playerPosition);
                        })
                    }
                    if(!versus){//if it cant find the versus just pick a random one
                        versus = enemyTeam[2];
                    }
                    //putting versus and matchData into matchListForEachChampionEUW1
                    matchListForEachChampionEUW1[i][j].matchData = ourPlayer;
                    matchListForEachChampionEUW1[i][j].versus = versus.championId;
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionEUW1.length; i++){
            if(matchListForEachChampionEUW1[i]){
                for(let j = 0; j<matchListForEachChampionEUW1[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionEUW1[i][j].matchData.stats[`item${h}`];
                        if(itemId){
                            matchListForEachChampionEUW1[i][j].matchData.stats[`item${h}`] = 
                            {
                                name: itemInfo.data[`${itemId}`].name,
                                description: itemInfo.data[`${itemId}`].description,
                                image: itemInfo.data[`${itemId}`].image.full,
                                gold: itemInfo.data[`${itemId}`].gold.total
                            }
                        }
                    }
                    //getting info for runes
                    matchListForEachChampionEUW1[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionEUW1[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionEUW1[i][j].matchData.stats.perk0);
                    matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle).icon;
                    //getting info for summoner spells
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionEUW1[i][j].matchData.spell1Id){
                            matchListForEachChampionEUW1[i][j].matchData.spell1Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionEUW1[i][j].matchData.spell2Id){
                            matchListForEachChampionEUW1[i][j].matchData.spell2Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    //getting rid of unnecessary info this operation takes approxiamtely 3ms per match and saves 2kb of memory per match
                    ["largestKillingSpree", "largestMultiKill", "killingSprees", "longestTimeSpentLiving", "doubleKills", "tripleKills", "quadraKills", "pentaKills", "unrealKills", "totalDamageDealt", "magicDamageDealt", "physicalDamageDealt", "trueDamageDealt", "largestCriticalStrike", "totalDamageDealtToChampions", "magicDamageDealtToChampions", "physicalDamageDealtToChampions", "trueDamageDealtToChampions", "totalHeal", "totalUnitsHealed", "damageSelfMitigated", "damageDealtToObjectives", "damageDealtToTurrets", "timeCCingOthers", "totalDamageTaken", "magicalDamageTaken", "physicalDamageTaken", "trueDamageTaken", "turretKills", "inhibitorKills", "neutralMinionsKilledTeamJungle", "neutralMinionsKilledEnemyJungle", "totalTimeCrowdControlDealt", "visionWardsBoughtInGame", "sightWardsBoughtInGame", "wardsPlaced", "wardsKilled", "firstBloodKill", "firstBloodAssist", "firstTowerKill", "firstTowerAssist", "firstInhibitorKill", "firstInhibitorAssist", "combatPlayerScore", "objectivePlayerScore", "totalPlayerScore", "totalScoreRank", "playerScore0", "playerScore1", "playerScore2", "playerScore3", "playerScore4", "playerScore5", "playerScore6", "playerScore7", "playerScore8", "playerScore9", "perk0Var1", "perk0Var2", "perk0Var3", "perk1", "perk1Var1", "perk1Var2", "perk1Var3", "perk2", "perk2Var1", "perk2Var2", "perk2Var3", "perk3", "perk3Var1", "perk3Var2", "perk3Var3", "perk4", "perk4Var1", "perk4Var2", "perk4Var3", "perk5", "perk5Var1", "perk5Var2", "perk5Var3", "statPerk0", "statPerk1", "statPerk2"].forEach(el => {delete matchListForEachChampionEUW1[i][j].matchData.stats[el];});
                    delete matchListForEachChampionEUW1[i][j].matchData.timeline;
                }
            }
        }
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
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var createMatchListForEachChampionKRJob = new CronJob('57 23 * * 0', function() {
    console.log('Creating match lists for each champion for KR');
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json')));
    var matchListForEachChampionKR = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionKR
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListKR[i].summonerName;
        if(matchListKR[i].matches){
            for(let j = 0; j < matchListKR[i].matches.length; j++){
                if(!(matchListForEachChampionKR[matchListKR[i].matches[j].champion])){
                    matchListForEachChampionKR[matchListKR[i].matches[j].champion] = [];
                };
                matchListForEachChampionKR[matchListKR[i].matches[j].champion].push({summonerName: playerName, gameId:matchListKR[i].matches[j].gameId, server: "KR", timestamp: matchListKR[i].matches[j].timestamp});
                 
            }
        }
    }
    matchListForEachChampionKR = matchListForEachChampionKR.slice(0,3);
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    Promise.all(matchListForEachChampionKR.map(function(champion){
        return Promise.all(champion.map(function(match){
            if(match.gameId){
                return fetch(`https://kr.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
            } else {
                return undefined;
            }
          
        }));
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    let ourPlayer = data[i][j].participants.find(participant => participant.championId == i);//finds participant with the correct championId
                    //finding player position
                    let playerPosition = '';
                    let indexInPositionOrder;
                    if(ourPlayer.spell1Id == 11 || ourPlayer.spell2Id == 11) {
                        playerPosition = 'Jungle';
                        indexInPositionOrder = 4;
                    } else {
                        for(let h = 0; h<4; h++){
                            if(championBuckets[h].includes(i)){
                                playerPosition = positionOrder[h];
                                indexInPositionOrder = h;
                                break;
                            }
                        }
                    }
                    //finding versus
                    let versus; //participant object for the versus
                    let enemyTeam; // array of enemy participnts objects
                    if(ourPlayer.participantId < 6) {
                        enemyTeam = data[i][j].participants.slice(5,10);
                    } else {
                        enemyTeam = data[i][j].participants.slice(0,5);
                    }
                    if(playerPosition == 'Jungle'){
                        versus = enemyTeam.find(participant => (participant.spell1Id == 11 || participant.spell2Id == 11));
                    } else {
                        versus = enemyTeam.find(participant => {
                            let enemyPosition = '';
                            for(let h = 0; h<4; h++){
                                if(championBuckets[h].includes(participant.championId)){
                                    enemyPosition = positionOrder[h];
                                    indexInPositionOrder = h;
                                    break;
                                }
                            }
                            return (enemyPosition == playerPosition);
                        })
                    }
                    if(!versus){//if it cant find the versus just pick a random one
                        versus = enemyTeam[2];
                    }
                    //putting versus and matchData into matchListForEachChampionKR
                    matchListForEachChampionKR[i][j].matchData = ourPlayer;
                    matchListForEachChampionKR[i][j].versus = versus.championId;
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionKR.length; i++){
            if(matchListForEachChampionKR[i]){
                for(let j = 0; j<matchListForEachChampionKR[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionKR[i][j].matchData.stats[`item${h}`];
                        if(itemId){
                            matchListForEachChampionKR[i][j].matchData.stats[`item${h}`] = 
                            {
                                name: itemInfo.data[`${itemId}`].name,
                                description: itemInfo.data[`${itemId}`].description,
                                image: itemInfo.data[`${itemId}`].image.full,
                                gold: itemInfo.data[`${itemId}`].gold.total
                            }
                        }
                    }
                    //getting info for runes
                    matchListForEachChampionKR[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionKR[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionKR[i][j].matchData.stats.perk0);
                    matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle).icon;
                    //getting info for summoner spells
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionKR[i][j].matchData.spell1Id){
                            matchListForEachChampionKR[i][j].matchData.spell1Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionKR[i][j].matchData.spell2Id){
                            matchListForEachChampionKR[i][j].matchData.spell2Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    //getting rid of unnecessary info this operation takes approxiamtely 3ms per match and saves 2kb of memory per match
                    ["largestKillingSpree", "largestMultiKill", "killingSprees", "longestTimeSpentLiving", "doubleKills", "tripleKills", "quadraKills", "pentaKills", "unrealKills", "totalDamageDealt", "magicDamageDealt", "physicalDamageDealt", "trueDamageDealt", "largestCriticalStrike", "totalDamageDealtToChampions", "magicDamageDealtToChampions", "physicalDamageDealtToChampions", "trueDamageDealtToChampions", "totalHeal", "totalUnitsHealed", "damageSelfMitigated", "damageDealtToObjectives", "damageDealtToTurrets", "timeCCingOthers", "totalDamageTaken", "magicalDamageTaken", "physicalDamageTaken", "trueDamageTaken", "turretKills", "inhibitorKills", "neutralMinionsKilledTeamJungle", "neutralMinionsKilledEnemyJungle", "totalTimeCrowdControlDealt", "visionWardsBoughtInGame", "sightWardsBoughtInGame", "wardsPlaced", "wardsKilled", "firstBloodKill", "firstBloodAssist", "firstTowerKill", "firstTowerAssist", "firstInhibitorKill", "firstInhibitorAssist", "combatPlayerScore", "objectivePlayerScore", "totalPlayerScore", "totalScoreRank", "playerScore0", "playerScore1", "playerScore2", "playerScore3", "playerScore4", "playerScore5", "playerScore6", "playerScore7", "playerScore8", "playerScore9", "perk0Var1", "perk0Var2", "perk0Var3", "perk1", "perk1Var1", "perk1Var2", "perk1Var3", "perk2", "perk2Var1", "perk2Var2", "perk2Var3", "perk3", "perk3Var1", "perk3Var2", "perk3Var3", "perk4", "perk4Var1", "perk4Var2", "perk4Var3", "perk5", "perk5Var1", "perk5Var2", "perk5Var3", "statPerk0", "statPerk1", "statPerk2"].forEach(el => {delete matchListForEachChampionKR[i][j].matchData.stats[el];});
                    delete matchListForEachChampionKR[i][j].matchData.timeline;
                }
            }
        }
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
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var createMatchListForEachChampionNA1Job = new CronJob('58 23 * * 0', function() {
    console.log('Creating match lists for each champion for NA1');
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json')));
    var matchListForEachChampionNA1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionNA1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        let playerName = matchListNA1[i].summonerName;
        if(matchListNA1[i].matches){
            for(let j = 0; j < matchListNA1[i].matches.length; j++){
                if(!(matchListForEachChampionNA1[matchListNA1[i].matches[j].champion])){
                    matchListForEachChampionNA1[matchListNA1[i].matches[j].champion] = [];
                };
                matchListForEachChampionNA1[matchListNA1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListNA1[i].matches[j].gameId, server: "NA1", timestamp: matchListNA1[i].matches[j].timestamp});
            }
        }
    }
    matchListForEachChampionNA1 = matchListForEachChampionNA1.slice(0,5);
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    Promise.all(matchListForEachChampionNA1.map(function(champion){
        return Promise.all(champion.map(function(match){
            if(match.gameId){
                return fetch(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
            } else {
                return undefined;
            }
          
        }));
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    let ourPlayer = data[i][j].participants.find(participant => participant.championId == i);//finds participant with the correct championId
                    //finding player position
                    let playerPosition = '';
                    let indexInPositionOrder;
                    if(ourPlayer.spell1Id == 11 || ourPlayer.spell2Id == 11) {
                        playerPosition = 'Jungle';
                        indexInPositionOrder = 4;
                    } else {
                        for(let h = 0; h<4; h++){
                            if(championBuckets[h].includes(i)){
                                playerPosition = positionOrder[h];
                                indexInPositionOrder = h;
                                break;
                            }
                        }
                    }
                    //finding versus
                    let versus; //participant object for the versus
                    let enemyTeam; // array of enemy participnts objects
                    if(ourPlayer.participantId < 6) {
                        enemyTeam = data[i][j].participants.slice(5,10);
                    } else {
                        enemyTeam = data[i][j].participants.slice(0,5);
                    }
                    if(playerPosition == 'Jungle'){
                        versus = enemyTeam.find(participant => (participant.spell1Id == 11 || participant.spell2Id == 11));
                    } else {
                        versus = enemyTeam.find(participant => {
                            let enemyPosition = '';
                            for(let h = 0; h<4; h++){
                                if(championBuckets[h].includes(participant.championId)){
                                    enemyPosition = positionOrder[h];
                                    indexInPositionOrder = h;
                                    break;
                                }
                            }
                            return (enemyPosition == playerPosition);
                        })
                    }
                    if(!versus){//if it cant find the versus just pick a random one
                        versus = enemyTeam[2];
                    }
                    //putting versus and matchData into matchListForEachChampionNA1
                    matchListForEachChampionNA1[i][j].matchData = ourPlayer;
                    matchListForEachChampionNA1[i][j].versus = versus.championId;
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionNA1.length; i++){
            if(matchListForEachChampionNA1[i]){
                for(let j = 0; j<matchListForEachChampionNA1[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionNA1[i][j].matchData.stats[`item${h}`];
                        if(itemId){
                            matchListForEachChampionNA1[i][j].matchData.stats[`item${h}`] = 
                            {
                                name: itemInfo.data[`${itemId}`].name,
                                description: itemInfo.data[`${itemId}`].description,
                                image: itemInfo.data[`${itemId}`].image.full,
                                gold: itemInfo.data[`${itemId}`].gold.total
                            }
                        }
                    }
                    //getting info for runes
                    matchListForEachChampionNA1[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionNA1[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionNA1[i][j].matchData.stats.perk0);
                    matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle).icon;
                    //getting info for summoner spells
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionNA1[i][j].matchData.spell1Id){
                            matchListForEachChampionNA1[i][j].matchData.spell1Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    for (const summonerSpell in summonerSpellsInfo.data) {
                        if(summonerSpellsInfo.data[summonerSpell].key == matchListForEachChampionNA1[i][j].matchData.spell2Id){
                            matchListForEachChampionNA1[i][j].matchData.spell2Id = summonerSpellsInfo.data[summonerSpell].image.full;
                            break;
                        }
                    }
                    //getting rid of unnecessary info this operation takes approxiamtely 3ms per match and saves 2kb of memory per match
                    ["largestKillingSpree", "largestMultiKill", "killingSprees", "longestTimeSpentLiving", "doubleKills", "tripleKills", "quadraKills", "pentaKills", "unrealKills", "totalDamageDealt", "magicDamageDealt", "physicalDamageDealt", "trueDamageDealt", "largestCriticalStrike", "totalDamageDealtToChampions", "magicDamageDealtToChampions", "physicalDamageDealtToChampions", "trueDamageDealtToChampions", "totalHeal", "totalUnitsHealed", "damageSelfMitigated", "damageDealtToObjectives", "damageDealtToTurrets", "timeCCingOthers", "totalDamageTaken", "magicalDamageTaken", "physicalDamageTaken", "trueDamageTaken", "turretKills", "inhibitorKills", "neutralMinionsKilledTeamJungle", "neutralMinionsKilledEnemyJungle", "totalTimeCrowdControlDealt", "visionWardsBoughtInGame", "sightWardsBoughtInGame", "wardsPlaced", "wardsKilled", "firstBloodKill", "firstBloodAssist", "firstTowerKill", "firstTowerAssist", "firstInhibitorKill", "firstInhibitorAssist", "combatPlayerScore", "objectivePlayerScore", "totalPlayerScore", "totalScoreRank", "playerScore0", "playerScore1", "playerScore2", "playerScore3", "playerScore4", "playerScore5", "playerScore6", "playerScore7", "playerScore8", "playerScore9", "perk0Var1", "perk0Var2", "perk0Var3", "perk1", "perk1Var1", "perk1Var2", "perk1Var3", "perk2", "perk2Var1", "perk2Var2", "perk2Var3", "perk3", "perk3Var1", "perk3Var2", "perk3Var3", "perk4", "perk4Var1", "perk4Var2", "perk4Var3", "perk5", "perk5Var1", "perk5Var2", "perk5Var3", "statPerk0", "statPerk1", "statPerk2"].forEach(el => {delete matchListForEachChampionNA1[i][j].matchData.stats[el];});
                    delete matchListForEachChampionNA1[i][j].matchData.timeline;
                }
            }
        }
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
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
createMatchListForEachChampionEUW1Job.start();
createMatchListForEachChampionKRJob.start();
createMatchListForEachChampionNA1Job.start();


app.listen(PORT, error => {
    if(error) throw error;
    console.log('Server running on port ' + PORT);
});
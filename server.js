const express = require('express');
const fs = require("fs");
const fse = require('fs-extra');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
var CronJob = require('cron').CronJob;
const util = require('util');
const compression = require('compression');
const championBuckets = require('./data/misc/championBuckets');
const rateLimit = require("express-rate-limit");

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const amountOfPlayersFromEachServer = 100; //we look at the last 50 matches
const beginTime = '1605225600000'; //will get matches starting from this epoch time point
const itemDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'item.json')));
const runesDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'runesReforged.json')));
const summonerSpellsDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'summoner.json')));
const statPerksDdragon = JSON.parse(fs.readFileSync(path.join(__dirname, `data/details/en_GB`, 'statperks.json')));
const readFileContent = util.promisify(fs.readFile);//makes readFile work as promise instead of callback


app.set('trust proxy', 1); //needed for express-rate-limit
const apiLimiter = rateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 5
});
//middlewares
app.use(compression());
app.use(bodyParser.json());//parse json
app.use(bodyParser.urlencoded({extended: true}));//parse strings arrays and if extended is true parse nested objects
app.use(cors()); // will cors stay in production?

app.use(express.static(path.join(__dirname, 'client/build')));


app.get('/championapi/:championkey', apiLimiter, function(req, res){
    const championKey = req.params.championkey;
    let matchList = [];
    Promise.all([
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlisteuw1.json')).then(data => JSON.parse(data)).catch(e => console.log(e)),
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlistkr.json')).then(data => JSON.parse(data)).catch(e => console.log(e)),
        readFileContent(path.join(__dirname, `data/champions/${championKey}`, 'matchlistna1.json')).then(data => JSON.parse(data)).catch(e => console.log(e))]).then(matches => {
            if(matches[0]) matchList.push(...matches[0]);
            if(matches[1]) matchList.push(...matches[1]);
            if(matches[2]) matchList.push(...matches[2]);  
            res.status(200).send(matchList)
        }).catch(e => {res.status(500).send(e);});
});


app.get('/matchapi/:server/:gameid/:championkey', apiLimiter, function(req, res){
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
                let foundPerkSubStyle = runesDdragon.find(runeTree => runeTree.id == data[0].participants[i].stats.perkSubStyle);
                data[0].participants[i].stats.perkSubStyle = {id: foundPerkSubStyle.id, name: foundPerkSubStyle.name, icon: foundPerkSubStyle.icon}
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
                //more detailed rune info for the player
                if(data[0].participants[i].championId == championkey){
                    let primaryRuneTree = runesDdragon.find(runeTree => runeTree.id == data[0].participants[i].stats.perkPrimaryStyle);
                    let secondaryRuneTree = runesDdragon.find(runeTree => runeTree.id == data[0].participants[i].stats.perkSubStyle.id);
                    data[0].participants[i].stats.perk1 = primaryRuneTree.slots[1].runes.find(keystone => keystone.id == data[0].participants[i].stats.perk1);
                    data[0].participants[i].stats.perk2 = primaryRuneTree.slots[2].runes.find(keystone => keystone.id == data[0].participants[i].stats.perk2);
                    data[0].participants[i].stats.perk3 = primaryRuneTree.slots[3].runes.find(keystone => keystone.id == data[0].participants[i].stats.perk3);
                    for(let j= 1; j <4; j++){
                        if(secondaryRuneTree.slots[j].runes.find(rune => rune.id == data[0].participants[i].stats.perk4)){
                            data[0].participants[i].stats.perk4 = secondaryRuneTree.slots[j].runes.find(rune => rune.id == data[0].participants[i].stats.perk4);
                        }
                        if(secondaryRuneTree.slots[j].runes.find(rune => rune.id == data[0].participants[i].stats.perk5)){
                            data[0].participants[i].stats.perk5 = secondaryRuneTree.slots[j].runes.find(rune => rune.id == data[0].participants[i].stats.perk5);
                        }
                    }
                    data[0].participants[i].stats.perkPrimaryStyle = {icon: primaryRuneTree.icon, name: primaryRuneTree.name};
                    data[0].participants[i].stats.perkSubStyle = {icon: secondaryRuneTree.icon, name: secondaryRuneTree.name};
                    //getting statperks
                    data[0].participants[i].stats.statPerk0 = statPerksDdragon.find(stat => stat.id == data[0].participants[i].stats.statPerk0);
                    data[0].participants[i].stats.statPerk1 = statPerksDdragon.find(stat => stat.id == data[0].participants[i].stats.statPerk1);
                    data[0].participants[i].stats.statPerk2 = statPerksDdragon.find(stat => stat.id == data[0].participants[i].stats.statPerk2);
                }
            }
            //getting timeline and ability order
            let ourParticipantId = data[0].participants.find(participant => participant.championId == championkey).participantId;
            let skillOrder = [];
            let itemBuyingAndSelling = [];
            for(let i = 0; i < data[1].frames.length; i++) {
                for(let j = 0; j < data[1].frames[i].events.length; j++){
                    if(ourParticipantId == data[1].frames[i].events[j].participantId){
                        if(data[1].frames[i].events[j].type == "SKILL_LEVEL_UP") {
                            skillOrder.push(data[1].frames[i].events[j]);
                        } else if (data[1].frames[i].events[j].type == "ITEM_PURCHASED" || data[1].frames[i].events[j].type == "ITEM_SOLD" || data[1].frames[i].events[j].type == "ITEM_UNDO") {
                            itemBuyingAndSelling.push(data[1].frames[i].events[j]);
                        }
                    }
                }
            }
            data[1] = {skillOrder: skillOrder, itemBuyingAndSelling: itemBuyingAndSelling};
            res.status(200).send(data);
        }
    ).catch(e => {res.status(500).send(e);});
});

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


//getting challenger lists
var getChallengerListEUW1Job = new CronJob('01 23 * * 0', function() {
    console.log('Getting Challenger Lists for EUW1');
    //EUW1
    fetch(`https://euw1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummonerideuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListKRJob = new CronJob('02 23 * * 0', function() {
    console.log('Getting Challenger Lists for KR');
    //KR
    fetch(`https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengerssummoneridkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getChallengerListNA1Job = new CronJob('03 23 * * 0', function() {
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
var getAccountIDFromSummonerIDEUW1Job = new CronJob('04 23 * * 0', function() {
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
var getAccountIDFromSummonerIDKRJob = new CronJob('05 23 * * 0', function() {
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
var getAccountIDFromSummonerIDNA1Job = new CronJob('06 23 * * 0', function() {
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
var getMatchListFromAccountIDEUW1Job = new CronJob('07 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for EUW1');
    //EUW1
    const accountIDsEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountideuw1.json')));
    Promise.all(accountIDsEUW1.map(accountIDEUW1 => (
        fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDEUW1.accountID}?queue=420&beginTime=${beginTime}&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDEUW1.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDKRJob = new CronJob('08 23 * * *', function() {
    console.log('Getting Match List of Challenger Players for KR');
    //KR
    const accountIDsKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersaccountidkr.json')));
    Promise.all(accountIDsKR.map(accountIDKR => (
        fetch(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountIDKR.accountID}?queue=420&beginTime=${beginTime}&endIndex=50&beginIndex=0&api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).then(data => {return ({summonerName:accountIDKR.summonerName, matches:data.matches})}).catch(e => console.log(e))//last .then makes it so that we only take accountId from the response. we could also take id, puuid, name, profileIconId, revisionDate, summonerLevel
    ))).then(data => JSON.stringify(data)).then(stringdata => {
        fs.writeFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json'), stringdata); 
    }).catch(e => console.log(e));
}, null, false, 'America/Los_Angeles');
var getMatchListFromAccountIDNA1Job = new CronJob('09 23 * * *', function() {
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
var createMatchListForEachChampionEUW1Job = new CronJob('12 23 * * *', function() {
    console.log('Creating match lists for each champion for EUW1');
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListEUW1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlisteuw1.json')));
    var matchListForEachChampionEUW1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionEUW1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        if(matchListEUW1[i] && matchListEUW1[i].matches){
            let playerName = matchListEUW1[i].summonerName;
            for(let j = 0; j < matchListEUW1[i].matches.length; j++){
                if(!(matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion])){
                    matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion] = [];
                };
                matchListForEachChampionEUW1[matchListEUW1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListEUW1[i].matches[j].gameId, server: "EUW1", timestamp: matchListEUW1[i].matches[j].timestamp});
            }
        }
    }
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    let championCounter = 0;
    Promise.all(matchListForEachChampionEUW1.map(function(champion){
        if(!champion) {
            return undefined;
        }
        championCounter = championCounter + 1;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(Promise.all(champion.map(function(match){
                if(match.gameId){
                    return fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
                } else {
                    return undefined;
                }
            })));
            }, 3000 * championCounter);
        });
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    if(data[i][j] && data[i][j].participants){
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
        }
        //sometimes api returns 504 instead of the matchdata, we have to get rid of gameId's from matchListForEachChampion for these games. here we are splicing out the gameId's that we could not get matchData for.
        for(let i = 0; i < matchListForEachChampionEUW1.length; i++){
            if(matchListForEachChampionEUW1[i]){
                for(let j = 0; j<matchListForEachChampionEUW1[i].length; j++){
                    if(!matchListForEachChampionEUW1[i][j].matchData){
                        matchListForEachChampionEUW1[i].splice(j, 1);
                        j = j-1;
                    }
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionEUW1.length; i++){
            if(matchListForEachChampionEUW1[i]){
                for(let j = 0; j<matchListForEachChampionEUW1[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionEUW1[i][j].matchData.stats[`item${h}`];
                        if(itemId && itemInfo.data[`${itemId}`]){
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
                    if(matchListForEachChampionEUW1[i][j].matchData.stats.perk0 && matchListForEachChampionEUW1[i][j].matchData.stats.perkPrimaryStyle){
                        matchListForEachChampionEUW1[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionEUW1[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionEUW1[i][j].matchData.stats.perk0);
                    } else {
                        matchListForEachChampionEUW1[i][j].matchData.stats.perk0 = 0;
                    }
                    if(matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle) {
                        matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle).icon;
                    } else {
                        matchListForEachChampionEUW1[i][j].matchData.stats.perkSubStyle = 0;
                    }
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
var createMatchListForEachChampionKRJob = new CronJob('22 23 * * *', function() {
    console.log('Creating match lists for each champion for KR');
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListKR = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistkr.json')));
    var matchListForEachChampionKR = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionKR
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        
        if(matchListKR[i] && matchListKR[i].matches){
            let playerName = matchListKR[i].summonerName;
            for(let j = 0; j < matchListKR[i].matches.length; j++){
                if(!(matchListForEachChampionKR[matchListKR[i].matches[j].champion])){
                    matchListForEachChampionKR[matchListKR[i].matches[j].champion] = [];
                };
                matchListForEachChampionKR[matchListKR[i].matches[j].champion].push({summonerName: playerName, gameId:matchListKR[i].matches[j].gameId, server: "KR", timestamp: matchListKR[i].matches[j].timestamp});
                    
            }
        }
    }
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    let championCounter = 0;
    Promise.all(matchListForEachChampionKR.map(function(champion){
        if(!champion) {
            return undefined;
        }
        championCounter = championCounter + 1;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(Promise.all(champion.map(function(match){
                if(match.gameId){
                    return fetch(`https://kr.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
                } else {
                    return undefined;
                }
            })));
            }, 3000 * championCounter);
        });
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    if(data[i][j] && data[i][j].participants){
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
        }
        //sometimes api returns 504 instead of the matchdata, we have to get rid of gameId's from matchListForEachChampion for these games. here we are splicing out the gameId's that we could not get matchData for.
        for(let i = 0; i < matchListForEachChampionKR.length; i++){
            if(matchListForEachChampionKR[i]){
                for(let j = 0; j<matchListForEachChampionKR[i].length; j++){
                    if(!matchListForEachChampionKR[i][j].matchData){
                        matchListForEachChampionKR[i].splice(j, 1);
                        j = j-1;
                    }
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionKR.length; i++){
            if(matchListForEachChampionKR[i]){
                for(let j = 0; j<matchListForEachChampionKR[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionKR[i][j].matchData.stats[`item${h}`];
                        if(itemId && itemInfo.data[`${itemId}`]){
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
                    if(matchListForEachChampionKR[i][j].matchData.stats.perk0 && matchListForEachChampionKR[i][j].matchData.stats.perkPrimaryStyle){
                        matchListForEachChampionKR[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionKR[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionKR[i][j].matchData.stats.perk0);
                    } else {
                        matchListForEachChampionKR[i][j].matchData.stats.perk0 = 0;
                    }
                    if(matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle) {
                        matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle).icon;
                    } else {
                        matchListForEachChampionKR[i][j].matchData.stats.perkSubStyle = 0;
                    }
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
var createMatchListForEachChampionNA1Job = new CronJob('32 23 * * *', function() {
    console.log('Creating match lists for each champion for NA1');
    const itemInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'item.json')));
    const runeInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'runesReforged.json')));
    const summonerSpellsInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/details/en_GB', 'summoner.json')));
    const matchListNA1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/challengers', 'challengersmatchlistna1.json')));
    var matchListForEachChampionNA1 = []; //index of this array == key value of the chamipon it represents
    //populating matchListForEachChampionNA1
    for(let i = 0; i < amountOfPlayersFromEachServer; i++) {
        
        if(matchListNA1[i] && matchListNA1[i].matches){
            let playerName = matchListNA1[i].summonerName;
            for(let j = 0; j < matchListNA1[i].matches.length; j++){
                if(!(matchListForEachChampionNA1[matchListNA1[i].matches[j].champion])){
                    matchListForEachChampionNA1[matchListNA1[i].matches[j].champion] = [];
                };
                matchListForEachChampionNA1[matchListNA1[i].matches[j].champion].push({summonerName: playerName, gameId:matchListNA1[i].matches[j].gameId, server: "NA1", timestamp: matchListNA1[i].matches[j].timestamp});
            }
        }
    }
    let positionOrder =['Top', 'Mid', 'Bot', 'Support', 'Jungle'];
    let championCounter = 0;
    Promise.all(matchListForEachChampionNA1.map(function(champion){
        if(!champion) {
            return undefined;
        }
        championCounter = championCounter + 1;
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve(Promise.all(champion.map(function(match){
                if(match.gameId){
                    return fetch(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LOL_API_KEY}`).then(response => response.json()).catch(e => console.log(e));
                } else {
                    return undefined;
                }
            })));
            }, 3000* championCounter);
        });
    })).then(function(data) {
        for(let i = 0; i<data.length; i++){
            if(data[i]){
                for(let j = 0; j<data[i].length; j++){
                    if(data[i][j] && data[i][j].participants){
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
        }
        //sometimes api returns 504 instead of the matchdata, we have to get rid of gameId's from matchListForEachChampion for these games. here we are splicing out the gameId's that we could not get matchData for.
        for(let i = 0; i < matchListForEachChampionNA1.length; i++){
            if(matchListForEachChampionNA1[i]){
                for(let j = 0; j<matchListForEachChampionNA1[i].length; j++){
                    if(!matchListForEachChampionNA1[i][j].matchData){
                        matchListForEachChampionNA1[i].splice(j, 1);
                        j = j-1;
                    }
                }
            }
        }
        for(let i = 0; i < matchListForEachChampionNA1.length; i++){
            if(matchListForEachChampionNA1[i]){
                for(let j = 0; j<matchListForEachChampionNA1[i].length; j++){
                    //getting info for items and pushing them
                    for(let h = 0; h< 7; h++){
                        let itemId = matchListForEachChampionNA1[i][j].matchData.stats[`item${h}`];
                        if(itemId && itemInfo.data[`${itemId}`]){
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
                    if(matchListForEachChampionNA1[i][j].matchData.stats.perk0 && matchListForEachChampionNA1[i][j].matchData.stats.perkPrimaryStyle){
                        matchListForEachChampionNA1[i][j].matchData.stats.perk0 = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionNA1[i][j].matchData.stats.perkPrimaryStyle).slots[0].runes.find(keystone => keystone.id == matchListForEachChampionNA1[i][j].matchData.stats.perk0);
                    } else {
                        matchListForEachChampionNA1[i][j].matchData.stats.perk0 = 0;
                    }
                    if(matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle) {
                        matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle = runeInfo.find(runeTree => runeTree.id == matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle).icon;
                    } else {
                        matchListForEachChampionNA1[i][j].matchData.stats.perkSubStyle = 0;
                    }
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
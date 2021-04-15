export const championNames = ['Aatrox','Ahri','Akali','Alistar','Amumu','Anivia','Annie','Aphelios','Ashe', 'Aurelion Sol', 'Azir', 'Bard','Blitzcrank','Brand','Braum','Caitlyn','Camille','Cassiopeia','ChoGath','Corki','Darius','Diana','Dr Mundo','Draven','Ekko','Elise','Evelynn','Ezreal','Fiddlesticks','Fiora','Fizz','Galio','Gangplank','Garen','Gnar','Gragas','Graves','Gwen','Hecarim','Heimerdinger','Illaoi','Irelia','Ivern','Janna','Jarvan IV','Jax','Jayce','Jhin','Jinx','KaiSa','Kalista','Karma','Karthus','Kassadin','Katarina','Kayle','Kayn','Kennen','KhaZix','Kindred','Kled','Kog Maw','LeBlanc','Lee Sin','Leona','Lillia','Lissandra','Lucian','Lulu','Lux','Malphite','Malzahar','Maokai','Master Yi','Miss Fortune','Mordekaiser','Morgana','Nami','Nasus','Nautilus','Neeko','Nidalee','Nocturne','Nunu and Willump','Olaf','Orianna','Ornn','Pantheon','Poppy','Pyke','Qiyana','Quinn','Rakan','Rammus','RekSai','Rell','Renekton','Rengar','Riven','Rumble','Ryze','Samira','Sejuani','Senna','Seraphine','Sett','Shaco','Shen','Shyvana','Singed','Sion','Sivir','Skarner','Sona','Soraka','Swain','Sylas','Syndra','Tahm Kench','Taliyah','Talon','Taric','Teemo','Thresh','Tristana','Trundle','Tryndamere','Twisted Fate','Twitch','Udyr','Urgot','Varus','Vayne','Veigar','VelKoz','Vi', 'Viego', 'Viktor','Vladimir','Volibear','Warwick','Wukong','Xayah','Xerath','Xin Zhao','Yasuo','Yone','Yorick','Yuumi','Zac','Zed','Ziggs','Zilean','Zoe','Zyra'];

export const currentPatch = '11.8.1';

export const championNameKeyPairs = { //probably you wont need string version
     aatrox: 266,
     ahri: 103,
     akali: 84,
     alistar: 12,
     amumu: 32,
     anivia: 34,
     annie: 1,
     aphelios: 523,
     ashe: 22,
     aurelionsol: 136,
     azir: 268,
     bard: 432,
     blitzcrank: 53,
     brand: 63,
     braum: 201,
     caitlyn: 51,
     camille: 164,
     cassiopeia: 69,
     chogath: 31,
     corki: 42,
     darius: 122,
     diana: 131,
     draven: 119,
     drmundo: 36,
     ekko: 245,
     elise: 60,
     evelynn: 28,
     ezreal: 81,
     fiddlesticks: 9,
     fiora: 114,
     fizz: 105,
     galio: 3,
     gangplank: 41,
     garen: 86,
     gnar: 150,
     gragas: 79,
     graves: 104,
     gwen: 887,
     hecarim: 120,
     heimerdinger: 74,
     illaoi: 420,
     irelia: 39,
     ivern: 427,
     janna: 40,
     jarvaniv: 59,
     jax: 24,
     jayce: 126,
     jhin: 202,
     jinx: 222,
     kaisa: 145,
     kalista: 429,
     karma: 43,
     karthus: 30,
     kassadin: 38,
     katarina: 55,
     kayle: 10,
     kayn: 141,
     kennen: 85,
     khazix: 121,
     kindred: 203,
     kled: 240,
     kogmaw: 96,
     leblanc: 7,
     leesin: 64,
     leona: 89,
     lillia: 876,
     lissandra: 127,
     lucian: 236,
     lulu: 117,
     lux: 99,
     malphite: 54,
     malzahar: 90,
     maokai: 57,
     masteryi: 11,
     missfortune: 21,
     wukong: 62,
     mordekaiser: 82,
     morgana: 25,
     nami: 267,
     nasus: 75,
     nautilus: 111,
     neeko: 518,
     nidalee: 76,
     nocturne: 56,
     nunuandwillump: 20,
     olaf: 2,
     orianna: 61,
     ornn: 516,
     pantheon: 80,
     poppy: 78,
     pyke: 555,
     qiyana: 246,
     quinn: 133,
     rakan: 497,
     rammus: 33,
     reksai: 421,
     rell: 526,
     renekton: 58,
     rengar: 107,
     riven: 92,
     rumble: 68,
     ryze: 13,
     samira: 360,
     sejuani: 113,
     senna: 235,
     seraphine: 147,
     sett: 875,
     shaco: 35,
     shen: 98,
     shyvana: 102,
     singed: 27,
     sion: 14,
     sivir: 15,
     skarner: 72,
     sona: 37,
     soraka: 16,
     swain: 50,
     sylas: 517,
     syndra: 134,
     tahmkench: 223,
     taliyah: 163,
     talon: 91,
     taric: 44,
     teemo: 17,
     thresh: 412,
     tristana: 18,
     trundle: 48,
     tryndamere: 23,
     twistedfate: 4,
     twitch: 29,
     udyr: 77,
     urgot: 6,
     varus: 110,
     vayne: 67,
     veigar: 45,
     velkoz: 161,
     vi: 254,
     viego: 234,
     viktor: 112,
     vladimir: 8,
     volibear: 106,
     warwick: 19,
     xayah: 498,
     xerath: 101,
     xinzhao: 5,
     yasuo: 157,
     yone: 777,
     yorick: 83,
     yuumi: 350,
     zac: 154,
     zed: 238,
     ziggs: 115,
     zilean: 26,
     zoe: 142,
     zyra: 143
};

//values in this object are the names of the keys on the champion.json file and we use these names to get imgs from ddragon cdn
export const championLowerCaseNameDdragonNamePairs = {
     aatrox: 'Aatrox',
     ahri: 'Ahri',
     akali: 'Akali',
     alistar: 'Alistar',
     amumu: 'Amumu',
     anivia: 'Anivia',
     annie: 'Annie',
     aphelios: 'Aphelios',
     ashe: 'Ashe',
     aurelionsol: 'AurelionSol',
     azir: 'Azir',
     bard: 'Bard',
     blitzcrank: 'Blitzcrank',
     brand: 'Brand',
     braum: 'Braum',
     caitlyn: 'Caitlyn',
     camille: 'Camille',
     cassiopeia: 'Cassiopeia',
     chogath: 'Chogath',
     corki: 'Corki',
     darius: 'Darius',
     diana: 'Diana',
     draven: 'Draven',
     drmundo: 'DrMundo',
     ekko: 'Ekko',
     elise: 'Elise',
     evelynn: 'Evelynn',
     ezreal: 'Ezreal',
     fiddlesticks: 'Fiddlesticks',
     fiora: 'Fiora',
     fizz: 'Fizz',
     galio: 'Galio',
     gangplank: 'Gangplank',
     garen: 'Garen',
     gnar: 'Gnar',
     gragas: 'Gragas',
     graves: 'Graves',
     gwen: 'Gwen',
     hecarim: 'Hecarim',
     heimerdinger: 'Heimerdinger',
     illaoi: 'Illaoi',
     irelia: 'Irelia',
     ivern: 'Ivern',
     janna: 'Janna',
     jarvaniv: 'JarvanIV',
     jax: 'Jax',
     jayce: 'Jayce',
     jhin: 'Jhin',
     jinx: 'Jinx',
     kaisa: 'Kaisa',
     kalista: 'Kalista',
     karma: 'Karma',
     karthus: 'Karthus',
     kassadin: 'Kassadin',
     katarina: 'Katarina',
     kayle: 'Kayle',
     kayn: 'Kayn',
     kennen: 'Kennen',
     khazix: 'Khazix',
     kindred: 'Kindred',
     kled: 'Kled',
     kogmaw: 'KogMaw',
     leblanc: 'Leblanc',
     leesin: 'LeeSin',
     leona: 'Leona',
     lillia: 'Lillia',
     lissandra: 'Lissandra',
     lucian: 'Lucian',
     lulu: 'Lulu',
     lux: 'Lux',
     malphite: 'Malphite',
     malzahar: 'Malzahar',
     maokai: 'Maokai',
     masteryi: 'MasterYi',
     missfortune: 'MissFortune',
     wukong: 'MonkeyKing',
     mordekaiser: 'Mordekaiser',
     morgana: 'Morgana',
     nami: 'Nami',
     nasus: 'Nasus',
     nautilus: 'Nautilus',
     neeko: 'Neeko',
     nidalee: 'Nidalee',
     nocturne: 'Nocturne',
     nunuandwillump: 'Nunu',
     olaf: 'Olaf',
     orianna: 'Orianna',
     ornn: 'Ornn',
     pantheon: 'Pantheon',
     poppy: 'Poppy',
     pyke: 'Pyke',
     qiyana: 'Qiyana',
     quinn: 'Quinn',
     rakan: 'Rakan',
     rammus: 'Rammus',
     reksai: 'RekSai',
     rell: 'Rell',
     renekton: 'Renekton',
     rengar: 'Rengar',
     riven: 'Riven',
     rumble: 'Rumble',
     ryze: 'Ryze',
     samira: 'Samira',
     sejuani: 'Sejuani',
     senna: 'Senna',
     seraphine: 'Seraphine',
     sett: 'Sett',
     shaco: 'Shaco',
     shen: 'Shen',
     shyvana: 'Shyvana',
     singed: 'Singed',
     sion: 'Sion',
     sivir: 'Sivir',
     skarner: 'Skarner',
     sona: 'Sona',
     soraka: 'Soraka',
     swain: 'Swain',
     sylas: 'Sylas',
     syndra: 'Syndra',
     tahmkench: 'TahmKench',
     taliyah: 'Taliyah',
     talon: 'Talon',
     taric: 'Taric',
     teemo: 'Teemo',
     thresh: 'Thresh',
     tristana: 'Tristana',
     trundle: 'Trundle',
     tryndamere: 'Tryndamere',
     twistedfate: 'TwistedFate',
     twitch: 'Twitch',
     udyr: 'Udyr',
     urgot: 'Urgot',
     varus: 'Varus',
     vayne: 'Vayne',
     veigar: 'Veigar',
     velkoz: 'Velkoz',
     vi: 'Vi',
     viego: 'Viego',
     viktor: 'Viktor',
     vladimir: 'Vladimir',
     volibear: 'Volibear',
     warwick: 'Warwick',
     xayah: 'Xayah',
     xerath: 'Xerath',
     xinzhao: 'XinZhao',
     yasuo: 'Yasuo',
     yone: 'Yone',
     yorick: 'Yorick',
     yuumi: 'Yuumi',
     zac: 'Zac',
     zed: 'Zed',
     ziggs: 'Ziggs',
     zilean: 'Zilean',
     zoe: 'Zoe',
     zyra: 'Zyra'
   }
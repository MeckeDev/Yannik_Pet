const fs = require('fs');
const tmi = require('tmi.js');
var secrets = require('./secrets.json');
var infos = require('./infos.json');

language = secrets["language"]

function start_bot(){
    if(secrets["username"] && secrets["oauth"]){
    
        const client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: secrets["username"],
                password: secrets["oauth"]
            },
            channels: [ secrets["username"] ]
        });
        
        client.connect();
        
        client.on('message', (channel, tags, message, self) => {
            // Ignore echoed messages.
            // if(self) return;

            console.log(message)
        
            if(message.toLowerCase() === '!hunger') {
                
                saveStat("hunger", -100)
                saveStat("energy", -100)
                saveStat("happyness", -100)
                client.say(channel, `@${tags.username}, Hunger erhöht!`);
                location.reload()
            }
        });
    
    }
}
if(!infos["bot"]){
    start_bot()
    // saveInfo("bot", true)
}

function active(btn){

    var secrets = require("./secrets.json")

    if(btn.innerText == "German"){
        secrets["language"] = "de"
        btn.style.backgroundColor = "green"
        document.getElementById("english").style.backgroundColor = "black"
        document.getElementById("english").style.color = "grey"
        document.getElementById("german").style.color = "white"
        document.getElementById("english").innerText = "English"
        document.getElementById("german").innerText = "German ✔"
    }

    if(btn.innerText == "English"){
        secrets["language"] = "en"
        btn.style.backgroundColor = "green"
        document.getElementById("german").style.backgroundColor = "black"
        document.getElementById("english").style.color = "white"
        document.getElementById("german").style.color = "grey"
        document.getElementById("german").innerText = "German"
        document.getElementById("english").innerText = "English ✔"
    }

    const data = JSON.stringify(secrets, null, 4);

    fs.writeFile('./secrets.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });

}

function save_login(){
    var secrets = require("./secrets.json")

    username = document.getElementById("username").value
    oauth = document.getElementById("oauth").value

    if(!oauth.startsWith("oauth:")){
        oauth = `oauth:${oauth}`
    }

    secrets["username"] = username
    secrets["oauth"] = oauth


    const data = JSON.stringify(secrets, null, 4);

    fs.writeFile('./secrets.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });

    location.reload()
}

async function open_link(link){
    require('electron').shell.openExternal(link);
}

async function saveStat(stat, num){

  var infos = require("./infos.json")
      
    infos["stats"]["curr"][stat] += num

    if(infos["stats"]["curr"][stat] <= 0){
        infos["stats"]["curr"][stat] = 0
        infos["stats"]["frust"] -= (5*infos["difficulty"])
    }

    infos = JSON.stringify(infos, null, 4)
    fs.writeFileSync('./infos.json', infos, err => {
        if (err) {
            console.log('Error writing file', err)
        }
    })

}

function saveInfo(i, wert){
    
    var infos = require("./infos.json")
      
    infos[i] = wert

    infos = JSON.stringify(infos, null, 4)
    fs.writeFile('./infos.json', infos, err => {
        if (err) {
            console.log('Error writing file', err)
        }
    })

}

async function load_image(){
    var infos = require("./infos.json")
    var text = require("./text.json")
    for (s in infos["stats"]["curr"]){
        document.getElementById(s).style.color = "black"
        var wert = infos["stats"]["curr"][s]
        var max = infos["max_stats"]
        var prozent = wert*100/max

        var stat_name =  text[language]["stats"][s]

        console.log(prozent, "%")
        
        if(prozent > 50){
            document.getElementById(s).innerHTML = `${stat_name}<div class="progress"  style="height: 5vh;"><div class="progress-bar bg-success" role="progressbar" style="width: ${prozent}%" aria-valuenow="${wert}" aria-valuemin="0" aria-valuemax="${max}"></div></div>`
        }
        if(prozent <= 50){
            document.getElementById(s).innerHTML = `${stat_name}<div class="progress"  style="height: 5vh;"><div class="progress-bar bg-warning" role="progressbar" style="width: ${prozent}%" aria-valuenow="${wert}" aria-valuemin="0" aria-valuemax="${max}"></div></div>`
        }
        if(prozent <= 25){
            document.getElementById(s).innerHTML = `${stat_name} <div class="progress"  style="height: 5vh;"><div class="progress-bar bg-danger" role="progressbar" style="width: ${prozent}%" aria-valuenow="${wert}" aria-valuemin="0" aria-valuemax="${max}"></div></div>`
        }
        
    }
    document.getElementById("cur_image").innerHTML = `<img class="mt-5" src="./images/${infos['phase']}_${infos['state']}.gif" width="256" height="256" alt="">`
}


// #################################
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function baby_test(){

    var infos = require("./infos.json")

    if(infos["state"] == "born"){
        sleep(5000)
        saveInfo("state", "idle")
        location.reload()
    }

    saveInfo("phase", "baby")
    saveInfo("state", "born")
    location.reload()

}

// saveStat("hunger", 1)
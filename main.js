var debugmode = true

window.EventEmitter = class EventEmitter {
        constructor() {
            this.events = {};
        }
        on(event, cb) {
            if (typeof this.events[event] !== 'object')
                this.events[event] = [];
            this.events[event].push(cb);
        }
        emit(event, data) {
            if (typeof this.events[event] !== 'object')
                return;
            this.events[event].forEach((cb) => cb(data));
        }
    }
    class Cloudlink {
        constructor(server) {
            this.events = new EventEmitter();
            this.ws = new WebSocket(server);
            this.data = {
                gvar: {},
                pvar: {},
                ulist: [],
                version: '0.0.0',
                motd: '',
                status: ''
            };
            this.ws.onopen = async () => {
                this.send({
                    cmd: 'direct',
                    val: {
                        cmd: 'ip',
                        val: await (await fetch('https://api.meower.org/ip')).text(),
                    },
                });
                this.send({
                    cmd: 'direct',
                    val: { cmd: 'type', val: 'js' },
                });
                this.send({
                    cmd: 'direct',
                    val: "meower",
                });
                this.events.emit('connected');
            };
            this.ws.onmessage = (socketdata) => {
                var data = JSON.parse(socketdata.data);
                if (debugmode == true) {
                	console.log(data);
                }
                switch (data.cmd) {
                    case 'gmsg':
                        this.events.emit('gmsg', data);
                    case 'pmsg':
                        this.events.emit('pmsg', data);
                    case 'gvar':
                        this.data.gvar[data.name] = data.val;
                        this.events.emit('gvar', data);
                    case 'pvar':
                        this.data.pvar[data.name] = data.val;
                        this.events.emit('pvar', data);
                    case 'ulist':
                        this.data.ulist = data.val.split(';');
                        this.events.emit('ulist', this.data.ulist);
                    case 'direct':
                        switch (data.val.cmd) {
                            case 'vers':
                                this.data.version = data.val.val;
                                this.events.emit('version', this.data.version);
                            case 'motd':
                                this.data.motd = data.val.val;
                                this.events.emit('motd', this.data.motd);
                            default:
                                this.events.emit('direct', data);
                        }
                    case 'statuscode':
                        this.data.status = data.val;
                        this.events.emit('statuscode', this.data.status);
                    default:
                        this.events.emit('error', new Error('Unknown command: ' + data.cmd));
                }
            };
            this.ws.onclose = () => {
                this.events.emit('disconnected');
            };
            this.ws.onerror = (e) => {
                this.events.emit('error', e);
            };
        }
        send(data) {
            this.ws.send(JSON.stringify(data));
        }
        on(event, cb) {
            this.events.on(event, cb);
        }
        disconnect() {
            this.ws.close();
        }
    }









let downloadedposts = []
let ulist = 0
let ulistcount = 0
let ulistnames = 0
let lstorage = window.localStorage;

async function load() {
    await delay(100);
    document.getElementById('start').style.visibility = 'visible';
}

load()

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
	//Make sure to put the function as "async runction"
}

async function jfetch(fetcht) {
    var r = await (await fetch(fetcht)).json()
    return r
}

function playselect() {
	var audio = new Audio('Assets/select.wav');
	audio.play();
}

function addpost(icon,post,user) {
    if (icon == "PF") {
        document.getElementById('HomeArea').innerHTML = '<div class="Post_Home_UI"><div class="Post_Top"><image class="Post_UserImage" alt="PFP" src="' + 'https://dev.meower.org/pfp/' + user + '"></image><p2 class="Post_User">' + user + '</p2></div><p2 class="Post_Text">' + post + '</p2></div>'+ document.getElementById('HomeArea').innerHTML
    }
    else {
        document.getElementById('HomeArea').innerHTML = '<div class="Post_Home_UI"><div class="Post_Top"><image class="Post_UserImage" alt="PFP" src="Assets/Art/Icons/icon_' + icon + '.svg"></image><p2 class="Post_User">' + user + '</p2></div><p2 class="Post_Text">' + post + '</p2></div>'+ document.getElementById('HomeArea').innerHTML
    }
}

function clearposts() {
    document.getElementById('HomeArea').innerHTML = ""
}

function auth_login() {
    cljs.send({ cmd: "direct", val: {cmd: "authpswd", val: {username: document.getElementById("user1").value, pswd: document.getElementById("pswd1").value}}, listener: "authpswd"})
}

async function gotologin() {
    await delay(500);
    document.getElementById('logo_intro').style.animation = 'zoomoutintro1 1.6s ease';
	document.getElementById('responsive_introanim1').style.animation = 'zoomoutintro2 1.6s ease';
	await delay(1600);
	document.getElementById('logo_intro').style.visibility = 'hidden';
	document.getElementById('responsive_introanim1').style.visibility = 'hidden';
	document.getElementById('introscreen').style.animation = 'fadeout 1s';
	await delay(1000);
    document.getElementById('introscreen').style.visibility = 'hidden';
    document.getElementById('login-nocookie').style.visibility = 'visible';
	document.getElementById('login-nocookie').style.animation = 'fadein 1s';
    //cljs.send({ cmd: "direct", val: {cmd: "authpswd", val: {username: "user", pswd: "pswd'}}, listener: "authpswd"})
}

function login() {
    document.getElementById('login-nocookie').style.visibility = 'hidden';
    document.getElementById('login').style.visibility = 'visible';
}

async function hometrans() {
	document.getElementById('login').style.animation = 'fadeout 1s';
	await delay(1000);
	document.getElementById('login').style.visibility = 'hidden';
	document.getElementById('home').style.visibility = 'visible';
	document.getElementById('home').style.animation = 'fadein 1s';
    clearposts()
    getposts()
}

async function goto_connect() {
	document.getElementById('start').style.visibility = 'hidden';
	document.getElementById('introscreen').style.visibility = 'visible';
	document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_connecting.html"
	window.cljs = new Cloudlink("wss://server.meower.org/");
	window.is_authed = false;

	function ping() {
	    cljs.send({cmd: "ping", val: ""})
	}
	setInterval(ping, 10000)
	cljs.on('connected', () => {
        document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_connected.html"
        gotologin()
	   
    })

	cljs.on('disconnected', () => {
        document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_disconnected.html"
        ms_alert("Disconnection Notice","You have been disconnected. The reason is currently unknown",buttonname = "Reload Page",buttonfunc = function() {location.reload()})
    })

	cljs.on('direct', (data) => {
        if (data.listener == "authpswd") {
            console.log(data.val)
            if (data.val.mode == "auth") {
                is_authed = true;
                hometrans()
            }
        }
        else if (data.val.post_origin == "home") {
            addpost("PF",data.val.p,data.val.u)
        }
        else if (data.cmd == "ulist") {
            ulist = data.val
            updateusercount()
        }
    })

    cljs.on('statuscode', (data) => {
        if (data == "E:103 | ID not found") {
            console.log("h")
            ms_alert('Login Screen','Invalid Username!')
        }
        else if (data == "I:011 | Invalid Password") {
            ms_alert('Login Screen','Invalid Password!')
        }
    })
}

async function getposts() {
	addpost(21,"Fetching posts","Home")
    let postfetch = await jfetch('https://api.meower.org/home?autoget')
    clearposts()
    addpost(21,"Fetching posts done!","Home")
    await delay(400)
    var rev = postfetch.autoget.reverse() 
    var l = postfetch.autoget.length
    console.log(l)
    clearposts()
	for (var i = 0; i < l; i++) {
    	console.log(i)
        console.log(downloadedposts)
        downloadedposts.push(rev[i])
        //add meower oauth api stuff for pfps
        addpost("PF",downloadedposts[i].p,downloadedposts[i].u)
	}
    if (downloadedposts.length < 1) {
        addpost("PF","There Are No posts! Sit back and wait until there is a new post!","System")
    }
}

function post() {
	cljs.send({cmd: "direct", val: {cmd: "post_home", val: document.getElementById("txtpostpost").value}, listener: "post_home"})
}

function showpass() {
    var x = document.getElementById("pswd1");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

async function hideusers() {
    document.getElementById('UsersOnline').style.animation = "none";
    await delay(100);
    document.getElementById('UsersOnline').style.animation = 'fadeout 1.6s';
    await delay(1600);
    document.getElementById('UsersOnline').style.visibility = 'hidden';
    document.getElementById('HomeArea').style.visibility = 'visible';
    document.getElementById('HomeArea').style.animation = "none";
    document.getElementById('HomeArea').style.animation = 'hesback 3s ease';
    await delay(1600);
    document.getElementById('ShowUsers').onclick = function() {showusers()};
    document.getElementById('ShowUsers').innerHTML = 'Show Users Online';
}

async function showusers() {
    document.getElementById('HomeArea').style.animation = 'zoomoutintro2 1.6s ease';
    await delay(1600);
    document.getElementById('HomeArea').style.visibility = 'hidden';
    await delay(100);
    document.getElementById('UsersOnline').style.visibility = 'visible';
    document.getElementById('UsersOnline').style.animation = 'goin 1.6s ease';
    document.getElementById('ShowUsers').onclick = function() {hideusers()};
    document.getElementById('ShowUsers').innerHTML = 'Hide Users Online';
    updateusercount()
}

function updateusercount() {
    ulistcount = ulist.split(";")
    ulistnames = ulist.replace(";", ", ")
    ulistcount = ulistcount.length - 1
    document.getElementById("UsersOn").innerHTML = "The Users Online are: " + ulistnames + "."
    if (ulistcount > 2) {
        document.getElementById("UsersCount").innerHTML = "User count: There are " + (ulistcount - 1) + " other users online."
    }
    else if (ulistcount == 2) {
        document.getElementById("UsersCount").innerHTML = "User count: There is only 1 other user online."
    }
    else if (ulistcount == 1) {
        document.getElementById("UsersCount").innerHTML = "User count: Only Your Online."
    }
    else if (ulistcount == 0) {
        document.getElementById("UsersCount").innerHTML = "User count: Wait How are there 0 users online?"
    }
    else if (ulistcount < 0) {
        document.getElementById("UsersCount").innerHTML = "User count: WAIT, " + ulistcount + "USERS? THAT ISNT EVEN POSSIBLE!"
    }
    console.log(ulistcount)
}

function hoversound() {
    var audio = new Audio('Assets/select.wav');
    audio.play();

}

function hidealert() {
    document.getElementById('meower-style-alert').style.visibility = 'hidden';
}

function ms_alert(title = "Alert",message = "Please insert a message.",buttonname = "Ok",buttonfunc = function() {hidealert()}) {
    document.getElementById('alb-button').onclick = buttonfunc;
    document.getElementById('alb-title').innerHTML = title;
    document.getElementById('alb-button').innerHTML = buttonname;
    document.getElementById('alb-message').innerHTML = message;
    document.getElementById('meower-style-alert').style.visibility = 'visible';
}

//var audio = new Audio('Assets/intro.wav');
//audio.play();
//document.getElementById('meowertexti').style.animation = 'introout 0.4s';
//await delay(400);

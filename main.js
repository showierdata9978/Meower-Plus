var debugmode = true

class Cloudlink {
    constructor(server) {
        this.events = {};
        this.ws = new WebSocket(server);
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
            this.emit('connected');
        };
        this.ws.onmessage = (socketdata) => {
            var data = JSON.parse(socketdata.data);
            console.log(data)
            this.emit(data.cmd, data);
        };
        this.ws.onclose = () => {
            this.emit('disconnected');
        };
        this.ws.onerror = (e) => {
            this.emit('error', e);
        };
    }
    send(data) {
        this.ws.send(JSON.stringify(data));
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
    disconnect() {
        this.ws.close();
    }
}








let loggedout = false
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

function addpost(post,user,id = null) {
    if (ulist.includes(user)) {
        document.getElementById('HomeArea').innerHTML = '<div class="Post_Home_UI"><div class="Post_Top"><div class="online"></div><image class="Post_UserImage" alt="PFP" src="' + 'https://dev.meower.org/pfp/' + user + '"></image><p2 class="Post_User" id="' + id + '_user">' + user + '</p2></div><p2 class="Post_Text" id="' + id + '">' + '</p2></div>'+ document.getElementById('HomeArea').innerHTML
    } else {
        document.getElementById('HomeArea').innerHTML = '<div class="Post_Home_UI"><div class="Post_Top"><image class="Post_UserImage" alt="PFP" src="' + 'https://dev.meower.org/pfp/' + user + '"></image><p2 class="Post_User" id="' + id + '_user">' + user + '</p2></div><p2 class="Post_Text" id="' + id + '">' + '</p2></div>'+ document.getElementById('HomeArea').innerHTML
    }
    document.getElementById(id).innerText = post
    document.getElementById(id + '_user').innerText = user
}

function clearposts() {
    document.getElementById('HomeArea').innerHTML = ""
}

function sussybaka() {
    location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
}

function auth_join() {
    localStorage.setItem('pswd', document.getElementById("pswd2").value);
    localStorage.setItem('user', document.getElementById("user2").value);
    cljs.send({ cmd: "direct", val: {cmd: "gen_account", val: {username: document.getElementById("user2").value, pswd: document.getElementById("pswd2").value}}, listener: "authpswd"})
    cljs.on('statuscode', (data) => {
        if (data.listener == "authpswd") {
            if (data.val == "I:100 | OK") {
                
            }
            else {
                ms_alert('Join Screen','Unexpected ' + data.val + ' Error!')
            }
        }
    })
}

function auth_login() {
    localStorage.setItem('pswd', document.getElementById("pswd1").value);
    localStorage.setItem('user', document.getElementById("user1").value);
    cljs.send({ cmd: "direct", val: {cmd: "authpswd", val: {username: document.getElementById("user1").value, pswd: document.getElementById("pswd1").value}}, listener: "authpswd"})
    cljs.on('statuscode', (data) => {
        if (data.listener == "authpswd") {
            if (data.val == "E:103 | ID not found") {
                console.log("h")
                ms_alert('Login Screen','Invalid username!')
            }
            else if (data.val == "I:011 | Invalid Password") {
                ms_alert('Login Screen','Invalid password!')
            }
            else if (data.val == "E:018 | Account Banned") {
                ms_alert('Login Screen','The account you have attempted to log in to is banned!')
            }
            else if (data.val == "I:100 | OK") {
                
            }
            else {
                ms_alert('Login Screen','Unexpected ' + data.val + ' error!')
            }
        }
    })
}

var theme = 0

function changetheme() {
    if (theme == 0) {
        theme = 1
        document.getElementById("darkmodecss").href = "style-dark.css"
    }
    else {
        theme = 0
        document.getElementById("darkmodecss").href = "style.css"
    }
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
    document.getElementById("pswd1").value = "";
    document.getElementById("user1").value = "";
}

function join() {
    document.getElementById('login-nocookie').style.visibility = 'hidden';
    document.getElementById('join').style.visibility = 'visible';
    document.getElementById("pswd2").value = "";
    document.getElementById("user2").value = "";
}

async function hometrans() {
	document.getElementById('login').style.animation = 'fadeout 1s';
    document.getElementById('join').style.animation = 'fadeout 1s';
	await delay(1000);
	document.getElementById('login').style.visibility = 'hidden';
    document.getElementById('join').style.visibility = 'hidden';
    document.getElementById('statusintro').style.visibility = 'hidden';
	document.getElementById('home').style.visibility = 'visible';
	document.getElementById('home').style.animation = 'fadein 1s';
    document.getElementById('introscreen').style.visibility = 'hidden';
    clearposts()
    getposts()
}

var nocookielogin = false //Disables auto login, for debugging

var maintenence = false

async function goto_connect() {
    if (maintenence) {
        document.getElementById('start').style.visibility = 'hidden';
    }
    else {
        document.getElementById('start').style.visibility = 'hidden';
        document.getElementById('introscreen').style.visibility = 'visible';
        document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_connecting.html"
        window.cljs = new Cloudlink("wss://server.meower.org/");
        //window.cljs = new Cloudlink("ws://localhost:3000/");
        window.is_authed = false;

        function ping() {
            cljs.send({cmd: "ping", val: ""})
        }
        setInterval(ping, 10000)
        cljs.on('connected', () => {
            document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_connected.html"
            if (nocookielogin == true) {
                gotologin()
            }
            else {
                if (localStorage.getItem('user') === null || localStorage.getItem('pswd') === null) {
                    gotologin()
                }
                else {
                    cljs.send({ cmd: "direct", val: {cmd: "authpswd", val: {username: localStorage.getItem('user'), pswd: localStorage.getItem('pswd')}}, listener: "authpswd"})
                    cljs.on('statuscode', (data) => {
                        if (data.listener == "authpswd") {
                            if (data.val == "I:100 | OK") {
                                
                            }
                            else {
                                localStorage.setItem('pswd', null);
                                localStorage.setItem('user', null);
                                gotologin()
                            }
                        }
                    })
                }
            }
        })

        cljs.on('disconnected', (data) => {
            document.getElementById('introanim1').src = "Assets/AnimateCanvas/meowyanim_disconnected.html"
            document.getElementById("statusintro").innerHTML = "Disconnected, Please Reload."
            if (loggedout == false && is_authed == true) {
                ms_alert("Disconnection Notice","You have been disconnected. The reason is currently unknown, But here is info: "+data,buttonname = "Reload Page",buttonfunc = function() {location.reload()})
            }
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
                addpost(data.val.p,data.val.u,data.val.post_id)
            }
        })

        cljs.on('ulist', (data) => {
            console.log(data)
            ulist = data.val
            updateusercount()
        })
    }
}

function logout() {
    document.getElementById('home').style.visibility = 'hidden';
    document.getElementById('logout').style.visibility = 'visible';
    loggedout = true
    cljs.disconnect()
}

async function getposts() {
	addpost(21,"Fetching posts","Home")
    let postfetch = await jfetch('https://api.meower.org/home?autoget')
    clearposts()
    addpost(21,"Fetching posts completed!","Home")
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
        addpost(downloadedposts[i].p,downloadedposts[i].u,downloadedposts[i].post_id)
	}
    if (downloadedposts.length < 1) {
        addpost("There are no posts! Sit back and wait until someone sends a new post!","System")
    }
}

function post() {
	cljs.send({cmd: "direct", val: {cmd: "post_home", val: document.getElementById("txtpostpost").value}, listener: "post_home"})
}

var showpassb = false

function showpass() {
    var x = document.getElementById("pswd1");
    if (showpassb == true) {
        x.type = "text";
        showpassb = false
    } else {
        x.type = "password";
        showpassb = true
    }
}

function showpass2() {
    var x = document.getElementById("pswd2");
    if (showpassb == true) {
        x.style = "-webkit-text-security: disc !important";
        showpassb = false
    } else {
        x.style = "";
        showpassb = true
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
    document.getElementById("UsersOn").innerHTML = "The users online are " + ulistnames + "."
    if (ulistcount > 2) {
        document.getElementById("UsersCount").innerHTML = "User count: There are " + (ulistcount - 1) + " other users online."
    }
    else if (ulistcount == 2) {
        document.getElementById("UsersCount").innerHTML = "User count: There is only 1 other user online."
    }
    else if (ulistcount == 1) {
        document.getElementById("UsersCount").innerHTML = "User count: Only you're online right now."
    }
    else if (ulistcount == 0) {
        document.getElementById("UsersCount").innerHTML = "User count: Wait, how are there 0 users online?"
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

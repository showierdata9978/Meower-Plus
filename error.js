const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams.get('error'))

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
	//Make sure to put the function as "async runction"
}

errorinit()

async function errorinit() {
	await delay(100)
	document.getElementById("errorcontext").innerHTML = "Error: " + urlParams.get('error')
}

function Playa() {
	document.getElementById('Audio').remove()
	var audio = new Audio('Assets/Night Out.wav');
	audio.play();
	audio.loop = true;
}

async function animbg() {
	await delay(100)
	for (var i = 0; i < 2147483647; i++) {
		console.log("e")
		document.getElementById('errorimg').style.animation = "none";
		await delay(0.1);
	    document.getElementById('errorimg').style.animation = 'scroll 1.6s linear';
	    await delay(210);
	}
}

animbg()
console.log('Demo Connected');

var begin = document.getElementById('beginGame');
var stop = document.getElementById('stopGame');
var tickCounter = document.getElementById('tickCounter');

console.log(begin);

var beginMyGame = function() {
	var g = new IncrementalEngine();
	console.log('Game begun', g);
	g.begin(1000);
}

begin.onclick = function() {
	beginMyGame();
}

stop.onclick = function(){stopTick('game')}

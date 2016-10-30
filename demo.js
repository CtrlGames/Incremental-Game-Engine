var g = new IncrementalEngine();

var begin = document.getElementById('beginGame');
var tickCounter = document.getElementById('tickCounter');
var addWood = document.getElementById('getWood');
var addFood = document.getElementById('getFood');
var addWorker = document.getElementById('getWorker');
var addLumberjack = document.getElementById('lumberjack');
var addFarmer = document.getElementById('farmer');
var listSection = document.getElementById('listSection');

console.log(begin);

addWood.style.display = "none";
addFood.style.display = "none";
addWorker.style.display ="none";
addLumberjack.style.display ="none";
addFarmer.style.display ="none";

var beginMyGame = function() {	
	console.log('Game begun', g);
	g.begin(500);
	g.createResource('wood');
	g.createResource('food');
	addWood.style.display = "inline-block";
	addFood.style.display = "inline-block";
	begin.style.display = "none";
}

begin.onclick = function() {
	beginMyGame();
}


addToPool = function(p, n) {
	g.pools[p].addToPool((n ? n : 1));
}










addWood.onclick = function(){
	addToPool('wood', 1);
	if (g.resources.wood.amount >= 5 && g.resources.food.amount >= 5) {
		g.addPool({name: "worker"});
		addWorker.style.display = "inline-block";
	}
};
addFood.onclick = function() {
	g.increaseResource('food', 1);
	if (g.resources.wood.amount >= 5 && g.resources.food.amount >= 5) {
		g.createResource('worker');
		addWorker.style.display = "inline-block";
	}
}

addWorker.onclick = function(){
	g.increaseResource('worker', 1);
	g.addResourceCondition(false, 'food', 2);
	g.decreaseResource('food', 5);
	if (g.resources.worker.amount > 0 ) {
		g.createResource('Lumber Jack');
		addLumberjack.style.display="inline-block";
		g.createResource('Farmer');
		addFarmer.style.display="inline-block";
	}
	enableButton(addLumberjack);
	enableButton(addFarmer);
};
addLumberjack.onclick = function(){
	g.addResourceCondition(true, 'wood', 2);
	g.decreaseResource('worker', 1);
	g.increaseResource('Lumber Jack', 1);
	if (g.resources.worker.amount <= 0) {
		disableButton(addLumberjack);
		disableButton(addFarmer);
	}
};
addFarmer.onclick = function(){
	g.addResourceCondition(true, 'food', 3);
	g.decreaseResource('worker', 1);
	g.increaseResource('Farmer', 1);
	if (g.resources.worker.amount <= 0) {
		disableButton(addLumberjack);
		disableButton(addFarmer);
	}
};

var populateResourceList = function() {
	var oldList = document.getElementById('resourceList');
	listSection.appendChild(oldList);
    var list = document.createElement('ul');

	for (var key in g.resources) {
		var r = g.resources[key].name;
		var a = g.resources[key].amount;
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(r + " : " + a));
		list.appendChild(item);
	}
	
	listSection.replaceChild(list, oldList);
	listSection.appendChild(list);
	list.setAttribute('id', 'resourceList');
}

var checkConditions = function(){
	for (var key in g.resources) { // This.resources is undefined?
			if (g.resources[key].conditions.add > 0) {
				g.increaseResource(key, g.resources[key].conditions.add);
			}
			if (g.resources[key].conditions.minus > 0) {
				g.decreaseResource(key, g.resources[key].conditions.minus);
			}
		}
}

var gameTick = function(){
    tickCounter.innerHTML = gameTick;
    populateResourceList();
    checkConditions();
}

document.addEventListener('tick', gameTick);

// Helper Funcs~

disableButton = function(elm){
	elm.disabled = true;
}

enableButton = function(elm) {
	elm.disabled = false;
}




// Testing

// Adding pools
g.addPool({
  name: "Sir Steve",
  key: "steve"
});

g.addPool({
  name: "MEGA-Wood",
  key: "wood"
})

// print on page
function log(v) {
  var d = document.querySelector('.log');
  d.innerHTML += "<div>"+v+"</div>";
}

Object.keys(g.pools).forEach(e => log(g.pools[e].name +":"+ g.pools[e].amount));
log("---");

g.pools.wood.addToPool(5);
g.pools.steve.addToPool(100);

Object.keys(g.pools).forEach(e => log(g.pools[e].name +":"+ g.pools[e].amount));
log("---");

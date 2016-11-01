var g = new IncrementalEngine();

// UI Variables
var begin = document.getElementById('beginGame');
var tickCounter = document.getElementById('tickCounter');
var addWood = document.getElementById('getWood');
var addFood = document.getElementById('getFood');
var addWorker = document.getElementById('getWorker');
var addLumberjack = document.getElementById('lumberjack');
var addFarmer = document.getElementById('farmer');
var listSection = document.getElementById('listSection');
var addCustomDiv = document.getElementById('addCustom');
var custResource = document.getElementById('custResource');
var custAmount = document.getElementById('custAmount');
var submitCustom = document.getElementById('submitCustom');

// session variables
var tickTimer = 0;
var offset = true;

// Pool List
var myPools = {
	wood: {
		key: 'wood',
		name: 'Wood',
		details: ['The Building block of Everything', 'How much could a Woodchuck chuck?']
	},
	food: {
		key: 'food',
		name: 'Food',
		minimum: 10,
		details: {notes: ['Who is Hungry?']}
	},
	worker: {
		key: 'worker',
		name: 'Worker',
		requirements: {food: 10},
		increments: {food: -1}
	},
	farmer: {
		key: 'farmer',
		name: 'Farmer',
		increments: {food: .5},
		requirements: {worker: 1},
		details: {notes: ['Without us, the world would die!']}
	},
	lumberjack: {
		key: 'lumberjack',
		name: 'Lumber-jack',
		requirements: {food: 10, wood: 5, worker: 1},
		increments: {wood: 5, food: -3}
	}

}


// Hide/Show Settings
addWood.style.display = "none";
addFood.style.display = "none";
addWorker.style.display ="none";
addLumberjack.style.display ="none";
addFarmer.style.display ="none";
addCustomDiv.style.display = "none";

begin.onclick = function() {	
	console.log('Game begun', g);
	g.begin(500);
	g.addPool(myPools.food);
	g.addPool(myPools.wood);
	addWood.style.display = "inline-block";
	addFood.style.display = "inline-block";
	addCustomDiv.style.display = "inline-block"
	begin.style.display = "none";
}

submitCustom.onclick = function() {
	var n = parseInt(custAmount.value);
	var val = custResource.value;
	if (val == "interval") {
		g.modifyQueueInterval(n);
	} else {
			addToPool(val, n);
	}
}

addToPool = function(p, n) {
	var s = g.pools[p].modifyPoolAmount((n ? n : 1));
	if (!s.success) {
		console.error("Couldn't Add to " + p + " because " + (s.surplus ? "you are beyond Capacity":"of unmet requirements"), s);
	}
}

addWood.onclick = function(){
	addToPool(myPools.wood.key, 1);
};

addFood.onclick = function() {
	addToPool(myPools.food.key, 1);
	if (g.pools.food.amount >= 5) {
		g.addPool(myPools.worker);
		addWorker.style.display = "inline-block";
	}
};

addWorker.onclick = function(){
	addToPool(myPools.worker.key, 1);
	if (g.pools.worker.amount > 0) {
		g.addPool(myPools.lumberjack);
		addLumberjack.style.display="inline-block";
	}
	if (g.pools.worker.amount > 0) {
		g.addPool(myPools.farmer);
		addFarmer.style.display="inline-block";
	}
	enableButton(addLumberjack);
	enableButton(addFarmer);
};
addLumberjack.onclick = function(){
	addToPool(myPools.worker.key, -1);
	addToPool(myPools.lumberjack.key, 1);
	if (g.pools.worker.amount <= 0) {
		disableButton(addLumberjack);
		disableButton(addFarmer);
	}
};
addFarmer.onclick = function(){
	addToPool(myPools.farmer.key, 1);
	if (g.pools.worker.amount <= 0) {
		disableButton(addLumberjack);
		disableButton(addFarmer);
	}
};

var populateResourceList = function() {
	var oldList = document.getElementById('resourceList');
	listSection.appendChild(oldList);
    var list = document.createElement('ul');

	for (var key in g.pools) {
		var r = g.pools[key].name;
		var a = g.pools[key].amount;
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(r + " : " + a));
		list.appendChild(item);
	}
	
	listSection.replaceChild(list, oldList);
	listSection.appendChild(list);
	list.setAttribute('id', 'resourceList');
}

var gameTick = function(event, queue){
	if (offset) {
		tickCounter.innerHTML = tickTimer += 1;
		offset = false;
	} else {
		offset = true;
	}
    populateResourceList();
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
// g.addPool({
//   name: "Sir Steve",
//   key: "steve"
// });

// g.addPool({
//   name: "MEGA-Wood",
//   key: "megawood",
//   requirements: {steve: 1}
// })

// // print on page
// function log(v) {
//   var d = document.querySelector('.log');
//   d.innerHTML += "<div>"+v+"</div>";
// }

// Object.keys(g.pools).forEach(e => log(g.pools[e].name +":"+ g.pools[e].amount));
// log("---");

// g.pools.steve.addToPool(100);
// g.pools.wood.addToPool(5);

// Object.keys(g.pools).forEach(e => log(g.pools[e].name +":"+ g.pools[e].amount));
// log("---");

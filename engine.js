(function(){
// Incremental gaming engine

// Create new instance of the game

//TODO:
//1) add/remove resource pools.
// 2) raise/lower increments
// 3) able to create "resources" that use other single, and multiple resources ( buildings use wood ect. )
// 4) set custom "tick" time and process all the ups and downs required.
// 5) manage multiple queues/pools ( maybe just a new instance or something? )
// 6) able to retrieve all the data about the pools ( total, increment, ect )
	// Make Multiple Pools and Multiple tick options. Maybe different timeout vs intervals
	//  https://jsfiddle.net/kenostik/k91tr882/



//Create Game Instance
window.IncrementalEngine = function IncrementalEngine() {

	this.gameInterval = 0;
	this.gameTick = 0;
	this.resources = {};
	this.tickConditions =[];
	this.pools = {};
	this.interval; //Use defineProperty to set up a getter and a setter on the interval

};

console.log(window.IncrementalEngine);

IncrementalEngine.prototype = {
	//Begin a game session with Tick Interval in milliseconds
	begin(n) {
		this.gameInterval = window.setInterval(this.onTick().bind(this), n);
	},

	// loops through tickConditions and calls required functions
	onTick() {
		this.gameTick += Number.isInteger(this.gameTick) ? 1 : 0;

		var event = new Event('tick', {tick: this.gameTick});
		document.dispatchEvent(event);

		for (var key in this.resources) { // This.resources is undefined?
			if (this.resources[key].conditions.add > 0) {
				this.increaseResource(key, this.resources.key.conditions.add);
			}
			if (this.resources[key].conditions.minus > 0) {
				this.decreaseResource(key, this.resources.key.conditions.add);
			}
		}
	},

	// Add a condition to a resource
	addResourceCondition(add, r, n){
		if (add) {
			this.resources[r].conditions.add += n;
		} else {
			this.resources[r].conditions.minus += n;
		}

		return this.resources.r;
	},
	// Create a resource. Start with none, and no Conditions
	createResource(r){
		if (!this.resources[r]) {
			this.resources[r] = {
				name: r,
				amount: 0,
				conditions: {add: 0, minus: 0}

			};
		}
	},

	increaseResource(r, n) {
		this.resources[r].amount += n ? n : 1;
	},

	decreaseResource(r, n) {
		this.resources[r].amount -= n ? n : 1;
	},
};


})();

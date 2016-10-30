console.log('Engine connected');

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



var poolPrototype = {
  modifyPoolIncrement: function(n) {
    this.increment += n;
  },

  addToPool: function(n) {
  	if (n  > 0 && this.requirements) {
  		for (var key in this.requirements) {
  			if (this.requirements.hasOwnProperty(key)) {
  				this.requirements.key
  			}
  		}
  	}
  	this.amount += n;
  }
}; // close prototype

//Create Game Instance
window.IncrementalEngine = function IncrementalEngine() {

	this.gameInterval = 0;
	this.gameTick = 0;
	this.pools = {};

};

IncrementalEngine.prototype = {
	//Begin a game session with Tick Interval in milliseconds
	begin(n) {
		this.gameInterval = window.setInterval(this.onTick, n);
	},

	// loops through tickConditions and calls required functions
	onTick() {
		Number.isInteger(this.gameTick) ? this.gameTick += 1 : this.gameTick = 0;

		var event = new Event('tick', {tick: this.gameTick});
		document.dispatchEvent(event);

		for (var key in this.pools) { 
			if (this.pools.hasOwnProperty(key) && this.pools[key].increment !== 0) {
				this.pools[key].addToPool(this.pools[key].increment)
			}
		}
	},

	addPool(obj) {
	  this.pools[obj.key? obj.key : obj.name] = Object.create(poolPrototype);
	  Object.assign(this.pools[obj.key? obj.key : obj.name], {
	  	key: obj.key,
	    name: obj.name,
	    amount: 0,
	    requirements: obj.requirements || {},
	    increment: obj.requirements || 0,
	    details: obj.details || {}
  		});
	}


};


})();
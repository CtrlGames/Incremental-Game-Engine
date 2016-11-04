(function(){

// TODO:   Create Punishment System > When you are at your minimum But increments are called for > call punishment!


//Create Game Instance
window.IncrementalEngine = function IncrementalEngine() {

	this.tickInterval = 0;
	this.queueInterval = 0;
	this.pools = {};
	this.details = {};
	this.allIncrements = {};

};

// Create Pool Prototype
var poolPrototype = {
  modifyPoolIncrements: function(p, n) {
    if (p === 'resetIncrements' && !Number.isInteger(n)) {
  		this.increments = n;
  	} else {
  		this.increments[p] += n;
  	}
  },

  modifyPoolDetails: function(key, val) {
  	if (key === 'resetDetails' ) {
  		this.details = val;
  	} else {
  		this.details[key] += val;
  	}
  },

  modifyPoolRequirements: function(res, n) {
  	this.requirements[res] += n;
  },

  modifyPoolMaximum: function(n, type) {
  	if (type === 'set') {
  		this.maximum = n
  	} else {
  		this.maximum += n
  	}
  },
  modifyPoolMinimum: function(n, type){
  	if (type === 'set') {
  		this.minimum = n
  	} else {
  		this.minimum += n
  	}
  },

  modifyPoolAmount: function(n, override) { 
  	var pass = this.checkMinandMax(n);
  	n = pass.success ? n : pass.toCapacity;
  	if (n > 0) {
  		var requirements = this.checkRequirements(n, true);

	  	if (requirements.success || override) {
	  		this.amount += n;
	  		return pass;
	  	} else {
	  		return requirements;
	  	}
  	} else {
  		this.amount += n;
  		return pass
  	}
  },

  checkRequirements: function(n, pay){
	var unmetReq = {};
	Object.keys(this.requirements).forEach(e => {
		if(this.queue.pools[e].amount < ((this.requirements[e] * n) + this.queue.pools[e].minimum)) {
			unmetReq[e] = ((this.requirements[e] * n) + this.queue.pools[e].minimum) - this.queue.pools[e].amount;
		}
	});
	if (!Object.keys(unmetReq).length && pay) {
		Object.keys(this.requirements).forEach(e => this.queue.pools[e].modifyPoolAmount(-(this.requirements[e] * n)));
	}
	return !Object.keys(unmetReq).length ? {success: true} : {succeess: false, unmentRequirements: unmetReq};
  },

  checkMinandMax: function(n){
  	if (this.amount + n > this.maximum ) {
  		return {success: false, pool: this, toCapacity: this.maximum - this.amount, surplus: this.amount + n - this.maximum};
  	} else if (this.amount + n < this.minimum) {
  		return {success: false, pool: this, toCapacity : this.minimum - this.amount, surplus: this.amount + n - this.minimum};
  	} else {
  		return {success: true }
  	}
  }
}; // close prototype



IncrementalEngine.prototype = {
	//Begin a game session with Tick Interval in milliseconds
	begin(n) {
		this.tickInterval = n;
		this.queueInterval = window.setInterval(this.onTick.bind(this), this.tickInterval);
	},

	// loops through tickConditions and calls required functions
	onTick() {

		this.factorIncrements();

		var event = new Event('tick', this);
		document.dispatchEvent(event);
	},

	modifyQueueInterval(n){
		window.clearInterval(this.queueInterval);
		this.tickInterval = n;
		this.queueInterval = window.setInterval(this.onTick.bind(this), this.tickInterval);
	},

	addPool(obj) {
	  if (!this.pools[obj.key? obj.key : obj.name]) {
	  	this.pools[obj.key? obj.key : obj.name] = Object.create(poolPrototype);
	  	Object.assign(this.pools[obj.key? obj.key : obj.name], {
	  	key: obj.key,
	    name: obj.name,
	    amount: obj.amount || obj.minimum || 0,
	    minimum: obj.minimum || 0,
	    maximum: obj.maximum || 100,
	    requirements: obj.requirements || {},
	    increments: obj.increments || {},
	    details: obj.details || {},
	    queue: this
  		});
	  }
	},

	factorIncrements(){
		var inc = {}
		Object.keys(this.pools).forEach(el => {
			if (this.pools[el].amount > 0 && Object.keys(this.pools[el].increments).length) {
				Object.keys(this.pools[el].increments).forEach(e => {
						if(this.pools[e].amount <= this.pools[e].maximum && this.pools[e].amount >= this.pools[e].minimum) {
								inc[e] ? inc[e] += this.pools[el].increments[e] * this.pools[el].amount : inc[e] = this.pools[el].increments[e] * this.pools[el].amount;
						} 
				})
			}
		});

		Object.keys(inc).forEach(i => { 
			if (inc[i] != 0) this.pools[i].modifyPoolAmount(inc[i]); 
		});

		return inc
	}
};

})();

// Helper Functions

function getIncrements(pool) {
	var inc = {};
	if (pool.amount > 0 && Object.keys(pool.increments).length) {
		Object.keys(pool.increments).forEach(e => {
			if(this.pools[e].amount <= this.pools[e].maximum && this.pools[e].amount >= this.pools[e].minimum) {
					inc[e] ? inc[e] += this.pools[el].increments[e] : inc[e] = this.pools[el].increments[e]
			} 
		})
	}
};
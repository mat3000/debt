angular.module('app').service('UserService', function($http){

	this.users = [];

	this.debts = [];

	this.categories = [];

	this.getUsers = function(callback){

		var self = this;

		if(self.users.length){

			log.orange('getUsers()','var')

			callback(self.users);

		}else{

			$http({
				method: 'GET',
				url: 'actions.php',
				params: {action:'getUsers'}
			}).then(function(response){

				log.red('getUsers()','$http')

				var users = response.data;

				Object.defineProperties(users, {

				  	getUserByName: {
				    	value: function(name){
				    		for (var i = 0; i < this.length; i++) {
								if(this[i].name==name) return this[i];
							}
							return false;
				    	}
				  	}
				  	,getUserById: {
				    	value: function(id){
				    		for (var i = 0; i < this.length; i++) {
								if(this[i].id==id) return this[i];
							}
				    	}
				  	},
				  	getColorById: {
				    	value: function(id){
							return this.getUserById(id).color;
				    	}
				  	},
				  	getNameById: {
				    	value: function(id){
							return this.getUserById(id).name;
				    	}
				  	},
				  	getLetterById: {
				    	value: function(id){
							return this.getUserById(id).name[0];
				    	}
				  	}

				});

				self.users = users;
				callback(self.users);

			}, function(error){

				log.red(error);

			});

		}

	}

	// this.getCategories = function(callback){

	// 	var self = this;

	// 	if(self.categories.length){

	// 		log.orange('getCategories()','var')

	// 		callback(self.categories);

	// 	}else{

	// 		$http({
	// 			method: 'GET',
	// 			url: 'actions.php',
	// 			params: {action:'getCategories'}
	// 		}).then(function(response){

	// 			log.red('getCategories()','$http')

	// 			var categories = response.data;

	// 			Object.defineProperties(categories, {

	// 			  	getCategoryById: {
	// 			    	value: function(id){
	// 			    		for (var i = 0; i < this.length; i++) {
	// 							if(this[i].id==id) return this[i];
	// 						}
	// 			    	},
	// 			  	},

	// 			  	getLabelById: {
	// 			    	value: function(id){
	// 						return this.getCategoryById(id).label;
	// 					},
	// 			  	}

	// 			});

	// 			self.categories = categories;
	// 			callback(categories);

	// 		}, function(error){

	// 			log.red(error)

	// 		});

	// 	}

	// }

	this.getDebt = function(callback){

		var self = this;

		// if(self.test){
		if(self.debts.debt){

			log.orange('getDebt()','var')

			callback(self.debts);

		}else{


			self.test = true;
		
			log.red('getDebt()','$http')

			$http({
			  	method: 'GET',
			  	url: 'actions.php',
			  	params: {action:'getDebt'}
			}).then(function(response){

				
				self.debts = response.data;

				Object.defineProperties(self.debts.users, {

				  	getUserByName: {
				    	value: function(name){
				    		for (var i = 0; i < this.length; i++) {
								if(this[i].name==name) return this[i];
							}
							return false;
				    	}
				  	}
				  	,getUserById: {
				    	value: function(id){
				    		for (var i = 0; i < this.length; i++) {
								if(this[i].id==id) return this[i];
							}
				    	}
				  	},
				  	getColorById: {
				    	value: function(id){
							return this.getUserById(id).color;
				    	}
				  	},
				  	getNameById: {
				    	value: function(id){
							return this.getUserById(id).name;
				    	}
				  	},
				  	getLetterById: {
				    	value: function(id){
							return this.getUserById(id).name[0];
				    	}
				  	}

				});

				Object.defineProperties(self.debts.categories, {

				  	getCategoryById: {
				    	value: function(id){
				    		for (var i = 0; i < this.length; i++) {
								if(this[i].id==id) return this[i];
							}
				    	},
				  	},

				  	getLabelById: {
				    	value: function(id){
							return this.getCategoryById(id).label;
						},
				  	}

				});




				callback(self.debts);

			}, function(error){

				log.red(error)

			});

		}
	}

	this.convertDate = function(date){

		if(!date || !date.getFullYear) return date;
		var yy = date.getFullYear() + '';
  		var mm = (date.getMonth()+1) + '';
  		var dd = date.getDate() + '';

  		if(mm.length===1) mm = '0' + mm;
  		if(dd.length===1) dd = '0' + dd;

  		return yy + '-' + mm + '-' + dd;
	}

	this.addNewDebt = function(newDebt){

		var self = this;
		
		$http({
		  	method: 'POST',
		  	url: 'actions.php',
		  	params: {action:'addDebt', debt:newDebt}
		}).then(function(response){

			var data = response.data;
			log.Green(data, 'data');

			log.Green(newDebt, 'newDebt')
			log.Green(data, 'data')

			self.debts.debt.unshift(data);

		}, function(error){

			log.red(error)

		});

	}

	this.addNewRecurrenteDebt = function(newDebt){

		var self = this;
		
		log.violet(newDebt, 'services : addNewRecurrenteDebt()');

		var day = newDebt.recurrence.type==='month' ? newDebt.recurrence.date : newDebt.recurrence.day
		
		$http({
		  	method: 'POST',
		  	url: 'actions.php',
		  	params: {action:'addRecurrenteDebt', type:newDebt.recurrence.type, day:day, debt:newDebt}
		}).then(function(response){

		}, function(error){

			log.red(error)

		});

	}

	this.updateDebt = function(updatedDebt){

		var self = this;

		/*for (var i = 0; i < self.debts.length; i++) {
			if(self.debts[i].id_credit===updatedDebt.id_credit) self.debts[i] = angular.copy(updatedDebt);
		}*/
	
		$http({
		  	method: 'POST',
		  	url: 'actions.php',
		  	params: {action:'updateDebt', debt:updatedDebt}
		}).then(function(response){

			var newDebt = response.data;

			for (var i = 0; i < self.debts.debt.length; i++) {
				if(self.debts.debt[i].id_credit===updatedDebt.id_credit) self.debts.debt[i] = newDebt;
			}

		}, function(error){

			log.red(error)

		});

	}

	this.removeDebt = function(debt_id){

		var self = this;

		$http({
		  	method: 'POST',
		  	url: 'actions.php',
		  	params: {action:'removeDebt', debt_id:debt_id}
		}).then(function(response){

			for (var i = 0; i < self.debts.debt.length; i++) {
				if(self.debts.debt[i].id_credit==debt_id) self.debts.debt.splice(i,1);
			}

		}, function(error){

			log.red(error)

		});

	}

	this.paidDebt = function(id_credit, id_debit, date){

		var self = this;

		$http({
		  	method: 'POST',
		  	url: 'actions.php',
		  	params: {action:'paidDebt', id_debit:id_debit, date:date}
		}).then(function(response){

			for (var i = 0; i < self.debts.debt.length; i++) {
				if(self.debts.debt[i].id_credit==id_credit) {

					for (var ii = 0; ii < self.debts.debt[i].user_debit.length; ii++) {

						if(self.debts.debt[i].user_debit[ii].id_debit==id_debit) {
							self.debts.debt[i].user_debit[ii].refund = date;
						}
					}


				}
			}

		}, function(error){

			log.red(error);

		});

	}

});
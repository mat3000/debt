angular.module('app')



.controller('MainCtrl', function(UserService, $rootScope, $timeout){

	$rootScope.Dialog = {

		status: 'hidden',
		view: '',
		data: {},
		show: function(view, data){


			var self = this;

			self.view = view;

			if(view==='update'){

				$rootScope.$emit('newDebt', angular.copy(data) );
				

				self.status = 'visible';


			}else if(view==='date'){

				$rootScope.$emit('newDebt', angular.copy(data));
				
				self.status = 'visible';

			}else if(view==='new'){

				$rootScope.$emit('newDebt', {recurrence: {date:'1', day:'1'}});

				/*$rootScope.$emit('newDebt', {

					id_user : '3',
					sum : '100',
					date : '2017-04-12',
					category_id : '2',
					description : 'okokoo',
					user_debit : [
						{
							id_user : '1',
							sum : '60',
							refund : ''
						},
						{
							id_user : '2',
							sum : '40',
							refund : ''
						}
					],
					recurrence: {
						type: 'month',
						date:'1', 
						day:'1'
					}

				});*/
				
				self.status = 'visible';

			}


		},
		loaded: false,
		isLoaded: function(){
			this.loaded = true;
		},
		hide: function(){

			this.loaded = false;
			this.status = 'hidden';

		}
	};

})

.controller('UsersCtrl', function(UserService, $routeParams){

	var self = this;
	self.users = [];
	self.current = null;

	UserService.getUsers(function(data){
		self.users = data;
		// log.green($routeParams)
		self.current = self.users.getUserByName($routeParams.user);

	});

})


.controller('DebtCtrl', function($scope, $rootScope, UserService, $routeParams, $filter, $sce){

	var self = this;

	self.debts = [];
	self.newDebt = {
		debt: {recurrence: {date:'1', day:'1'}}
	}
	self.users = [];
	self.current = {};
	self.categories = [];

	UserService.getDebt(function(data){

		self.debts = data.debt;

		self.users = data.users;
		self.current = self.users.getUserByName($routeParams.user);

		self.categories = data.categories;

	});

	/*UserService.getUsers(function(data){
		self.users = data;
		self.current = data.getUserByName($routeParams.user);
	});*/

	/*UserService.getCategories(function(data){
		self.categories = data;
	});*/

	$rootScope.$on('newDebt', function(event, args) {
		// log.Green(args)
		self.newDebt.debt = args;
	});

	self.total = function(currentUser){

		var filtered = $filter('filter')(self.debts, currentUser, true);
		var total = 0;

		for (var i = 0; i < filtered.length; i++) {
	
			for (var ii = 0; ii < filtered[i].user_debit.length; ii++) {
				
				if(filtered[i].type==='credit' && !filtered[i].user_debit[ii].refund) {
					total += parseFloat(filtered[i].user_debit[ii].sum);
				}
				
				if(filtered[i].type==='debit' && filtered[i].user_debit[ii].id_user===currentUser && !filtered[i].user_debit[ii].refund) {
					total -= parseFloat(filtered[i].user_debit[ii].sum);
				}

			}
			
		}

		if(total>0){

			return 'Au total, on te doit ' + total + '€.';

		}else{
			
			return 'Au total, tu dois ' + Math.abs(total) + '€.';

		}

		

	}

	self.totalByUser = function(userId){

		var filtered = $filter('filterByUser')(self.debts, userId, true);
		var object = {};

		// log.green(filtered, 'filtered')

		// log.green(userId, 'userId')

		for (var i = 0; i < filtered.length; i++) {
	
			for (var ii = 0; ii < filtered[i].user_debit.length; ii++) {
				
				if(filtered[i].type=='credit' && !filtered[i].user_debit[ii].refund) {

					if(filtered[i].user_debit[ii].id_user!=userId) {

						if(!object[filtered[i].user_debit[ii].id_user]) 
							object[filtered[i].user_debit[ii].id_user] = 0;

						// log.green(filtered[i].user_debit[ii].id_user, 'A')

						object[filtered[i].user_debit[ii].id_user] += parseFloat(filtered[i].user_debit[ii].sum);

					}
				
				}
				
				if(filtered[i].type=='debit' && filtered[i].user_debit[ii].id_user==userId && !filtered[i].user_debit[ii].refund) {

					if(!object[filtered[i].id_user]) 
						object[filtered[i].id_user] = 0;

					// log.green(filtered[i].user_debit[ii].id_user, 'B')

					object[filtered[i].id_user] -= parseFloat(filtered[i].user_debit[ii].sum);

				}

			}
			
		}

		var html = '';

		for(var k in object){

			var name = self.users.getUserById(k).name;

			if(object[k]>0){

				html += '<p>' + name.charAt(0).toUpperCase() + name.slice(1) + ' te dois ' + object[k] + '€.</p>';

			}else{

				html += '<p>Tu dois ' + Math.abs(object[k]) + '€ à ' + name.charAt(0).toUpperCase() + name.slice(1) + '.</p>';

			}


		}

    	return $sce.trustAsHtml(html);

	}

	self.getTotal = function(debt){

		if(!this.current) return '?';

    	// calcul total sum
		var total_left = 0;

		if(debt.id_user==this.current.id){ // debit
			for (var i = 0; i < debt.user_debit.length; i++) {
				var user_debit = debt.user_debit[i];
				if(!user_debit.refund) {
					total_left += parseFloat(user_debit.sum);
				}else{
					debt.refunded = user_debit.refund;
				}
			}
		}else{ // credit

			for (var i = 0; i < debt.user_debit.length; i++) {

				var user_debit = debt.user_debit[i];

				if(user_debit.id_user==this.current.id && !user_debit.refund) {
					total_left += parseFloat(user_debit.sum);
				}
				else if(user_debit.id_user==this.current.id){
					debt.refunded = user_debit.refund;
				}
			}
		}

		// credit or debit or null ?
		if(total_left==0) debt.type='null';
		// if(total_left==0) debt.type='';
		else if(debt.id_user==this.current.id) debt.type='credit';
		else debt.type='debit';

		if(/^[0-9]+\.[1-9]{1}$/.test(total_left)) total_left = total_left + '0';

		return total_left;
    
	}


	self.getRefundedSum = function(debt){

    	var that = debt;

		var total_left = 0;
		if(that.id_user==this.current.id){
			for (var i = 0; i < that.user_debit.length; i++) {
				var user_debit = that.user_debit[i];
				total_left += parseFloat(user_debit.sum);
			}
		}else{
			for (var i = 0; i < that.user_debit.length; i++) {
				var user_debit = that.user_debit[i];
				if(user_debit.id_user==this.current.id) {
					total_left += parseFloat(user_debit.sum);
				}
			}
		}

		if(/^[0-9]+\.[1-9]{1}$/.test(total_left)) total_left = total_left + '0';

		return total_left;
	}


	



/////////// FORM ///////////
	
	this.newDebt.dateOptions = {
		maxDate: "+0D",
	    dateFormat: 'dd/mm/yy'
    };

    this.newDebt.date_refunded = Date();

    this.newDebt.getCurrentIdDebit = function(debt){

		self.current = self.users.getUserByName($routeParams.user);

		for (var i = 0; i < debt.user_debit.length; i++) {
			if(debt.user_debit[i].id_user==self.current.id) return debt.user_debit[i].id_debit
		}

		return 0;;
	    
	}

    this.newDebt.checkRefunded = function(){


		if(this.debt.user_debit){

			for (var i = 0; i < this.debt.user_debit.length; i++){
				if(this.debt.user_debit[i].refund) return true;
			}

		}
		return false;
	}

	this.newDebt.checkRequired = function(){
		if(this.debt.user_debit && this.debt.user_debit.length) return false;
		return true;
	}

	this.newDebt.checkChecked = function(user){

		if(this.debt.user_debit){

			for (var i = 0; i < this.debt.user_debit.length; i++){
				if(this.debt.user_debit[i].id_user==user.id) {
					return true;
				}
			}

		}

		return false;

	}

	this.newDebt.checkSum = function(user){

		if(!this.debt.user_debit) this.debt.user_debit = [];
		
		for (var i = 0; i < this.debt.user_debit.length; i++) {
		 	if(this.debt.user_debit[i].id_user===user.id) {
		 		return this.debt.user_debit[i].sum;
		 	}
		}
		
	}

	this.newDebt.updateCheck = function(user){

		if(!this.debt.user_debit) this.debt.user_debit = [];

		// var user_debit = angular.copy(this.user_debit);
		var user_debit = this.debt.user_debit;

		for (var i = 0; i < user_debit.length; i++){

			if(user_debit[i].id_user==user.id) {
				this.debt.user_debit.splice(i, 1);
				this.updateSum();
				return;
			}

		}

		this.debt.user_debit.push({id_user:user.id, sum:user.sum, refund:null});

		this.updateSum();
		
	}

	this.newDebt.updateSum = function(){

		if(!this.debt.user_debit) this.debt.user_debit = [];

		var sum = 0;
		var l = this.debt.user_debit.length;

		if(this.debt.sum) this.debt.sum = this.debt.sum.replace(',', '.');

		sum = (this.debt.sum ? this.debt.sum : 0) / l;
		sum = Math.round(sum*100) / 100;

		// if(/^[0-9]+\.[1-9]{1}$/.test(sum)) sum = sum + '0';

		for (var i = 0; i < this.debt.user_debit.length; i++) {
			this.debt.user_debit[i].sum = sum;
		}

	}

	this.newDebt.balanceSum = function(data){

		if(parseInt(data.sum) > parseInt(this.sum)) data.sum = this.sum;

		var n = 0;
		for (var i = 0; i < this.debt.user_debit.length; i++) {
			if(this.debt.user_debit[i].id_user!==data.id) n++;
		}

		for (var i = 0; i < this.debt.user_debit.length; i++) {
			if(this.debt.user_debit[i].id_user!==data.id)
				this.debt.user_debit[i].sum = (this.debt.sum - data.sum) / n;
			else
				this.debt.user_debit[i].sum = data.sum;
		}

	}

// nouvelle dette
	this.newDebt.addNewDebt = function(){

		this.debt.date = UserService.convertDate(this.debt.date);

		for (var i = 0; i < this.debt.user_debit.length; i++) {

			this.debt.user_debit[i].refund = this.debt.id_user === this.debt.user_debit[i].id_user ? this.debt.date : null
					
		}

		if(this.debt.recurrence && this.debt.recurrence.type){
			// log.green(this.debt, 'addNewRecurrenteDebt')
			UserService.addNewRecurrenteDebt(this.debt);
		}else{
			UserService.addNewDebt(this.debt);
		}

		// this.debt = {recurrence: {date:'1', day:'1'}};
		$rootScope.Dialog.status = 'hidden';

	}

// modifcation dette
	self.newDebt.updateDebt = function(){


		this.debt.date = UserService.convertDate(this.debt.date);

		for (var i = 0; i < this.debt.user_debit.length; i++) {

			this.debt.user_debit[i].refund = this.debt.id_user === this.debt.user_debit[i].id_user ? this.debt.date : null
					
		}

		if(this.debt.recurrence && this.debt.recurrence.type){
			// log.green(this.debt, 'addNewRecurrenteDebt')
			// UserService.addNewRecurrenteDebt(this.debt);
		}else{
			UserService.updateDebt(this.debt);
		}

		$rootScope.Dialog.status = 'hidden';


	}

	self.newDebt.removeDebt = function(id_credit){

		UserService.removeDebt(id_credit);

		$rootScope.Dialog.status = 'hidden';

	}

	self.newDebt.paidDebt = function(){

		UserService.paidDebt(this.debt.id_credit, this.getCurrentIdDebit(this.debt), UserService.convertDate(this.date_refunded));

		$rootScope.Dialog.status = 'hidden';

	}

})


























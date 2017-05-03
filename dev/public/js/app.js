

angular.module('app', ['ngRoute', 'ui.date'])

	.config(function($routeProvider){
		$routeProvider
		.when('/', {templateUrl: 'partials/home.html'})
		// .when('/history/', {templateUrl: 'partials/history.html', controller:'UsersCtrl', controllerAs:'Users'})
		.when('/:user', {templateUrl: 'partials/user.html', controller:'DebtCtrl', controllerAs:'Users'})
		.otherwise({redirectTo: '/'})
	})

	.filter('reorderUser', function() {

		  return function(input, currentUserId, id_user) {

		  	if(input.length==1){
		  		return input;
		  	}

		  	/*if(id_user!==currentUserId && input[0].id_user==currentUserId){
		  		return [input[0]];
		  	}
		  	if(id_user!==currentUserId && input[1].id_user==currentUserId){
		  		return [input[1]];
		  	}*/

		  	if(id_user!==currentUserId && input[0].id_user!=currentUserId){
				return input.slice().reverse();
			}

			if(input[0].id_user==currentUserId && id_user==currentUserId){
				return input.slice().reverse();
			}

			if(input[0].refund && !input[1].refund){
				return input.slice().reverse();
			}

			return input;

		  };

	})

	.filter('filterByUser', function() {

		  return function(input, currentUserId) {

		  	if(!currentUserId) return input;

		  	var out = [];

		  	function search(a){
		  		for (var i = 0; i < a.length; i++) {
		  			if(a[i].id_user == currentUserId) return true;
		  		}
		  		return false;
		  	}

		  	for (var i = 0; i < input.length; i++) {
		  		if(input[i].id_user == currentUserId || search(input[i].user_debit)) out.push(input[i]);
		  	}

			return out;

		  };

	})


	
// require('./directives/dialog.js');
// require('./services/user.js');
// require('./controllers/user.js');

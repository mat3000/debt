angular.module('app')

	.directive('ngDialog', function(){
		return {
			restrict: 'A',
			templateUrl: 'partials/dialog.html',
			// controller: 'DebtCtrl',
			// controllerAs: 'Users'
		}
	})

	.directive('ngActive', function($location){

       	return {
			restrict: 'A',
		    link: function($scope, element, attrs, controller) {
		
				var path = attrs.href.replace('#!','');
				
				$scope.location = $location;

				$scope.$watch('location.path()', function (newPath) {

					if (path == newPath) {
						element.addClass('active');
					} else {
						element.removeClass('active');
					}

				});
		    }
		};

    });

	/*.directive('ngLoad', function($parse){

        return {
            restrict: 'A',
            compile: function($element, attr) {

            	log.Green('okoko')

                var fn = $parse(attr['ngLoad']);

                return function(scope, element, attr) {
                    // element.on('load', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    // });
                };

            }
        };

        return {
			restrict: 'A',
		    templateUrl: function(elem, attr) {
		    	log.Green('attr')
		      	// return 'customer-' + attr.type + '.html';
		    }
		};

    });*/
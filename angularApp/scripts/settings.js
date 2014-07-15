(function() {

var SettingsModule = angular.module('Settings', []);

SettingsModule.controller('SettingsController', ['$scope', '$resource', '$http',
	function($scope, $resource, $http) {

		$scope.user = $resource("/users/info").get();
		$scope.userSettings = $resource("/users/settings", null, 
			{ 
				save:
				{ 
					method: 'PUT',
					isArray: false,
					transformRequest: [function(data, headersGetter){
						console.log("outgoing");
						console.log(data);
						return {'user': data};

					}].concat($http.defaults.transformRequest)
				},
			}).get();

		$scope.userSettings.$promise.then(function(data) {
			console.log(data);
		});

		$scope.saveSettings = function() {
			console.log($scope.userSettings);
			$scope.userSettings.$save();
		};

	}]);

})()
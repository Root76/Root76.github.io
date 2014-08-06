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

			$scope.userSettings.$save().then(function(){
				$scope.loadContacts();
			});
		};

    	var settingIcons = $('.itemcount');
    	new Opentip(settingIcons[0], "Contacts", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[1], "Events", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[2], "Tasks", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[3], "Tags", {
            style: "lefttip"
        });

	}]);

})()
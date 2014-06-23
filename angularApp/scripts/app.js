function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}

var query_string = QueryStringToJSON();

//var authToken = query_string.authentication_token;
//var userEmail = query_string.user_email;

var authToken = '4N9-_NWfYvYxpesMVpne';
var authEmail = 'hweaver@evenspring.com';

(function(){

	var app = angular.module('DayWonApplication', ['ui.router', 'ui.bootstrap', 'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 'Routing', 'CreateModule']);

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		//$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
		function($scope, $resource, $modal, contactService, tagService, taskService, eventService) {

			eventService.Events.get(function(data){
				$scope.events = data.events;
			});
			
			taskService.Tasks.get(function(data){
				$scope.tasks = data.tasks;
			});

			tagService.Tags.get(function(data){
				$scope.tags = data.tags;
			});			
			
			contactService.Contacts.query(function(data) {
				$scope.contacts = data;
			});

			$scope.create = function()
			{
				var modalInstance = $modal.open({
					templateUrl: 'templates/create.html',
					controller: 'CreationController',
					resolve : {
						contacts : function() { return $scope.contacts; },
						events : function() { return $scope.events; },
						tasks : function() { return $scope.tasks; },
						tags : function() { return $scope.tags; }
					}
				});

				modalInstance.result.then(function(newContact) {
					console.log(newContact);
					contactService.Contacts.create(newContact);
				});
			}

		}]);

	app.controller('ContactsController', ['$resource', '$scope', 'contactService',
		function($resource, $scope, contactService) {
			contactService.Contacts.query(function(data) {
				$scope.contacts = data;
			});
		}]);

	app.controller('EventsController', ['$resource', '$scope', 'eventService',
		function($resource, $scope, eventService) {
			eventService.Events.get(function(data){
				$scope.events = data.events;
			});
		}]);

	app.controller('TasksController', ['$resource', '$scope', 'taskService',
		function($resource, $scope, taskService) {
			taskService.Tasks.get(function(data){
				$scope.tasks = data.tasks;
			});
		}]);

	app.controller('TagsController', ['$resource', '$scope', 'tagService',
		function($resource, $scope, tagService) {
			tagService.Tags.get(function(data){
				$scope.tags = data.tags;
			});	
		}]);


})();
(function(){

	var EventsModule = angular.module('Events', ['ngResource', 'EventServices']);

	EventsModule.controller('EventsController', ['$resource', '$scope', 'eventService',
		function($resource, $scope, eventService) {

		}]);

	EventsModule.controller('EventController', ['$resource', '$scope', '$stateParams', 'eventService',
		function($resource, $scope, $stateParams, eventService) {

			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;

			$scope.eventPromise = eventService.Event.get({event_id: $stateParams['event_id']}, function(data) {
				console.log(data);
				$scope.event = data;
			});
		}]);
})();
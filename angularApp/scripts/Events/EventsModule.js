(function(){

	var EventsModule = angular.module('Events', ['ngResource', 'EventServices']);

	EventsModule.controller('EventsController', ['$resource', '$scope', 'eventService',
		function($resource, $scope, eventService) {

		}]);

	EventsModule.controller('EventController', ['$resource', '$scope', '$stateParams', 'eventService',
		function($scope, $resource, $stateParams, eventService) {

		}]);
})();
(function() {

var OrphansModule = angular.module('Orphans', ['ContactServices', 'TagServices', 'TaskServices', 'EventServices']);

OrphansModule.controller('OrphansController', ['$scope', '$resource', 
	function($scope, $resource) {

		$scope.eventOrphans = [];
		$scope.taskOrphans = [];
		$scope.tagOrphans = [];
		
		$scope.orphansPromise = $resource(baseURL + "/orphans").get();

		$scope.orphansPromise.$promise.then(function(data) {

			$scope.eventOrphans = data.orphans[0].events;
			$scope.taskOrphans = data.orphans[0].tasks;
			$scope.tagOrphans = data.orphans[0].tags;
		});
	}]);

OrphansModule.controller('OrphanEventController', ['$scope', '$resource', '$stateParams', '$state', 'eventService',
	function($scope, $resource, $stateParams, $state, eventService) {

		$scope.orphansPromise.$promise.then(function(data) {

			for(var i = 0; i < data.orphans[0].events.length; i++)
			{
				if(data.orphans[0].events[i].id ==  $stateParams['event_id'])
				{
					$scope.event = data.orphans[0].events[i]; 
					console.log($scope.event);
					break;		
				}
			}
		});		

		$scope.associatedObjects = [];

		$scope.onSelect = function ($item, $model, $label) {

			$scope.associatedObjects.push($model);
		}

		$scope.removeObject = function(object) {
			var index = $scope.associatedObjects.indexOf(object);

			if(index > -1)
				$scope.associatedObjects.splice(index, 1);
		}

		$scope.submitAssociations = function() {

			eventService.Event.get({event_id: $scope.event.id}, function(data) {
				
				console.log(data);
				$scope.updatedEvent = data;

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						$scope.updatedEvent.contacts.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "task")
						$scope.updatedEvent.tasks.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "tag")
						$scope.updatedEvent.tags.push($scope.associatedObjects[i]);
				}

				$scope.updatedEvent.$save();

				var index = $scope.eventOrphans.indexOf($scope.event);

				if(index > -1)
					$scope.eventOrphans.splice(index, 1);

				$state.go('orphanEvents.index');
			});
			
		};

	}]);

})()
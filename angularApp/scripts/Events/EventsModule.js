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

			$scope.recurrenceValues = [
				{ value : true,  description : "Yes" },
				{ value : false, description : "No" }
			];

			$scope.eventStart = {
				startDate : new Date(),
				startTime: new Date()
			};

			$scope.open = function($event) {
		      $event.preventDefault();
		      $event.stopPropagation();
		      
		      $scope.startDateOpened = !($scope.startDateOpened);
		    };

			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "contact")
					$scope.event.contacts.push($model);
				if($model.type == "task")
					$scope.event.tasks.push($model);
				if($model.type == "tag")
					$scope.event.tags.push($model);

				$scope.event.$save();
			}

			$scope.removeContact = function(contact) {
			
				index = $scope.event.contacts.indexOf(contact);
				$scope.event.contacts.splice(index, 1);					

				$scope.event.$save();
			}

			$scope.removeTask = function(task) {

				index = $scope.event.tasks.indexOf(task);
				$scope.event.tasks.splice(index, 1);					

				$scope.event.$save();	
			}

			$scope.removeTag = function(tag) {	

				index = $scope.event.tags.indexOf(tag);
				$scope.event.tags.splice(index, 1);					

				$scope.event.$save();
			}

			$scope.saveEvent = function() {
				console.log($scope.event);
				$scope.event.$save();
			}
		}]);
})();
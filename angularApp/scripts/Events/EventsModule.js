(function(){

	var EventsModule = angular.module('Events', ['ngResource', 'EventServices']);

	EventsModule.controller('EventsController', ['$resource', '$scope', '$state', 'eventService',
		function($resource, $scope, $state, eventService) {

			$scope.EventShow = ['All', 'Tagged', 'New This Week', 'New This Month', 'Recent'];

			$scope.EventFilter = $scope.EventShow[0];

			$scope.updateEventList = function() {

				console.log("chosen filter");
				console.log($scope.EventFilter);
				$scope.FilteredEvents = new Array();

				var today = moment().format('YYYYMMDDHHMMSS');
				var lastMonth = moment().subtract('months', 1).calendar();
				lastMonth = moment(lastMonth).format('YYYYMMDDHHMMSS');
				console.log("last month: " + lastMonth);
				var thisDate;

				if ($scope.EventFilter === "All") {
					$scope.FilteredEvents = $scope.AllFilteredEvents;
				}
				else if ($scope.EventFilter === "Tagged") {
					for (var i = 0; i < $scope.events.length; i++) {
						if ($scope.events[i]['tagcount'] > 0) {
							$scope.FilteredEvents.push($scope.events[i]);
						}
					}					
				}
				else if ($scope.EventFilter === "New This Week") {
					for (var i = 0; i < $scope.events.length; i++) {
						if ($scope.events[i]['status'] == true) {
							$scope.FilteredEvents.push($scope.events[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredEvents);
						}
					}					
				}
				else if ($scope.EventFilter === "New This Month") {
					for (var i = 0; i < $scope.events.length; i++) {
						if ($scope.events[i]['status'] == true) {
							$scope.FilteredEvents.push($scope.events[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredEvents);
						}
					}					
				}
				else if ($scope.EventFilter === "Recent") {
					$scope.EventList = $scope.events;
					$scope.EventList.sort(function(a, b) {
						if (a.updated_at < b.updated_at) {
							return 1;
						}
						if (a.updated_at > b.updated_at) {
							return -1;
						}
						return 0;
					});
					for (var i = 0; i < 10; i++) {
						$scope.FilteredEvents.push($scope.EventList[i]);
						console.log("status was true, pushing to array");
						console.log($scope.FilteredEvents);
					}					
				}

			}

			$scope.deleteEvent = function(event){

				var index;

				for(var i = 0; i < $scope.FilteredEvents.length; i++)
					if($scope.FilteredEvents[i].id == event.id)
						index = i;

				if(index > -1)
				{
					console.log("Remove index: " + index)
					console.log($scope.FilteredEvents);
					$scope.FilteredEvents.splice(index, 1);
					$scope.updateEventList();
					console.log($scope.FilteredEvents);
				}

				eventService.Event.delete({event_id:event.id});

				$state.go('events.index');
			}

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
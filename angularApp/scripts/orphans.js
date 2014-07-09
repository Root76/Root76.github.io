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

			$scope.FilteredOrphanEvents = new Array();
			var eventTitles = new Array();
			var processedEvents = new Array();
			var thisTitle, thisDate, duplicateEvents, titleCount, duplicateCount;
			var todayRaw = moment().format('YYYYMMDDHHMMSS')

			for (var i = 0; i < $scope.eventOrphans.length; i++) {

				duplicateEvents = new Array();
				thisTitle = $scope.eventOrphans[i]['title'];
				titleCount = 0;
				duplicateCount = 0;

				if (processedEvents.indexOf(thisTitle) < 0) {

					$scope.eventOrphans.forEach(function(event){
						if (event.title == thisTitle) {
							titleCount++;
							duplicateEvents.push(event);
							if (titleCount == 1) {
								processedEvents.push(thisTitle);
							}
						}
					});

					duplicateEvents.sort(function(a, b) {
						if (a.start_datetime < b.start_datetime) {
							return -1;
						}
						if (a.start_datetime > b.start_datetime) {
							return 1;
						}
						return 0;
					});
					
					if (titleCount == 1) {
						$scope.FilteredOrphanEvents.push($scope.eventOrphans[i]);
					}
					else if (titleCount > 1) {
						duplicateEvents.forEach(function(event){
							if (todayRaw < moment(event.start_datetime).format('YYYYMMDDHHMMSS') && duplicateCount == 0) {
								$scope.FilteredOrphanEvents.push(event);
								duplicateCount++;
							}
						});
					}

				}

			}
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

		$scope.submitEventAssociations = function() {

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

OrphansModule.controller('OrphanTaskController', ['$scope', '$resource', '$stateParams', '$state', 'taskService',
	function($scope, $resource, $stateParams, $state, taskService) {

		$scope.orphansPromise.$promise.then(function(data) {

			for(var i = 0; i < data.orphans[0].tasks.length; i++)
			{
				if(data.orphans[0].tasks[i].id ==  $stateParams['task_id'])
				{
					$scope.task = data.orphans[0].tasks[i]; 
					console.log($scope.task);
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

			taskService.Task.get({task_id: $scope.task.id}, function(data) {
				
				console.log(data);
				$scope.updatedTask = data;

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						$scope.updatedTask.contacts.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "event")
						$scope.updatedTask.events.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "tag")
						$scope.updatedTask.tags.push($scope.associatedObjects[i]);
				}

				$scope.updatedTask.$save();

				var index = $scope.taskOrphans.indexOf($scope.task);

				if(index > -1)
					$scope.taskOrphans.splice(index, 1);

				$state.go('orphanTasks.index');
			});
			
		};

	}]);

OrphansModule.controller('OrphanTagController', ['$scope', '$resource', '$stateParams', '$state', 'tagService',
	function($scope, $resource, $stateParams, $state, tagService) {

		$scope.orphansPromise.$promise.then(function(data) {

			for(var i = 0; i < data.orphans[0].tags.length; i++)
			{
				if(data.orphans[0].tags[i].id ==  $stateParams['tag_id'])
				{
					$scope.tag = data.orphans[0].tags[i]; 
					console.log($scope.tag);
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

			tagService.Tag.get({tag_id: $scope.tag.id}, function(data) {
				
				console.log(data);
				$scope.updatedTag = data;

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						$scope.updatedTag.contacts.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "event")
						$scope.updatedTag.events.push($scope.associatedObjects[i]);
					if($scope.associatedObjects[i].type == "task")
						$scope.updatedTag.tasks.push($scope.associatedObjects[i]);
				}

				$scope.updatedTag.$save();

				var index = $scope.tagOrphans.indexOf($scope.tag);

				if(index > -1)
					$scope.tagOrphans.splice(index, 1);

				$state.go('orphanTags.index');
			});
			
		};

	}]);
})()
(function() {

	var TasksModule = angular.module('Tasks', ['ngResource', 'TaskServices']);
	
	TasksModule.controller('TasksController', ['$resource', '$scope', 'taskService',
		function($resource, $scope, taskService) {
			
			$scope.deleteTask = function(task){
				taskService.Task.delete({task_id:task.id});
			}

			$scope.TaskSort = [
				{title: 'Tasks with no dates', prop: 'due'}, 
				{title: 'Tasks with dates', prop: '-due'},
				{title: 'Priority', prop: 'priority'}, 
				{title: 'Alphabetical', prop: 'title'}
			];

			$scope.TaskOrder = $scope.TaskSort[0];
			
		}]);

	TasksModule.controller('TaskController', ['$resource', '$scope', '$stateParams','taskService',
		function($resource, $scope, $stateParams, taskService) {
			
			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;

			$scope.taskPromise = taskService.Task.get({task_id: $stateParams['task_id']}, function(data) {
				console.log(data);
				$scope.task = data;
			});

			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "contact")
					$scope.task.contacts.push($model);
				if($model.type == "event")
					$scope.task.events.push($model);
				if($model.type == "tag")
					$scope.task.tags.push($model);

				$scope.task.$save();
			}

			$scope.removeContact = function(contact) {
			
				index = $scope.task.contacts.indexOf(contact);
				$scope.task.contacts.splice(index, 1);					

				$scope.task.$save();
			}

			$scope.removeEvent = function(event) {

				index = $scope.task.events.indexOf(event);
				$scope.task.events.splice(index, 1);					

				$scope.task.$save();	
			}

			$scope.removeTag = function(tag) {	

				index = $scope.task.tags.indexOf(tag);
				$scope.task.tags.splice(index, 1);					

				$scope.task.$save();
			}

			$scope.saveTask = function() {
				console.log($scope.task);
				$scope.task.$save();
			}
		}]);

})();
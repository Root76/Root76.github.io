(function() {

	var TasksModule = angular.module('Tasks', ['ngResource', 'TaskServices']);
	
	TasksModule.controller('TasksController', ['$resource', '$scope', 'taskService',
		function($resource, $scope, taskService) {

		}]);

	TasksModule.controller('TaskController', ['$resource', '$scope', '$stateParams','taskService',
		function($resource, $scope, $stateParams, taskService) {
			
			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;

			$scope.taskPromise = taskService.Task.get({task_id: $stateParams['task_id']}, function(data) {
				console.log(data);
				$scope.task = data;
			});

			$scope.TaskSort = [
				{title: 'Tasks with no dates', prop: 'due'}, 
				{title: 'Tasks with dates', prop: '-due'},
				{title: 'Priority', prop: 'priority'}, 
				{title: 'Alphabetical', prop: 'title'}
			];

			$scope.TaskOrder = $scope.TaskSort[0];

		}]);

})();
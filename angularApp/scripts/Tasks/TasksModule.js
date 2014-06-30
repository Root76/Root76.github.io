(function() {

	var TasksModule = angular.module('Tasks', ['ngResource', 'TaskServices']);
	
	TasksModule.controller('TasksController', ['$resource', '$scope', 'taskService',
		function($resource, $scope, taskService) {

		}]);

	TasksModule.controller('TaskController', ['$resource', '$scope', '$stateParams','taskService',
		function($resource, $scope, $stateParams, taskService) {
			
			$scope.taskPromise = taskService.Task.get({task_id: $stateParams['task_id']}, function(data) {
				console.log(data);
				$scope.task = data;
			});

		}]);

})();
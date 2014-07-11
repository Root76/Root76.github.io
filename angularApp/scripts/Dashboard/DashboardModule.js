

(function(){

	var dashboardModule = angular.module('DashboardModule', []);

	dashboardModule.controller('DashboardController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
	function($scope, $resource, $modal, contactService, tagService, taskService, eventService){
		console.log("YOU'RE ON DASH");
		$('.subitem.subdash.ss2').addClass('fadeInto');

		$scope.TaskShow = ['Open Tasks', 'Overdue', 'Today & Overdue', 'Next 7 Days'];

		$scope.TaskFilter = 'Overdue';

		$scope.updateTaskList = function() {
			
			console.log("chosen filter");
			console.log($scope.TaskFilter);
			$scope.FilteredTasks = new Array();
			var today = moment().format('MMMM Do YYYY');

			if ($scope.TaskFilter === "Open Tasks") {
				for (var i = 0; i < $scope.tasks.length; i++) {
					if ($scope.tasks[i]['status'] == false) {
						$scope.FilteredTasks.push($scope.tasks[i]);
						console.log($scope.FilteredTasks);
					}
				}
			}
			else if ($scope.TaskFilter === "Overdue") {
				for (var i = 0; i < $scope.tasks.length; i++) {
					if ($scope.tasks[i]['status'] == true) {
						$scope.FilteredTasks.push($scope.tasks[i]);
						console.log($scope.FilteredTasks);
					}
				}					
			}
			else if ($scope.TaskFilter === "Today & Overdue") {
				var taskDate;
				for (var i = 0; i < $scope.tasks.length; i++) {
					taskDate = moment($scope.tasks[i]['due']).format('MMMM Do YYYY');
					if ($scope.tasks[i]['status'] == true || taskDate == today) {
						$scope.FilteredTasks.push($scope.tasks[i]);
					}
				}					
			}
			else if ($scope.TaskFilter === "Next 7 Days") {
				var taskDate;
				var day2 = moment().add('days', 1).format('MMMM Do YYYY');
				var day3 = moment().add('days', 2).format('MMMM Do YYYY');
				var day4 = moment().add('days', 3).format('MMMM Do YYYY');
				var day5 = moment().add('days', 4).format('MMMM Do YYYY');
				var day6 = moment().add('days', 5).format('MMMM Do YYYY');
				var day7 = moment().add('days', 6).format('MMMM Do YYYY');
				var next7Days = [today, day2, day3, day4, day5, day6, day7];
				console.log(next7Days);
				for (var i = 0; i < $scope.tasks.length; i++) {
					taskDate = moment($scope.tasks[i]['due']).format('MMMM Do YYYY');
					if (next7Days.indexOf(taskDate) > -1) {
						$scope.FilteredTasks.push($scope.tasks[i]);
						console.log($scope.FilteredTasks);
					}
				}		
			}
		}
		
	}]);

})();

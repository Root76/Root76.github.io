(function() {

	var TasksModule = angular.module('Tasks', ['ngResource', 'TaskServices']);
	
	TasksModule.controller('TasksController', ['$resource', '$scope', '$state', 'taskService',
		function($resource, $scope, $state, taskService) {
			
			$scope.deleteTask = function(task){

				var index;
				if($scope.FilteredTasks)
				{
					for(var i = 0; i < $scope.FilteredTasks.length; i++)
						if($scope.FilteredTasks[i].id == task.id)
							index = i;

					if(index > -1)
					{
						$scope.FilteredTasks.splice(index, 1);				
					}

					taskService.Task.delete({task_id:task.id});
					$scope.loadOrphans();
					$state.go('tasks.index');
				}
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


				$scope.importListTaskStatus = function(tasks)
				{
					if(tasks)
						for(var i = 0; i < tasks.length; i++)
						{
							if($scope.task.id == tasks[i].id)
							{
								if($scope.task.status != tasks[i].status)
								{
									$scope.task.status = tasks[i].status;
									$scope.saveTask();
								}	

								break;
							}
						}
				}

				$scope.$on('reimportListTaskStatus', function(e) {
					$scope.importListTaskStatus($scope.tasks);
				});

				$scope.importListTaskStatus($scope.tasks);


				setTimeout(function(){
		            new Opentip("#detailmenubar > *:nth-child(5) > img", "Task Completed", {
		                style: "bottomtip"
		            }); 
				}, 100);


		        $(".trashicon").each(function() {
		  			new Opentip($(this), "Delete", {
		                style: "bottomtip"
		            });
		        	$(this).bind("click", function(){

			            var deleteTip = new Opentip($(this), "<p>Are you sure you want to delete this item?</p><br /><div class='deleteContainer'><div>Yes</div><div>No</div></div>", {
			                style: "deleteconfirm"
			            });
			        	deleteTip.show();
			            setTimeout(function(){
			                $(".deleteContainer > div:first-child").click(function(){
			                    deleteTip.hide();
			                    $scope.deleteTask($scope.task);
			                    var deleteTip2 = new Opentip("#taskpane1 > img", '<span>Item deleted.</span>', {
			                        style: "deleteconfirm2"
			                    });
			          			deleteTip2.show();
			                    setTimeout(function(){
			                        deleteTip2.hide();
			                    }, 1500);
			                });
			                $(".deleteContainer > div:last-child").click(function(){
			                    deleteTip.hide();
			                });
			            }, 100);
			        });
		        });
				
			});


			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "contact")
					$scope.task.contacts.push($model);
				if($model.type == "event")
					$scope.task.events.push($model);
				if($model.type == "tag")
				{
					$scope.task.tags.push($model);
					for(var i = 0; i < $scope.tasks.length; i++)
					{
						if($scope.tasks[i].id == $scope.task.id)
						{
							$scope.tasks[i].tags++
							break;
						}	
					}
				}

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

			$scope.open = function($event) {
		      $event.preventDefault();
		      $event.stopPropagation();

		      $scope.dateOpened = !($scope.dateOpened);
		    };

			$scope.taskDateChanged = function() {
				$scope.task.$save();
			};

			$scope.saveTask = function() {

				for(var i = 0; i < $scope.tasks.length; i++)
				{
					if($scope.tasks[i].id == $scope.task.id)
					{
						$scope.tasks[i].title = $scope.task.title
						break;
					}
				}

				console.log($scope.task);
				$scope.task.$save();
			}
		}]);

})();
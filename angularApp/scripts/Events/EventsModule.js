(function(){

	var EventsModule = angular.module('Events', ['ngResource', 'EventServices']);

	EventsModule.controller('EventsController', ['$resource', '$scope', '$state', 'eventService',
		function($resource, $scope, $state, eventService) {

			$scope.EventShow = ['All', 'Tagged', 'New This Week', 'New This Month', 'Recent'];
			$scope.EventFilter = $scope.EventShow[0];

			var today = moment().format('YYYYMMDDHHMMSS');
			var lastWeek = moment().subtract('days', 7).calendar();
			lastWeek = moment(lastWeek).format('YYYYMMDDHHMMSS');
			var lastMonth = moment().subtract('months', 1).calendar();
			lastMonth = moment(lastMonth).format('YYYYMMDDHHMMSS');
			var thisCreateDate;

			$scope.updateEventList = function() {

				console.log("chosen filter");
				console.log($scope.EventFilter);
				$scope.FilteredEvents = new Array();

				if ($scope.EventFilter === "All") {
					$scope.FilteredEvents = $scope.AllFilteredEvents;
				}
				else if ($scope.EventFilter === "Tagged") {
					for (var i = 0; i < $scope.events.length; i++) {
						if($scope.events[i].title == "wimbledon 4")
							console.log($scope.events[i]);
						if ($scope.events[i]['tags'] > 0) {
							$scope.FilteredEvents.push($scope.events[i]);
						}
					}					
				}
				else if ($scope.EventFilter === "New This Week") {
					for (var i = 0; i < $scope.AllFilteredEvents.length; i++) {
						thisCreateDate = moment($scope.AllFilteredEvents[i]['created_at']).format('YYYYMMDDHHMMSS');
						if (thisCreateDate > lastWeek) {
							$scope.FilteredEvents.push($scope.AllFilteredEvents[i]);
						}
					}					
				}
				else if ($scope.EventFilter === "New This Month") {
					for (var i = 0; i < $scope.AllFilteredEvents.length; i++) {
						thisCreateDate = moment($scope.AllFilteredEvents[i]['created_at']).format('YYYYMMDDHHMMSS');
						if (thisCreateDate > lastMonth) {
							$scope.FilteredEvents.push($scope.AllFilteredEvents[i]);
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
					$scope.FilteredEvents.splice(index, 1);
					$scope.updateEventList();
				}

				eventService.Event.delete({event_id:event.id});
				$scope.loadOrphans();
				$state.go('events.index');
			}

		}]);

	EventsModule.controller('EventController', ['$resource', '$scope', '$stateParams', 'eventService',
		function($resource, $scope, $stateParams, eventService) {

			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;

			$scope.eventDates = { startDate : new Date(), endDate : new Date() };

			$scope.eventPromise = eventService.Event.get({event_id: $stateParams['event_id']}, function(data) {

				$scope.event = data;

				if($scope.event.is_all_day)
				{
					$scope.eventDates.startDate = new Date($scope.event.start_date);
					$scope.eventDates.endDate = new Date($scope.event.end_date);
				}
				else
				{
					$scope.eventDates.startDate = new Date($scope.event.start_datetime);
					$scope.eventDates.endDate = new Date($scope.event.end_datetime);
				}

				var trash1 = $("#detailPanel .trashicon"),
					trash2 = $("#detailmenubar .trashicon");

				new Opentip(trash1, "Delete", {
					style: "bottomtip"
				});

				new Opentip(trash2, "Delete", {
					style: "toptip"
				});

				$(".trashicon").each(function(){

			        $(this).bind("click", function(){
			            var deleteTip = new Opentip($(this), "<p>Are you sure you want to delete this item?</p><br /><div class='deleteContainer'><div>Yes</div><div>No</div></div>", {
			                style: "deleteconfirm"
			            });
			        	deleteTip.show();
			            setTimeout(function(){
			                $(".deleteContainer > div:first-child").click(function(){
			                    deleteTip.hide();

			                    $scope.deleteEvent($scope.event);
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
				})
				

			});

			$scope.recurrenceValues = [
				{ value : true,  description : "Yes" },
				{ value : false, description : "No" }
			];

			$scope.recurrenceTitle = function(recurrence) {
				if(recurrence) return 'Yes';
				else return 'No';
			}

			$scope.eventDatesChanged = function() {
				console.log("event dates changed!");
				$scope.saveEvent();
			};

			$scope.open = function($event, which) {
		      $event.preventDefault();
		      $event.stopPropagation();

		      if(which == 'start')
		      	$scope.startDateOpened = !($scope.startDateOpened);

		      if(which == 'end')
		      	$scope.endDateOpened = !($scope.endDateOpened);
		    };


			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "contact")
					$scope.event.contacts.push($model);
				if($model.type == "task")
					$scope.event.tasks.push($model);
				if($model.type == "tag")
				{
					$scope.event.tags.push($model);
					for(var i = 0; i < $scope.events.length; i++)
					{
						if($scope.events[i].id == $scope.event.id)
						{
							$scope.events[i].tags++
							break;
						}	
					}
				}

				$scope.saveEvent();
			}

			$scope.removeContact = function(contact) {
			
				index = $scope.event.contacts.indexOf(contact);
				$scope.event.contacts.splice(index, 1);					

				$scope.saveEvent();
			}

			$scope.removeTask = function(task) {

				index = $scope.event.tasks.indexOf(task);
				$scope.event.tasks.splice(index, 1);					

				$scope.saveEvent();
			}

			$scope.removeTag = function(tag) {	

				index = $scope.event.tags.indexOf(tag);
				$scope.event.tags.splice(index, 1);					

				$scope.saveEvent();
			}

			$scope.saveEvent = function() {

				if($scope.event.is_all_day)
				{
					$scope.event.start_date = $scope.eventDates.startDate;
					$scope.event.end_date = $scope.eventDates.endDate;

					console.log($scope.event.start_date);
					console.log($scope.event.end_date);

					$scope.event.start_date.setHours(0);
					$scope.event.start_date.setMinutes(0);
					$scope.event.start_date.setSeconds(0);
					$scope.event.start_date.setMilliseconds(0);
			
					$scope.event.end_date.setHours(0);
					$scope.event.end_date.setMinutes(0);
					$scope.event.end_date.setSeconds(0);
					$scope.event.end_date.setMilliseconds(0);
				}
				else
				{	
					$scope.event.start_datetime = $scope.eventDates.startDate;
					$scope.event.end_datetime = $scope.eventDates.endDate;
				}

				for(var i = 0; i < $scope.events.length; i++)
				{
					if($scope.events[i].id == $scope.event.id)
					{
						$scope.events[i].title = $scope.event.title
						break;
					}
				}


				console.log($scope.event);
				$scope.event.$save();
			}
		}]);
})();
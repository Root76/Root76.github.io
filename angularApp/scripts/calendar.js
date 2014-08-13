(function() {

	var CalendarModule = angular.module("Calendar", ['TaskServices', 'EventServices']);

	CalendarModule.controller('CalendarController', ['$scope', '$resource', 'taskService', 'eventService',
		function($scope, $resource, taskService, eventService) {

			var checkEvents = setInterval(function() {

				if ($scope.events && $scope.tasks) {

					clearInterval(checkEvents);
					var totalEvents = $scope.events;

					console.log(totalEvents.length + "events");

		        	var allTasks = $scope.tasks;
		        	var jsonTask = [];
		        	var j = 0;
		        	for (var i = totalEvents.length; j < allTasks.length; j++) {
		        		totalEvents[i] = allTasks[j];
		        		i++;
		        	}

		        	console.log("with tasks: " + totalEvents.length);

		        	var json = totalEvents;

			        for (var i = 0; i < json.length; i++) {

			        	if (totalEvents[i].hasOwnProperty("start_datetime")) {
			        		totalEvents[i]["start"] = totalEvents[i]["start_datetime"];
			        	} else
			        	if (totalEvents[i].hasOwnProperty("start_date")) {
			        		totalEvents[i]["start"] = totalEvents[i]["start_date"];
			        	} 

			        	if (totalEvents[i].hasOwnProperty("end_datetime")) {
			        		totalEvents[i]["end"] = totalEvents[i]["end_datetime"];
			        	} else
			        	if (totalEvents[i].hasOwnProperty("end_date")) {
			        		totalEvents[i]["end"] = totalEvents[i]["end_date"];
			        	}

			        	if (totalEvents[i].hasOwnProperty("due")) {
			        		console.log("there's a due");
			        		totalEvents[i]['start'] = totalEvents[i]["due"];
			        		totalEvents[i]['end'] = totalEvents[i]["due"];
			        		totalEvents[i]['className'] = 'calTask active';
			        	} else {
			        		totalEvents[i]['className'] = 'calEvent active';
			        	}
			        }

			        $('#calendarcont').fullCalendar({
			            header: {
			                left: 'prev,next today',
			                center: 'title',
			                right: 'month,agendaWeek,agendaDay,agendaList'
			            },
			            editable: true,
			            events: totalEvents,
			            eventClick: function(calItem, jsEvent, view) {

					        var calElement = this;

					        if (calItem.hasOwnProperty('location')) {
								
								$.ajax({
							        type: 'GET',
							        url: 'https://daywon-api-staging.herokuapp.com/events/' + calItem.id,
							        contentType: "application/json",
							        dataType: "json",
							        headers: {
							            "X-AUTHENTICATION-TOKEN": authToken,
							            "X-AUTHENTICATION-EMAIL": authEmail
							        },
							        success: function (data) {

							        	console.log("success");
							        	console.log(data);
							        	var popupContent = '<div class="calPopupTags"><ul>';
							        	var objectTags = data.tags;

							        	for (var i = 0; i < objectTags.length; i++) {
							        		popupContent += '<a href="#/tags/' + objectTags[i].id + '"><li><img src="img/tags.png" /><span>' + objectTags[i].name + '</span></li></a>';
							        	}

							        	popupContent += '</ul></div><div class="calPopupCont"><p><b>Event Description: </b>' + data.description + '</p><p><b>Event Start: </b>' + moment(data.start_datetime).format('MMMM Do YYYY, h:mm:ss a') + '</p><p><b>Event End: </b>' + moment(data.end_datetime).format('MMMM Do YYYY, h:mm:ss a') + '</p></div>';

										var calPopupTemplate = '<a href="#/events/' + data.id + '"><h2>' + data.title + '</h2></a>' + popupContent;
								        
								        new Opentip(calElement, calPopupTemplate, {
						            		style: "calitem",
						            		showOn: "creation",
						            		hideTrigger: "closeButton",
						            		className: "calpop",
						            		background: "#e35d32",
						            		closeButtonRadius: 15,
						            		closeButtonCrossSize: 10,
						            		closeButtonCrossColor: "#ffffff"
						        		});

								    },
							        error: function(e) {
							        	console.log("error: " + e);
							        }
							    });

							} else if (calItem.hasOwnProperty('due')) {

								$.ajax({
							        type: 'GET',
							        url: 'https://daywon-api-staging.herokuapp.com/tasks/' + calItem.id,
							        contentType: "application/json",
							        dataType: "json",
							        headers: {
							            "X-AUTHENTICATION-TOKEN": authToken,
							            "X-AUTHENTICATION-EMAIL": authEmail
							        },
							        success: function (data) {

							        	console.log("success");
							        	console.log(data);
							        	var popupContent = '<div class="calPopupTags"><ul>';
							        	var objectTags = data.tags;

							        	for (var i = 0; i < objectTags.length; i++) {
							        		popupContent += '<a href="#/tags/' + objectTags[i].id + '"><li><img src="img/tags.png" /><span>' + objectTags[i].name + '</span></li></a>';
							        	}

							        	popupContent += '</ul></div><div class="calPopupCont"><p><b>Task notes: </b>' + data.notes + '</p><p><b>Task Due: </b>' + moment(data.due).format('MMMM Do YYYY, h:mm:ss a') + '</p><p><b>Task Priority: </b>' + data.priority + '</p></div>';

										var calPopupTemplate = '<a href="#/tasks/' + data.id + '"><h2>' + data.title + '</h2></a>' + popupContent;
								        
								        new Opentip(calElement, calPopupTemplate, {
						            		style: "calitem",
						            		showOn: "creation",
						            		hideTrigger: "closeButton",
						            		className: "calpop",
						            		background: "#88c44c",
						            		closeButtonRadius: 15,
						            		closeButtonCrossSize: 10,
						            		closeButtonCrossColor: "#ffffff"
						        		});	

								    },
							        error: function(e) {
							        	console.log("error: " + e);
							        }
							    });

							}
					    }
			        });

			        $('.calchoice').click(function(event){
			            if ($(event.target).hasClass('selected')) {
			                console.log('already selected');
			            } else {
			                $(event.target).parent().find('.selected').removeClass('selected');
			                $(event.target).addClass('selected');
			                var timeView = $(event.target).html();
			                timeView = timeView.toLowerCase();
			                if (timeView == "today") {
			                    timeView = "day";
			                }
			                if (timeView == "list") {
			                    timeView = "Agenda";
			                    $("#calToday").addClass("hidden");
			                    $(".fc-header-left").addClass("hidden");
			                    $(".fc-header-center").addClass("hidden");
			                } else {
			                    $("#calToday").removeClass("hidden");
			                    $(".fc-header-left").removeClass("hidden");
			                    $(".fc-header-center").removeClass("hidden");
			                }
			                $( "span:contains('" + timeView + "')" ).click();
			            }
			        });

			        $('#calToday').click(function() {
			            $('.fc').fullCalendar('today');
			        });

			        $('.showitem').unbind("click").bind("click", function(event){
			            var subSortType = event.target.id;
			            if ($(event.target).hasClass('selected')) {
			                $(event.target).removeClass('selected');
			                $("#calendarcont").addClass(subSortType);
			            } else {
			                $(event.target).addClass('selected');
			                $("#calendarcont").removeClass(subSortType);
			            }
			        });

				}

			}, 1000);

		}]);
})();

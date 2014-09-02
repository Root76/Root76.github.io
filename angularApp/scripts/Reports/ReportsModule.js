
var reportsModule = angular.module('ReportsModule', []);

reportsModule.controller('ReportsController', ['$scope', '$resource', '$modal', 'contactService', 'eventService', 'taskService', 'tagService', 
	function($scope, $resource, $modal, contactService, eventService, taskService, tagService) {


	setTimeout(function(){

        var today = moment().format('MMDDYY');
        var tomorrow = moment().add('days', 1).format('MMDDYY');
        var endOfThisWeek = moment().add('days', 7).format('MMDDYY');
        var endOfNextWeek = moment().add('days', 14).format('MMDDYY');

        $scope.contactsFullRelations = $resource('/search?show=contacts&include[]=tasks&include[]=events&include[]=tags&sort=asc').get();
        $scope.eventsFullRelations = $resource('/search?show=events&include[]=tasks&include[]=contacts&include[]=tags&sort=asc').get();
        $scope.tasksFullRelations = $resource('/search?show=tasks&include[]=contacts&include[]=events&include[]=tags&sort=asc').get();
        $scope.tagsFullRelations = $resource('/search?show=tags&include[]=contacts&include[]=events&include[]=tasks&sort=asc').get();

        $scope.ScheduleShow = ['All Open Activities', 'Today', 'Tomorrow', 'This Week', 'Next Week'];
        $scope.ScheduleFilter = $scope.ScheduleShow[0];


        $scope.$on('reimportListTaskStatus', function(e) {
        });

        extractDates = function(object) {
            //Extract the dates associated with the object
            var objectDates = [];

            //Extract event dates
            if(object.events) {
                var events = object.events;

                for(var j = 0; j < events.length; j++) {

                    if(events[j].is_all_day) {
                        if(events[j].start_date) { objectDates.push(events[j].start_date); }
                        if(events[j].end_date) { objectDates.push(events[j].end_date); }
                    } 
                    else {
                        if(events[j].start_datetime) { objectDates.push(events[j].start_datetime); }
                        if(events[j].end_datetime) { objectDates.push(events[j].end_datetime); }
                    }
                }
            }

            //Extract Task dates
            if(object.tasks) {

                var tasks = object.tasks;

                for(var j = 0; j < tasks.length; j++) {
                    if(tasks[j].due) { objectDates.push(tasks[j].due); }
                }
            }

            //Extract inherent dates on the object itself
           if(object.is_all_day) {
                if(object.start_date) { objectDates.push(object.start_date); }
                if(object.end_date) { objectDates.push(object.end_date); }
            } 
            else {
                if(object.start_datetime) { objectDates.push(object.start_datetime); }
                if(object.end_datetime) { objectDates.push(object.end_datetime); }
            }

            if(object.due) { objectDates.push(object.due); }


            return objectDates;
        }

        filterObjectData = function(FilteredObjects, data) {

            var contactDates = [];
            for(var i = 0; i < data.length; i++) 
            {
                var dates = extractDates(data[i]);
                for(var j = 0; j < dates.length; j++) {
                    var date = moment(dates[j]).format('MMDDYY');

                    //If the date logic matches the filter, add that object
                    if( ($scope.ScheduleFilter == 'Today'     && date == today)    ||
                        ($scope.ScheduleFilter == 'Tomorrow'  && date == tomorrow) ||
                        ($scope.ScheduleFilter == 'This Week' && today <= date && date <= endOfThisWeek) ||
                        ($scope.ScheduleFilter == 'Next Week' && endOfThisWeek < date && date <= endOfNextWeek) )
                    {
                        if(FilteredObjects.indexOf(data[i]) < 0)
                        {
                            console.log(dates);
                            console.log(data[i]);
                            FilteredObjects.push(data[i]);
                        }
                    }
                }
            
            }
        }

        $scope.updateSchedule = function() {

            $scope.FilteredContacts = new Array();
            $scope.FilteredEvents = new Array();
            $scope.FilteredTasks = new Array();
            $scope.FilteredTags = new Array();

            $scope.contactsFullRelations.$promise.then(function(data) {
                //Filter the objects based on dates
                if($scope.ScheduleFilter == 'All Open Activities') {
                    $scope.FilteredContacts = data.contacts;
                }
                else {
                    filterObjectData($scope.FilteredContacts, data.contacts);             
                }
                
            });
            $scope.eventsFullRelations.$promise.then(function(data) {
                //Filter the objects based on dates
                if($scope.ScheduleFilter == 'All Open Activities') {
                    $scope.FilteredEvents = data.events;
                }
                else {
                    filterObjectData($scope.FilteredEvents, data.events);             
                }
                
            });
            $scope.tasksFullRelations.$promise.then(function(data) {
                //Filter the objects based on dates
                if($scope.ScheduleFilter == 'All Open Activities') {
                    $scope.FilteredTasks = data.tasks;
                }
                else {
                    filterObjectData($scope.FilteredTasks, data.tasks);         
                }
            });
            $scope.tagsFullRelations.$promise.then(function(data) {
                //Filter the objects based on dates
                if($scope.ScheduleFilter == 'All Open Activities') {
                    $scope.FilteredTags = data.tags;
                }
                else {
                    filterObjectData($scope.FilteredTags, data.tags);             
                }
                
            });

            setTimeout(function(){
                $(".sortitem.selected").click()
                var allAccords = $('.listitem');
                if (allAccords.length > 1) {
                    for (var i = 0; i < allAccords.length; i++) {
                        if (i < 15) {
                            $(allAccords[i]).removeClass('notYet');
                        }
                    }
                } else if (allAccords) {
                    $(allAccords).removeClass('notYet');
                }
            }, 100);
        }

        setTimeout(function(){
            $("#" + previouslySelected).click()
            $scope.showContacts = relatedContacts;
            $scope.showEvents = relatedEvents;
            $scope.showTasks = relatedTasks;
            $scope.showTags = relatedTags;
            console.log($scope.showContacts + " " + $scope.showEvents + " " + $scope.showTasks + " " + $scope.showTags)

            if ($scope.showContacts == false) {
                $("#subContact").removeClass("selected");
            }
            if ($scope.showEvents == false) {
                $("#subEvent").removeClass("selected");
            }
            if ($scope.showTasks == false) {
                $("#subTask").removeClass("selected");
            }
            if ($scope.showTags == false) {
                $("#subTag").removeClass("selected");
            }

        }, 1);

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 155) {
                console.log("you've really hit rock bottom, pal");
                var currentSort = $('.sortitem.selected').attr('id');
                var allItems = $('.listitem.' + currentSort);
                var j = 0;
                for (var i = 0; i < allItems.length; i++) {
                    if (j < 15) {
                        if ($(allItems[i]).hasClass('notYet')) {
                            $(allItems[i]).removeClass('notYet');
                            $(allItems[i]).accordion({
                                active: false,
                                collapsible: true,
                                header: "h3.mainsort"
                            });
                            bindArrow(allItems[i]);
                            $(allItems[i]).addClass('fadeInto');
                            j++;
                        }
                    }
                }
            }
        };

        function bindArrow(thisAccord){
        	$(thisAccord).click(function(){
        		var thisArrow = $(this).find($('.accordionarrow'));
        		if ($(thisArrow).hasClass('arrowdown')) {
        			$(thisArrow).removeClass('arrowdown');
        		} else {
        			$(thisArrow).addClass('arrowdown');
        		}
        	});
        }


        $('#collapseall').click(function(){
            setTimeout(function(){
                var accords = $('.mainsort');
                for (var a = 0; a < accords.length; a++) {
                    accord = accords[a];
                    if ($(accord).attr("aria-selected") == "true") {
                        accord.click();
                    }
                }
                $('.accordionarrow').removeClass('arrowdown');
            }, 100);
        });
        
        $('#expandall').click(function(){
            setTimeout(function(){
                var accords = $('.mainsort');
                for (var a = 0; a < accords.length; a++) {
                    accord = accords[a];
                    if ($(accord).attr("aria-selected") == "false") {
                        accord.click();
                    }
                }
                $('.accordionarrow').addClass('arrowdown');
            }, 100);
        });

        if ($("#subEvent").length) {
            new Opentip("#subEvent", "Events", {
                style: "bottomtip"
            });
        }
        if ($("#subTask").length) {
            new Opentip("#subTask", "Tasks", {
                style: "bottomtip"
            });
        }
        if ($("#subContact").length) {
            new Opentip("#subContact", "Contacts", {
                style: "bottomtip"
            });
        }
        if ($("#subTag").length) {
            new Opentip("#subTag", "Tags", {
                style: "bottomtip"
            });
        }
        if ($("#mainevent").length) {
            new Opentip("#mainevent", "Events", {
                style: "bottomtip"
            });
        }
        if ($("#maintask").length) {
            new Opentip("#maintask", "Tasks", {
                style: "bottomtip"
            });
        }
        if ($("#maincontact").length) {
            new Opentip("#maincontact", "Contacts", {
                style: "bottomtip"
            });
        }
        if ($("#maintag").length) {
            new Opentip("#maintag", "Tags", {
                style: "bottomtip"
            });
        }

		$scope.getObjectDetails = function(object, $event) {

            var thisAccord = $event.currentTarget;
            if (object.type == 'contact') {
                contactService.Contact.get({contact_id: object.id}, function(data) {
               		object.events = data.events;
               		object.tasks = data.tasks;
               		object.tags = data.tags;
                });
            } else if (object.type == 'event') {
                eventService.Event.get({event_id: object.id}, function(data) {
               		object.contacts = data.contacts;
               		object.tasks = data.tasks;
               		object.tags = data.tags;
                });
            } else if (object.type == 'task') {
                taskService.Task.get({task_id: object.id}, function(data) {
               		object.contacts = data.contacts;
               		object.events = data.events;
               		object.tags = data.tags;
                });
            } else if (object.type == 'tag') {
                tagService.Tag.get({tag_id: object.id}, function(data) {
               		object.contacts = data.contacts;
               		object.events = data.events;
               		object.tasks = data.tasks;
                });
            }

        };

        $scope.changeShowMe = function($event) {
            var selectedShowMe = $event.currentTarget;
            if ($(selectedShowMe).hasClass("selected")) {
                $(selectedShowMe).removeClass("selected");
            } else {
                $(selectedShowMe).addClass("selected");
            }
            var selectedId = selectedShowMe.id;
            if (selectedId == "subContact") {
                $scope.showContacts = !$scope.showContacts;
                relatedContacts = $scope.showContacts;
            }
            else if (selectedId == "subEvent") {
                $scope.showEvents = !$scope.showEvents;
                relatedEvents = $scope.showEvents;
            }
            else if (selectedId == "subTask") {
                $scope.showTasks = !$scope.showTasks;
                relatedTasks = $scope.showTasks;
            }
            else if (selectedId == "subTag") {
                $scope.showTags = !$scope.showTags;
                relatedTags = $scope.showTags;
            }
        }

        $scope.changeSortBy = function($event) {

            var selectedId = $event.currentTarget.id;
            $(".sortitem").removeClass('selected');
            $("#" + selectedId).addClass('selected');

            $scope.selectedSortBy = selectedId;

            setTimeout(function(){
                var allItems = $('.listitem');
                for (var i = 0; i < allItems.length; i++) {
                    if (i < 15) {
                        $(allItems[i]).accordion({
                            active: true,
                            collapsible: true,
                            header: "h3.mainsort",
                            heightStyle: "content"
                        });
                        bindArrow(allItems[i]);
                    } else {
                        $(allItems[i]).addClass('notYet');
                    }
                }
                $(allItems).addClass('fadeInto');
                console.log(allItems.length + " accordions displayed");
            }, 1);

            previouslySelected = selectedId;
            console.log(previouslySelected);

        }

	}, 1);

}]);
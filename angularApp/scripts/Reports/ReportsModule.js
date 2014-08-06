
var reportsModule = angular.module('ReportsModule', []);

reportsModule.controller('ReportsController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
	function($scope, $resource, $modal, contactService, tagService, taskService, eventService){

	setTimeout(function(){

        $scope.ScheduleShow = ['All Open Activities', 'Today', 'Tomorrow', 'This Week', 'Next Week'];
        $scope.ScheduleFilter = $scope.ScheduleShow[0];


        $scope.$on('reimportListTaskStatus', function(e) {
        });

        $scope.updateSchedule = function() {

            console.log($scope.ScheduleFilter);
            $scope.FilteredContacts = new Array();
            $scope.FilteredEvents = new Array();
            $scope.FilteredTasks = new Array();
            $scope.FilteredTags = new Array();
            var today = moment().format('MMDDYY');
            var tomorrow = moment().add('days', 1);
            tomorrow = moment(tomorrow).format('MMDDYY');
            console.log(today + " " + tomorrow);

            if ($scope.ScheduleFilter == 'All Open Activities') {
                for(var i = 0; i < $scope.contacts.length; i++) {
                    $scope.FilteredContacts.push($scope.contacts[i]);
                }
                for(var i = 0; i < $scope.events.length; i++) {
                    $scope.FilteredEvents.push($scope.events[i]);
                }
                for(var i = 0; i < $scope.tasks.length; i++) {
                    $scope.FilteredTasks.push($scope.tasks[i]);
                }
                for(var i = 0; i < $scope.tags.length; i++) {
                    $scope.FilteredTags.push($scope.tags[i]);
                }
            }
            else if ($scope.ScheduleFilter == 'Today') {
                for(var i = 0; i < $scope.contacts.length; i++) {
                    $scope.FilteredContacts.push($scope.contacts[i]);
                }
                for(var i = 0; i < $scope.events.length; i++) {
                    $scope.FilteredEvents.push($scope.events[i]);
                }
                for(var i = 0; i < $scope.tasks.length; i++) {
                    if ($scope.tasks[i]['due']) {
                        var thisDue = moment($scope.tasks[i]['due']).format('MMDDYY');
                        if (today == thisDue) {
                            console.log($scope.tasks[i]['title'] + " is due today: " + thisDue);
                            $scope.FilteredTasks.push($scope.tasks[i]);
                        }
                    }
                }
                for(var i = 0; i < $scope.tags.length; i++) {
                    $scope.FilteredTags.push($scope.tags[i]);
                }
            }
            else if ($scope.ScheduleFilter == 'Tomorrow') {
                for(var i = 0; i < $scope.contacts.length; i++) {
                    $scope.FilteredContacts.push($scope.contacts[i]);
                }
                for(var i = 0; i < $scope.events.length; i++) {
                    $scope.FilteredEvents.push($scope.events[i]);
                }
                for(var i = 0; i < $scope.tasks.length; i++) {
                    if ($scope.tasks[i]['due']) {
                        var thisDue = moment($scope.tasks[i]['due']).format('MMDDYY');
                        if (tomorrow == thisDue) {
                            console.log($scope.tasks[i]['title'] + " is due tomorrow: " + thisDue);
                            $scope.FilteredTasks.push($scope.tasks[i]);
                        }
                    }
                }
                for(var i = 0; i < $scope.tags.length; i++) {
                    $scope.FilteredTags.push($scope.tags[i]);
                }
            }
            else if ($scope.ScheduleFilter == 'This Week') {
                for(var i = 0; i < $scope.contacts.length; i++) {
                    $scope.FilteredContacts.push($scope.contacts[i]);
                }
                for(var i = 0; i < $scope.events.length; i++) {
                    $scope.FilteredEvents.push($scope.events[i]);
                }
                for(var i = 0; i < $scope.tasks.length; i++) {
                    $scope.FilteredTasks.push($scope.tasks[i]);
                }
                for(var i = 0; i < $scope.tags.length; i++) {
                    $scope.FilteredTags.push($scope.tags[i]);
                }
            }
            else if ($scope.ScheduleFilter == 'Next Week') {
                for(var i = 0; i < $scope.contacts.length; i++) {
                    $scope.FilteredContacts.push($scope.contacts[i]);
                }
                for(var i = 0; i < $scope.events.length; i++) {
                    $scope.FilteredEvents.push($scope.events[i]);
                }
                for(var i = 0; i < $scope.tasks.length; i++) {
                    $scope.FilteredTasks.push($scope.tasks[i]);
                }
                for(var i = 0; i < $scope.tags.length; i++) {
                    $scope.FilteredTags.push($scope.tags[i]);
                }              
            }
            setTimeout(function(){
                $(".sortitem.selected").click()
                var allAccords = $('.listitem');
                console.log(allAccords.length);
                if (allAccords.length > 1) {
                    for (var i = 0; i < allAccords.length; i++) {
                        if (i < 15) {
                            $(allAccords[i]).removeClass('notYet');
                            console.log("removing");
                        }
                    }
                } else if (allAccords) {
                    $(allAccords).removeClass('notYet');
                }
            }, 100);
        }

		console.log("starting our attack run..." + previouslySelected);
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

        /*$('.showitem').unbind("click").bind("click", function(event){
            var subSortType = event.target.id;
            var subSortList = document.getElementsByClassName(subSortType);
            if ($(event.target).hasClass('selected')) {
                $(event.target).removeClass('selected');
                $(subSortList).css("display", "none");
                if (this.id === 'maintask') {
                    $('.calTask').removeClass('active');
                } else if (this.id === 'mainevent') {
                    $('.calEvent').removeClass('active');
                } else {
                    console.log('nope');
                }
            } else {
                $(event.target).addClass('selected');
                $(subSortList).css("display", "block");
                if (this.id === 'maintask') {
                    $('.calTask').addClass('active');
                } else if (this.id === 'mainevent') {
                    $('.calEvent').addClass('active');
                } else {
                    console.log('nope');
                }
            }
            $(".listitem.active").accordion("refresh");
        });*/

        /*$('.sortitem').unbind("click").bind("click", function(event){

            var sortType = this.id;
            var theseAccords = $('.listitem.' + sortType);
            $('.listitem').removeClass('fadeInto');
            setTimeout(function(){
	            $('.listitem').removeClass('active');
	            $('.accordionarrow').removeClass('arrowdown');
	            for (var i = 0; i < 15; i++) {
	            	$(theseAccords[i]).addClass('active');
	            }
	            if ($(event.target).parent().hasClass('selected')) {
	                if ($(event.target).find('ul').hasClass('invis')) {
	                    $(event.target).find('ul').removeClass('invis');
	                } else {
	                    $(event.target).find('ul').addClass('invis');
	                }
	            } else {
	                $('.selected').find('ul').removeClass("sortby");
	                $('.sortitem.selected').removeClass('selected');
	                $('.invis').removeClass('invis');
	                $(event.target).parent().addClass('selected');
	                $(event.target).find('ul').addClass("sortby");
	            }
	  
	            var allItems = $('.listitem.active');
		        for (var i = 0; i < 15; i++) {
		        	$(allItems[i]).accordion({
				        active: true,
				        collapsible: true,
				        header: "h3.mainsort"
				    });
		            $(allItems[i]).addClass('active');
		            bindArrow(allItems[i]);
		        }
		        $(allItems).addClass('fadeInto');
		    }, 300);

        });*/

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
            }, 1);

            previouslySelected = selectedId;
            console.log(previouslySelected);
            console.log(listCount + " accordions displayed");

        }

	}, 1);

}]);
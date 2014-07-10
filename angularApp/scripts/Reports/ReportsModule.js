
var reportsModule = angular.module('ReportsModule', []);

reportsModule.controller('ReportsController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
	function($scope, $resource, $modal, contactService, tagService, taskService, eventService){

	setTimeout(function(){
		console.log("starting our attack run...");
        
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 155) {
                console.log("you've really hit rock bottom, pal");
                var currentSort = $('.sortitem.selected').attr('id');
                var allItems = $('.listitem.' + currentSort);
                var j = 0;
                for (var i = 0; j < 15; i++) {
                    if ($(allItems[i]).hasClass('active')) {
                        console.log('skipping, already active');
                    } else {
                        $(allItems[i]).addClass('active');
                        $(allItems[i]).accordion({
                            active: false,
                            collapsible: true,
                            header: "h3.mainsort"
                        });
                        j++;
                    }
                }
                rebindArrows();
            }
        };

        function rebindArrows(){
        	$('.listitem').click(function(){
        		var thisArrow = $(this).find($('.accordionarrow'));
        		console.log(thisArrow);
        		if ($(thisArrow).hasClass('arrowdown')) {
        			$(thisArrow).removeClass('arrowdown');
        		} else {
        			$(thisArrow).addClass('arrowdown');
        		}
        	});
        }

	    var allItems = $('.listitem');

	    $('.listitem').accordion({
	        active: false,
	        collapsible: true,
	        header: "h3.mainsort"
	    });

        $('.sortitem').unbind("click").bind("click", function(event){

            var sortType = this.id;
            var theseAccords = $('.listitem.' + sortType);
            $('.listitem').removeClass('active');
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
  
            allItems = $('.listitem.active');
	        for (var i = 0; i < 15; i++) {
	        	$(allItems[i]).accordion({
			        active: true,
			        collapsible: true,
			        header: "h3.mainsort"
			    });
	            $(allItems[i]).addClass('active');
	        }

	        rebindArrows();

        });

		$scope.getObjectDetails = function(object) {

            var thisArrow = $(this).find(".accordionarrow");
            var currentObject, objectType;
            var dataContacts, dataEvents, dataTasks, dataTags;

            if ($(thisArrow).hasClass("arrowdown")) {
                $(thisArrow).removeClass("arrowdown");
            } 

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

                        /*try {
                            if (data['contacts'].length > -1) {
                                dataContacts = data['contacts'];
                                var arrContacts = [];
                                for (var key in dataContacts) {
                                    if (dataContacts.hasOwnProperty(key)) {
                                        arrContacts.push(dataContacts[key]);  
                                    }
                                }
                                console.log(arrContacts.length + " Contacts");
                                $(contactListCont).find('span').remove();
                                if (arrContacts.length > 0) {
                                    for (var i = 0; i < arrContacts.length; i++) {
                                        currentObject = arrContacts[i].name;
                                        currentObject = '<span class="subitemtext">' + currentObject + '</span>';
                                        $(contactListCont).append(currentObject);
                                    }
                                } else {
                                    $(contactListCont).append('<span class="subitemtext">No related contacts</span>');
                                }
                            }
                        } catch (err) {
                            console.log("no contact array found: " + err);
                        }
                        try {
                            if (data['events'].length > -1) {
                                dataEvents = data['events'];
                                var arrEvents = [];
                                for (var key in dataEvents) {
                                    if (dataEvents.hasOwnProperty(key)) {
                                        arrEvents.push(dataEvents[key]);
                                    }
                                }
                                console.log(arrEvents.length + " Events");
                                $(eventListCont).find('span').remove();
                                if (arrEvents.length > 0) {
                                    for (var i = 0; i < arrEvents.length; i++) {
                                        currentObject = arrEvents[i].title;
                                        currentObject = '<span class="subitemtext">' + currentObject + '</span>';
                                        $(eventListCont).append(currentObject);
                                    }
                                } else {
                                    $(eventListCont).append('<span class="subitemtext">No related events</span>');
                                }
                            } 
                        } catch (err) {
                            console.log("no event array found: " + err);
                            $(eventListCont).find('span').remove();
                            $(eventListCont).append("Error retrieving events");
                        }
                        try {
                            if (data['tasks'].length > -1) {
                                dataTasks = data['tasks'];
                                var arrTasks = [];
                                    for (var key in dataTasks) {
                                    if (dataTasks.hasOwnProperty(key)) {
                                        arrTasks.push(dataTasks[key]);  
                                    }
                                }
                                console.log(arrTasks.length + " Tasks");
                                $(taskListCont).find('span').remove();
                                if (arrTasks.length > 0) {
                                    for (var i = 0; i < arrTasks.length; i++) {
                                        currentObject = arrTasks[i].title;
                                        currentObject = '<span class="subitemtext">' + currentObject + '</span>';
                                        $(taskListCont).append(currentObject);
                                    }
                                } else {
                                    $(taskListCont).append('<span class="subitemtext">No related tasks</span>');
                                }
                            } 
                        } catch (err) {
                            console.log("no task array found: " + err);
                            $(taskListCont).find('span').remove();
                            $(taskListCont).append("Error retrieving tasks");
                        }
                        try {
                            if (data['tags'].length > -1) {
                                dataTags = data['tags'];
                                var arrTags = [];
                                    for (var key in dataTags) {
                                    if (dataTags.hasOwnProperty(key)) {
                                        arrTags.push(dataTags[key]);  
                                    }
                                }
                                console.log(arrTags.length + " Tags");
                                $(tagListCont).find('span').remove();
                                if (arrTags.length > 0) {
                                    for (var i = 0; i < arrTags.length; i++) {
                                        currentObject = arrTags[i].name;
                                        currentObject = '<span class="subitemtext">' + currentObject + '</span>';
                                        $(tagListCont).append(currentObject);
                                    }
                                } else {
                                    $(tagListCont).append('<span class="subitemtext">No related tags</span>');
                                }
                            }
                        } catch (err) {
                            console.log("no tag array found: " + err);
                            $(tagListCont).find('span').remove();
                            $(tagListCont).append("Error retrieving tags");
                        }*/

            };

	}, 100);

}]);
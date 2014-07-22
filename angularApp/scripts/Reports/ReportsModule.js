
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
                    if (!$(allItems[i]).hasClass('active')) {

                        $(allItems[i]).addClass('active');
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

        $('.showitem').unbind("click").bind("click", function(event){
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
        });

        $('.sortitem').unbind("click").bind("click", function(event){

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

        });

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

		$scope.getObjectDetails = function(object) {

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

	}, 100);

}]);
App.ApplicationController = Ember.Controller.extend({

    currentPathDidChange: function() {
  		$("#loader").addClass("showLoader");
    	Ember.run.schedule('afterRender', this, function() {
        	rebindEvents();
        	console.log("rebind this");
        	console.log(this);
	        setTimeout(function(){
		        $("#loader").removeClass("showLoader");
		        //this.get('model').reload();
		    }, 400);
	    });
    }.observes('currentPath'),

	actions: {

	    createContact: function(contact) {
        
        	$("#loader").addClass("showLoader");

			var showPopupMessage = function(message, style) {
				var statusPopup = new Opentip($('.createForm.selected .formrow:last-child'), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
				statusPopup.show();
				statusPopup.container.css('z-index', 100000);
				setTimeout(function() {
					statusPopup.hide();
        			$("#loader").removeClass("showLoader");
					setTimeout($('.close').click(), 300);
	                setTimeout(function(){
	                    $('.createForm input').val("");
	                    $('.createForm .formrow:last-child input').val("Submit");
	                    $('.createForm .association img').click();
	                    $("#loader").removeClass("showLoader");
	                }, 700);
				}, 2000);
			};

	        var store = this.get('store');
			var relatedTasks = $("li[objectid*='task']");
			var relatedEvents = $("li[objectid*='event']");
			var relatedTags = $("li[objectid*='tag']");
			var taskIds = new Array();
			var eventIds = new Array();
			var tagIds = new Array();
		    var totalEmails = $(".contactEmail");
		    var totalPhones = $(".contactPhone");
	        var emailList = [];
	        var phoneList = [];
			var thisObject;

			var i;
	        var j = 0;

	        for (i = 0; i < totalEmails.length; i++) {
	            thisObject = $(totalEmails[i]).val();
	            if (thisObject.length > 0) {
	                emailList.push({
	                    email: thisObject
	                });
	            }
	        }

	        j = 0;

	        for (i = 0; i < totalPhones.length; i++) {
	            thisObject = $(totalPhones[i]).val();
	            if (thisObject.length > 0) {
	                phoneList.push({
	                    number: thisObject
	                });
	            }
	        }

			for (i = 0; i < relatedTasks.length; i++) {
				thisObject = $(relatedTasks[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	taskIds[i] = thisObject;
	        }
			for (i = 0; i < relatedEvents.length; i++) {
				thisObject = $(relatedEvents[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	eventIds[i] = thisObject;
	        }
			for (i = 0; i < relatedTags.length; i++) {
				thisObject = $(relatedTags[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	tagIds[i] = thisObject;
	        }
            
            var data = {
                contact: {
                    name: contact.name,
                    organization: contact.organization,
                    phones: phoneList,
                    address: contact.address,
                    emails: emailList,
                    task_ids: taskIds,
                    event_ids: eventIds,
                    tag_ids: tagIds
                }
            };

	        var getContacts = function(cb) {
		        $.ajax({
					type: 'POST',
					url: 'http://daywon-api-staging.herokuapp.com/contacts',
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(data),
					headers: {
						"X-AUTHENTICATION-TOKEN": authToken,
						"X-AUTHENTICATION-EMAIL": userEmail
					},
					success: cb,
					error: function (e) {
						showPopupMessage("Error creating object: " + e, "error");
					}
				});
		    }
            var callback = function(data) {
                console.log(data);
				showPopupMessage("Successfully created " + data.name, "success");
		        store.push('contact', {
		        	id: data.id,
		        	name: data.name
		        });
            }

		    getContacts(callback);

	    },

	    createEvent: function(event) {

        	$("#loader").addClass("showLoader");

			var showPopupMessage = function(message, style) {
				var statusPopup = new Opentip($('.relatedList.relatedEvents'), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
				statusPopup.show();
				statusPopup.container.css('z-index', 100000);
				setTimeout(function() {
					statusPopup.hide();
        			$("#loader").removeClass("showLoader");
					setTimeout($('.close').click(), 300);
	                setTimeout(function(){
	                    $('.createForm input').val("");
	                    $('.createForm .formrow:last-child input').val("Submit");
	                    $('.createForm .association img').click();
	                }, 700);
				}, 2000);
			};

	        var store = this.get('store');
			var relatedContacts = $("li[objectid*='contact']");
			var relatedTags = $("li[objectid*='tag']");
			var relatedTasks = $("li[objectid*='task']");
			var contactIds = new Array();
			var tagIds = new Array();
			var taskIds = new Array();
			var thisObject;

			for (i = 0; i < relatedContacts.length; i++) {
				thisObject = $(relatedContacts[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	contactIds[i] = thisObject;
	        }
			for (i = 0; i < relatedTags.length; i++) {
				thisObject = $(relatedTags[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	tagIds[i] = thisObject;
	        }
			for (i = 0; i < relatedTasks.length; i++) {
				thisObject = $(relatedTasks[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	taskIds[i] = thisObject;
	        }

	        var isAllDay = new Boolean($("#allDay:checked").length);
            if (isAllDay === true) {
                var eventSt = moment($("#allDayStart").val()).format();
                var eventEn = moment($("#allDayEnd").val()).format();
            } else {
                var eventSt = moment($("#eventStart").val()).format();
                var eventEn = moment($("#eventEnd").val()).format();
            }
            var isRecurring = new Boolean($("#recurring:checked").length);
            var interval = document.getElementById("recurrChoice").selectedIndex;
            var repeatInterval;
            var endingCount;
            var endingDate;
            var recurr;

            if (isRecurring == true) {
                if (interval == 0) {
                    repeatInterval = $("#intervalSelect").val();
                    if (repeatInterval > 1) {
                        repeatInterval = parseInt(repeatInterval, 10);
                    }
                    else {
                        repeatInterval = "day";
                    }
                } else if (interval == 1) {
                    repeatInterval = "week";
                } else if (interval == 2) {
                    repeatInterval = "month";
                } else if (interval == 3) {
                    repeatInterval = "year";
                } else if (interval == 4) {
                    repeatInterval = "weekday";
                }
                endingCount = $("#recurrNumber").val();
                if (endingCount.length) {
                    endingCount = parseInt(endingCount, 10);
                } else {
                    endingCount = null;
                }
                endingDate = moment($("#endEventRepeat").val()).format();
                if (endingDate.length < 1) {
                    endingDate = null;
                }
                recurr = {
                    frequency: repeatInterval,
                    ends_after: {
                        occurences: endingCount,
                        date: endingDate
                    }
                };
            } else if (isRecurring == false){
                console.log("not recurring");
                recurr = null;
            }

	        var data = {
                event: {
                    title: event.title,
                    calendar_title: event.title,
                    description: event.description,
                    location: event.location,
                    recurrence: recurr,
                    is_all_day: isAllDay,
                    recurring: isRecurring,
                    start_datetime: eventSt,
                    end_datetime: eventEn,
                    start_date: eventSt,
                    end_date: eventEn,
                    contact_ids: contactIds,
                    tag_ids: tagIds,
                    task_ids: taskIds
                }
            };

	        var getEvents = function(cb) {
		        $.ajax({
					type: 'POST',
					url: 'http://daywon-api-staging.herokuapp.com/events',
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(data),
					headers: {
						"X-AUTHENTICATION-TOKEN": authToken,
						"X-AUTHENTICATION-EMAIL": userEmail
					},
					success: cb,
					error: function (e) {
						showPopupMessage("Error creating object: " + e, "error");
					}
				});
		    }
            var callback = function(data) {
                console.log(data);
				showPopupMessage("Successfully created " + data.title, "success");
		        store.push('event', {
		        	id: data.id,
		        	title: data.title
		        });
            }

		    getEvents(callback);
		    
	    },

	    createTask: function(task) {

        	$("#loader").addClass("showLoader");

			var showPopupMessage = function(message, style) {
				var statusPopup = new Opentip($('.createForm.selected .formrow:last-child'), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
				statusPopup.show();
				statusPopup.container.css('z-index', 100000);
				setTimeout(function() {
					statusPopup.hide();
        			$("#loader").removeClass("showLoader");
					setTimeout($('.close').click(), 300);
	                setTimeout(function(){
	                    $('.createForm input').val("");
	                    $('.createForm .formrow:last-child input').val("Submit");
	                    $('.createForm .association img').click();
	                }, 700);
				}, 2000);
			};

	        var store = this.get('store');
			var relatedContacts = $("li[objectid*='contact']");
			var relatedEvents = $("li[objectid*='event']");
			var relatedTags = $("li[objectid*='tag']");
			var contactIds = new Array();
			var eventIds = new Array();
			var tagIds = new Array();
			var thisObject;

			for (i = 0; i < relatedContacts.length; i++) {
				thisObject = $(relatedContacts[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	contactIds[i] = thisObject;
	        }
			for (i = 0; i < relatedEvents.length; i++) {
				thisObject = $(relatedEvents[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	eventIds[i] = thisObject;
	        }
			for (i = 0; i < relatedTags.length; i++) {
				thisObject = $(relatedTags[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	tagIds[i] = thisObject;
	        }

            var data = {
                task: {
                    title: task.title,
                    notes: task.description,
                    due: moment(task.due).format(),
                    priority: parseInt(task.priority),
                    contact_ids: contactIds,
                    event_ids: eventIds,
                    tag_ids: tagIds
                }
            };

	        var getTasks = function(cb) {
		        $.ajax({
					type: 'POST',
					url: 'http://daywon-api-staging.herokuapp.com/tasks',
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(data),
					headers: {
						"X-AUTHENTICATION-TOKEN": authToken,
						"X-AUTHENTICATION-EMAIL": userEmail
					},
					success: cb,
					error: function (e) {
						showPopupMessage("Error creating object: " + e, "error");
					}
				});
		    }
            var callback = function(data) {
                console.log(data);
				showPopupMessage("Successfully created " + data.title, "success");
		        store.push('task', {
		        	id: data.id,
                    title: data.title,
                    notes: data.description,
                    due: data.due,
                    priority: data.priority
		        });
            }

		    getTasks(callback);

	    },

	    createTag: function(tag) {

        	$("#loader").addClass("showLoader");

			var showPopupMessage = function(message, style) {
				var statusPopup = new Opentip($('.createForm.selected .formrow:last-child'), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
				statusPopup.show();
				statusPopup.container.css('z-index', 100000);
				setTimeout(function() {
					statusPopup.hide();
        			$("#loader").removeClass("showLoader");
					setTimeout($('.close').click(), 300);
	                setTimeout(function(){
	                    $('.createForm input').val("");
	                    $('.createForm .formrow:last-child input').val("Submit");
	                    $('.createForm .association img').click();
	                }, 700);
				}, 2000);
			};

	        var store = this.get('store');
			var relatedContacts = $("li[objectid*='contact']");
			var relatedEvents = $("li[objectid*='event']");
			var relatedTasks = $("li[objectid*='task']");
			var contactIds = new Array();
			var eventIds = new Array();
			var taskIds = new Array();
			var thisObject;

			for (i = 0; i < relatedContacts.length; i++) {
				thisObject = $(relatedContacts[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	contactIds[i] = thisObject;
	        }
			for (i = 0; i < relatedEvents.length; i++) {
				thisObject = $(relatedEvents[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	eventIds[i] = thisObject;
	        }
			for (i = 0; i < relatedTasks.length; i++) {
				thisObject = $(relatedTasks[i]).attr('objectid');
				thisObject = thisObject.replace(/\D/g,'');
	        	taskIds[i] = thisObject;
	        }

	        var data = {
                tag: {
                    name: tag.name,
                    contact_ids: contactIds,
                    event_ids: eventIds,
                    task_ids: taskIds
                }
            };

	        var getTags = function(cb) {
		        $.ajax({
					type: 'POST',
					url: 'http://daywon-api-staging.herokuapp.com/tags',
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(data),
					headers: {
						"X-AUTHENTICATION-TOKEN": authToken,
						"X-AUTHENTICATION-EMAIL": userEmail
					},
					success: cb,
					error: function (e) {
						showPopupMessage("Error creating object: " + e, "error");
					}
				});
		    }
            var callback = function(data) {
                console.log(data);
				showPopupMessage("Successfully created " + data.name, "success");
		        store.push('tag', {
		        	id: data.id,
		        	name: data.name,
		        	count: data.count
		        });
            }

		    getTags(callback);

	    }

	}
});
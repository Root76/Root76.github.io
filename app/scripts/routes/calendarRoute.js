App.CalendarRoute = Ember.Route.extend({
    model: function() {
        return this.get('store').find('event');
    },
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('events').set('model', model);
	}
});

var calPopupTemplate = Handlebars.compile($('#calPopupTemplate').html());
var calPopupTemplate2 = Handlebars.compile($('#calPopupTemplate2').html());

App.CalView = Ember.View.extend({
	didInsertElement: function() {

		var self = this;
		var model = this.get('controller.model');
	    var jsonEvent = model.map(function(record) {
	    	jsonEvent = record.toJSON();
	    	jsonEvent.id = record.id;
            return jsonEvent;
        });

        console.log("events: " + jsonEvent.length);
        console.log(jsonEvent);

        var getTasks = function(cb) {
            var data = 'Input values';
            $.ajax({
                type: 'GET',
                url: 'http://daywon-api-staging.herokuapp.com/tasks',
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "X-AUTHENTICATION-TOKEN": authToken,
                    "X-AUTHENTICATION-EMAIL": userEmail
                },
                success: cb,
                error: function(e) {
                    console.log("couldn't fetch tasks: " + e);
                }
            });
        }

        var callback = function(data) {

        	var allTasks = data.tasks;
        	var jsonTask = [];
        	var j = 0;
        	for (var i = jsonEvent.length; j < allTasks.length; j++) {
        		jsonEvent[i] = allTasks[j];
        		i++;
        	}

        	console.log("with tasks: " + jsonEvent.length);
        	console.log(jsonEvent);

        	var json = jsonEvent;

	        for (var i = 0; i < json.length; i++) {

	        	if (json[i].hasOwnProperty("start_datetime")) {
	        		json[i]["start"] = json[i]["start_datetime"];
	        	} else
	        	if (json[i].hasOwnProperty("start_date")) {
	        		json[i]["start"] = json[i]["start_date"];
	        	} 

	        	if (json[i].hasOwnProperty("end_datetime")) {
	        		json[i]["end"] = json[i]["end_datetime"];
	        	} else
	        	if (json[i].hasOwnProperty("end_date")) {
	        		json[i]["end"] = json[i]["end_date"];
	        	}

	        	if (json[i].hasOwnProperty("due")) {
	        		console.log("there's a due");
	        		json[i]['start'] = json[i]["due"];
	        		json[i]['end'] = json[i]["due"];
	        		json[i]['className'] = 'calTask active';
	        	} else {
	        		json[i]['className'] = 'calEvent active';
	        	}
	        }

	        console.log("INSTANTIATE");
	        startCalendar(jsonEvent, that);

        }

        var that = this;
        getTasks(callback);

        function startCalendar(json, that) {
	        console.log("final json");
	        console.log(json);
	    	that.$().fullCalendar({
		        header: {
		            left: 'prev,next today',
		            center: 'title',
		            right: 'month,agendaWeek,agendaDay,agendaList'
		        },
		        events: json,
		        eventClick: function(calItem, jsEvent, view) {
			        var calElement = this;
			        console.log(calItem);
			        if (calItem.hasOwnProperty('location')) {
						model.store.find('event', calItem.id).then(function(event) { 
							event.reload().then(function(reloadedEvent) { // wait for related tags to be pulled
						        calItem.start_formatted = moment(calItem.start).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.end_formatted = moment(calItem.end).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.tags = reloadedEvent.get('tags');
						        var eventInfo = calPopupTemplate(calItem);
						        new Opentip(calElement, eventInfo, {
				            		style: "calitem",
				            		showOn: "creation",
				            		hideTrigger: "closeButton",
				            		className: "calpop",
				            		background: "#e35d32",
				            		closeButtonRadius: 15,
				            		closeButtonCrossSize: 10,
				            		closeButtonCrossColor: "#ffffff"
				        		});
							});
						});
					} else if (calItem.hasOwnProperty('due')) {
						model.store.find('task', calItem.id).then(function(task) { 
							task.reload().then(function(reloadedTask) { // wait for related tags to be pulled
						        calItem.due_formatted = moment(calItem.due).format('MMMM Do YYYY, h:mm:ss a');
						        calItem.tags = reloadedTask.get('tags');
						        var taskInfo = calPopupTemplate2(calItem);
						        new Opentip(calElement, taskInfo, {
				            		style: "calitem",
				            		showOn: "creation",
				            		hideTrigger: "closeButton",
				            		className: "calpop",
				            		background: "#88c44c",
				            		closeButtonRadius: 15,
				            		closeButtonCrossSize: 10,
				            		closeButtonCrossColor: "#ffffff"
				        		});
							});
						});
					} else {
						alert("something's wrong");
					}
			    }
	   		});
		}
		window.transitionToTag = function(id) {
			document.location.href = document.location.href.split('#')[0] + '#/tags/' + id;
		}
    }
});
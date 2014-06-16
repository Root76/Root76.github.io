var App;

requirejs.config({
    baseUrl: 'scripts'
});

requirejs([
  "./jquery",
  "libs/ember-data",
  "libs/datetimepicker",
  "libs/jquery-ui",
  "libs/plugins",
  "libs/opentip",
  "libs/moment",
  "libs/typeahead",
  "libs/iscroll",
  "libs/handlebars",
  "libs/ember",
  "bootstrap/bootstrap",
  "libs/fullcalendar",
  "libs/fastclick",
  "./events"
], function($) {

  App = window.App = Ember.Application.create({
      LOG_TRANSITIONS: true
  });

  /***Router***/
  App.Router.map(function () {
      this.resource("reports", function() {
          this.route("events");
          this.route("tasks");
          this.route("contacts");
          this.route("tags");
      });
      this.resource("contacts", function() {
          this.route("contact", { path: "/:contact_id" });    
      });
      this.resource("events", function() {
          this.route("event", { path: "/:event_id" });    
      });
      this.resource("tasks", function() {
          this.route("task", { path: "/:task_id" });
      });
      this.resource("tags", function() {
          this.route("tag", { path: "/:tag_id" });
      });
      this.resource("orphans", function() {
      	this.resource("orphanevents", function() {
      		this.route("event", { path: "/:event_id"});
      	});
      	this.resource("orphantasks", function() {
      		this.route("task", { path: "/:task_id"});
      	});
      	this.resource("orphantags", function() {
      		this.route("tag", { path: "/:tag_id" });
      	});
      });
      this.resource("view");
      this.resource("create", function(){
          this.route("contact");
          this.route("event");
          this.route("task");
          this.route("tag");
      });
      this.resource("calendar");
      this.resource("settings");
      this.resource("admin");
  });

  //Observe URL Change
  $(window).on('hashchange', function(){
    console.log("Hash URL is " + location.hash.substr(1));
    setTimeout(function(){
    	$('.newlyadded').remove();
    }, 700);
  });

  /***Rest Adapter***/

  var authToken;
  var userEmail;

  function QueryStringToJSON() {            
      var pairs = location.search.slice(1).split('&');
      var result = {};
      pairs.forEach(function(pair) {
          pair = pair.split('=');
          result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
  }

  var query_string = QueryStringToJSON();

  authToken = "4N9-_NWfYvYxpesMVpne";
  userEmail = "hweaver@evenspring.com";

  App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: "http://daywon-api-staging.herokuapp.com/",
    headers: {
      "X-AUTHENTICATION-TOKEN": authToken,
      "X-AUTHENTICATION-EMAIL": userEmail
      // authToken,
      // "epDAyxZkc4uLqoyvym_L"
    }
  });

  App.Store = DS.Store.extend({
      adapter:  App.ApplicationAdapter.create()
  });

  Ember.Inflector.inflector.uncountable('reports_admin');

  Utility = {};
  Utility.sortByTimeOption = function(enumerable, timePropertyName, timeOption) {
  	var now = moment();
  	return enumerable.filter(function(item) {		
  		var hasDate = item.get('hasDate');
  		var time = moment(item.get(timePropertyName));
  		
  		if (timeOption === "allOpen")
  			return true;
  		else {			
  			switch(timeOption) {
  			case "overtime": // earlier than now
  				return time <= now;
  			case "todayAndOvertime": // earlier than beginning of next day
  				return time < moment(now).add('days', 1).hour(0).minute(0).second(0); 
  			case "next7Days": // later than now and earlier than beginning of 8th day
  				return time > now && time < moment(now).add('days', 7).hour(0).minute(0).second(0); 
  			case "today": // later than now and earlier than beginning of next day
  				return time > now && time < moment(now).add('days', 1).hour(0).minute(0).second(0); 
  			case "tomorrow": // from beginning to end of next day
  				var nextDay = moment(now).add('days', 1).hour(0).minute(0).second(0);
  				return time >= nextDay && time < nextDay.add('days', 1); 
  			case "day2": // from beginning to end of next day
  				var nextDay2 = moment(now).add('days', 2).hour(0).minute(0).second(0);
  				return time >= nextDay2 && time < nextDay2.add('days', 1); 
  			case "day3": // from beginning to end of next day
  				var nextDay3 = moment(now).add('days', 3).hour(0).minute(0).second(0);
  				return time >= nextDay3 && time < nextDay3.add('days', 1); 
  			case "day4": // from beginning to end of next day
  				var nextDay4 = moment(now).add('days', 4).hour(0).minute(0).second(0);
  				return time >= nextDay4 && time < nextDay4.add('days', 1);
  			case "day5": // from beginning to end of next day
  				var nextDay5 = moment(now).add('days', 5).hour(0).minute(0).second(0);
  				return time >= nextDay5 && time < nextDay5.add('days', 1);
  			case "day6": // from beginning to end of next day
  				var nextDay6 = moment(now).add('days', 6).hour(0).minute(0).second(0);
  				return time >= nextDay6 && time < nextDay6.add('days', 1);
  			case "thisWeek": // from now until beginning of next Monday
  				var nextMonday = moment(now).day(8).hour(0).minute(0).second(0);
  				return time > now && time < nextMonday;
  			case "nextWeek": // from beginning of next Monday to beginning of the next Monday
  				var nextMonday = moment(now).day(8).hour(0).minute(0).second(0);
  				var nextNextMonday = moment(now).day(15).hour(0).minute(0).second(0);
  				return time >= nextMonday && time < nextNextMonday; 
  			case "newThisWeek": // from beginning of Monday until now
  				var monday = moment(now).day(1).hour(0).minute(0).second(0);
  				return time >= monday && time < now; 
  			case "newThisMonth": // from beginning of month until now
  				var beginningOfMonth = moment([now.year(), now.month()])
  				return time >= beginningOfMonth && time < now;
  			case "upcoming": // from beginning of month until now
  				return time >= now;
  			}
  		}
  		return false;
  	});
  };

  Utility.convertToHTMLDateTimeLocalInput = function(dateString) {
  	var date = moment(dateString);
  	if (date.isValid())
  		return date.format("YYYY-MM-DDTHH:mm"); // HTML type="datetime-local" inputs look for this exact date format
  	else return null;
  }

  Utility.convertToReadableDate = function(dateString) {
  	var date = moment(dateString);
  	if (date.isValid())
  		return date.format("MMMM Do YYYY, h:mm:ss a");
  	else return "N/A";
  }

  App.ContactFormComponent = Ember.Component.extend({
    actions: {
      submit: function() {
        this.sendAction('submit', {
          name: this.get('name'),
          organization: this.get('organization'),
          address: this.get('address')
        });
      }
    }
  });

  App.EventFormComponent = Ember.Component.extend({
    actions: {
      submit: function() {
        this.sendAction('submit', {
          title: this.get('title'),
          description: this.get('description'),
          location: this.get('location')
        });
      }
    }
  });

  App.TaskFormComponent = Ember.Component.extend({
    actions: {
      submit: function() {
        this.sendAction('submit', {
          title: this.get('title'),
          notes: this.get('notes'),
          due: this.get('due'),
          priority: this.get('priority')
        });
      }
    }
  });

  App.TagFormComponent = Ember.Component.extend({
    actions: {
      submit: function() {
        this.sendAction('submit', {
          name: this.get('name')
        });
      }
    }
  });

  App.ArrayTransform = DS.Transform.extend({
    deserialize: function(serialized) {
    	return serialized || [];
    },
    serialize: function(deserialized) {
    	return deserialized || [];
    }
  });

  App.ApplicationSerializer = DS.RESTSerializer.extend({
  	normalizePayload: function(type, payload) {
  		if (payload.modifiable) {
  			delete payload.modifiable;
  		}
  		if (payload.table) {
  			payload.orphans = payload.table;
  			delete payload.table;
  		}
  		var typeKey = type.typeKey;
  		if (!typeKey[typeKey.length - 1] !== 's')
  			typeKey += 's';
  		if (!payload[typeKey]) {
  			newPayload = {};
  			newPayload[typeKey] = payload;
  			return newPayload;
  		}
  		return payload;
  	},
  	serialize: function(record, options) {
  		var idOnly = function(item) { return item.id; };

  		var json = this._super(record, options);
  		if (json.contacts) {
  			json.contact_ids = json.contacts.map(idOnly);
  			delete json.contacts;
  		}
  		if (json.events) {
  			json.event_ids = json.events.map(idOnly);
  			delete json.events;
  		}
  		if (json.tasks) {
  			json.task_ids = json.tasks.map(idOnly);
  			delete json.tasks;
  		}
  		if (json.tags) {
  			json.tag_ids = json.tags.map(idOnly);
  			delete json.tags;
  		}
  		return json;
  	}
  });

});
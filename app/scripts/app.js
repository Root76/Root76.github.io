var App = window.App = Ember.Application.create();

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
        this.route("orphan", { path: "/:orphan_id" });    
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
});

App.ApplicationController = Ember.Controller.extend({
  currentPathDidChange: function() {
    Ember.run.schedule('afterRender', this, function() {
        rebindEvents();        
    });
  }.observes('currentPath')
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

authToken = query_string.authentication_token;
userEmail = query_string.user_email;

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: "http://daywon-api-staging.herokuapp.com/",
  headers: {
    "X-AUTHENTICATION-TOKEN": authToken,
    "X-AUTHENTICATION-EMAIL": userEmail
  }
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});

/*App.ApplicationView = Ember.View.extend({
  actions: {
    anActionName: function(){
        alert("hello world!");
    }
  }
});*/

/*Sorting*/

App.ContactsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true,
    actions: {
        showAll: function(){
            this.set('sortProperties', ['name']);
            setTimeout(function(){
                $('.sidelist li').css("display", "block");
            }, 100);
        },
        showRecent: function(){
            this.set('sortProperties', ['updated_at']);
            setTimeout(function(){
                var recentItems = $('.sidelist li');
                for (var b = 0; b < recentItems.length; b++) {
                    if (b > 10) {
                        $(recentItems[b]).css("display", "none");
                    }
                }
            }, 100);
        },
        sortName: function (){
            this.set('sortProperties', ['name']);
        },
        sortCompany: function (){
            this.set('sortProperties', ['organization']);
        }
    }
});

App.EventsController = Ember.ArrayController.extend({
    sortProperties: ['start_datetime'],
    sortAscending: false
});

App.TasksController = Ember.ArrayController.extend({
    sortProperties: ['due'],
    sortAscending: false,
    actions: {
        sortDate: function (){
            this.set('sortProperties', ['due']);
        },
        sortPriority: function (){
            this.set('sortProperties', ['status']);
        },
        sortName: function (){
            this.set('sortProperties', ['title']);
        },
        sortContact: function (){
            console.log("sort by contact fired");
        }
    },
	
	sortOptions: [
		{label: "Tasks with no dates", primarySort: "noDate", secondarySort: "due", ascending: false},
		{label: "Tasks with dates", primarySort: "hasDate", secondarySort: "due", ascending: false},
		{label: "Priority", primarySort: "status", ascending: false},
		{label: "Alphabetical", primarySort: "title", ascending: true}
	],
	selectedSortOption: null,
	selectedSortOptionChanged: function() {
		var sortProperties = [this.selectedSortOption.primarySort];
		if (this.selectedSortOption.secondarySort)
			sortProperties.push(this.selectedSortOption.secondarySort);
		this.set('sortProperties', sortProperties);
		this.set('sortAscending', this.selectedSortOption.ascending);
	}.observes('selectedSortOption'),
	
	showOptions: [
		{label: "All Open", id: "allOpen"},
		{label: "Overdue", id: "overdue"},
		{label: "Today & Overdue", id: "todayAndOverdue"},
		{label: "Next 7 Days", id: "next7Days"}
	],
	selectedShowOption: null,
	selectedShowOptionChanged: function() {
		console.log("Show me: " + this.selectedShowOption.id);
	}.observes('selectedShowOption'),
});

App.TagsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true
});

App.IndexController = Ember.ObjectController.extend({
    needs: ['contacts', 'events', 'tasks', 'tags'],
    contactsController: Ember.computed.alias("controllers.contacts"),
    eventsController: Ember.computed.alias("controllers.events"),
    tasksController: Ember.computed.alias("controllers.tasks"),
    tagsController: Ember.computed.alias("controllers.tags")
});

App.ReportsEventsController = Ember.ArrayController.extend({
    sortProperties: ['start_datetime'],
    sortAscending: false
});

App.ReportsTasksController = Ember.ArrayController.extend({
    sortProperties: ['due'],
    sortAscending: false
});

App.ReportsContactsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true
});

App.ReportsTagsController = Ember.ArrayController.extend({
    sortProperties: ['name'],
    sortAscending: true
});

/***Models***/

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string'),
    organization: DS.attr('string'),
    phone: DS.attr('string'),
    address: DS.attr('string'),
    place: DS.attr('string'),
    updated_at: DS.attr('date')
});

App.Event = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    location: DS.attr('string'),
    start_datetime: DS.attr('date'),
    end_datetime: DS.attr('date'),
    updated_at: DS.attr('date')
});

App.Task = DS.Model.extend({
    title: DS.attr('string'),
    notes: DS.attr('string'),
    status: DS.attr('boolean'),
    due: DS.attr('date'),
	
	noDate: function() { 
	   return this.get('due') === undefined || this.get('due') === null;
	}
		.property('due'),
	hasDate: function() { 
	   return this.get('due') !== undefined && this.get('due') !== null;
	}
		.property('due'),
});

App.Tag = DS.Model.extend({
    name: DS.attr('string')
});

/*Routes*/

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return Ember.Object.create({
            contacts: this.get('store').find('contact'), 
            events: this.get('store').find('event'),
            tasks: this.get('store').find('task'),
            tags: this.get('store').find('tag')
        });
    },
	setupController: function(controller, model) {
		controller.set('model', model);
        this.controllerFor('contacts').set('model', model.contacts);
        this.controllerFor('events').set('model', model.events);
        this.controllerFor('tasks').set('model', model.tasks);
        this.controllerFor('tags').set('model', model.tags);
	}
});

App.ReportsEventsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('event');
  }
});

App.ReportsTasksRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('task');
  }
});

App.ReportsContactsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('contact');
  }
});

App.ReportsTagsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('tag');
  }
});

/*Tasks*/

App.TasksRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('task');
  }
});
App.TasksIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('tasks');
  }
});
App.TaskRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('task', params.task_id);
  }
});

/*Events*/

App.EventsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('event');
    }
});
App.EventsIndexRoute = App.EventsRoute.extend({
    model: function () {
        return this.modelFor('events');
    }
});
App.EventRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('event', params.event_id);
    }
});

/*Contacts*/

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('contact');
  }
});
App.ContactsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('contacts');
  }
});
App.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('contact', params.contact_id);
  }
});

/*Tags*/

App.TagsRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('tag');
  }
});
App.TagsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('tags');
  }
});
App.TagRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('tag', params.tag_id);
  }
});

/* Google Analytics Path Watching... */
/*
App.ApplicationController = Em.Controller.extend

    routeChanged: (->
        return unless window.ga
        Em.run.next ->
            ga('send', 'pageview', {
                'page': window.location.hash,
                'title': window.location.hash
                });
    ).observes('currentPath')
*/

/*function logout() {
    document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://daywon.s3-website-us-west-2.amazonaws.com/login.html";
}*/

setTimeout(function() {
    var logSelect = document.getElementById("eaddr");
    logSelect.onchange = function() {
        if (logSelect.value === "Logout") {
            console.log("changed");
            document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://daywon.s3-website-us-west-2.amazonaws.com/login.html";
        }
    }
}, 1000);

function rebindEvents() {

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

    authToken = query_string.authentication_token;
    userEmail = query_string.user_email;
    console.log ("AT: " + authToken);
    console.log ("UE: " + userEmail);
    $("#eaddr option:first").html(userEmail);

    $('nav a').click(function(evt){
		var link = $(this);
		var samePage = link.hasClass('active');
		samePage |= evt.ctrlKey || (evt.button != 0) // opening in new tab shouldn't show a loading bar on this tab
		if (!link.hasClass('dropdown-toggle'))
			samePage |= link.parent().hasClass('active');
		
		if (!samePage)
			$("#loader").addClass("showLoader");
    });

    $('.showitem').click(function(event){
        var subSortType = event.target.id;
        var subSortList = document.getElementsByClassName(subSortType);
        if ($(event.target).hasClass('selected')) {
            $(event.target).removeClass('selected');
            $(subSortList).css("display", "none");
        } else {
            $(event.target).addClass('selected');
            $(subSortList).css("display", "block");
        }
    });

    $('.sortitem').click(function(event){
        $("#loader").addClass("showLoader");
        setTimeout(function(){
            var sortType = event.target.id;
            if ($(event.target).hasClass('selected')) {
                if ($(event.target).find('ul').hasClass('invis')) {
                    $(event.target).find('ul').removeClass('invis');
                } else {
                    $(event.target).find('ul').addClass('invis');
                }
            } else {
                $('.selected').find('ul').removeClass("sortby");
                $(event.target).parent().find('.sortitem.selected').removeClass('selected');
                $('.invis').removeClass('invis');
                $(event.target).addClass('selected');
                $(event.target).find('ul').addClass("sortby");
            }
            $('.mainsort').click(function(event){
                var thisArrow = $(this).find(".accordionarrow");
                if ($(thisArrow).hasClass("arrowdown")) {
                    $(thisArrow).removeClass("arrowdown");
                }
                else {
                    $(thisArrow).addClass("arrowdown");
                }
            });
        }, 100);
    });

    $('.sortcont').click(function(e) {
    }).on('click', 'h3', function(e) {
        e.stopPropagation();
    });

    $('.suboption').click(function(event){
        $('.suboption').removeClass("selected");
        $(event.target).addClass("selected");
        setTimeout(function(){
            $(event.target).parent().addClass("invis");
        }, 300);
    });

    $('#collapseall').click(function(){
        $('.listitem').accordion({
            active: false,
            collapsible: true,
			beforeActivate: function(evt, obj) {
				var OFFSET = -30;
				var collapsing = obj.newHeader.length === 0;
				if (!collapsing)
					$('body').scrollTo($(this).offset().top - $('body').offset().top + OFFSET);
			}
        });
        $('.accordionarrow').removeClass('arrowdown');
    });

    $('#expandall').click(function(){
        var accord;
        var accords = $('.mainsort');
        for (var a = 0; a < accords.length; a++) {
            accord = accords[a];
            if ($(accord).attr("aria-selected") == "false") {
                accord.click();
            } else {
                console.log("nope");
            }
        }
        $('.accordionarrow').addClass('arrowdown');
    });

    $("#createicon").click(function(event){
        var createChoice = document.getElementById("createselect");
        $('.createForm').removeClass('selected');
        if ($(event.target).hasClass("addContact")) {
            createChoice.selectedIndex = 1;
            $('.createContact').addClass('selected');
        } else if ($(event.target).hasClass("addEvent")) {
            createChoice.selectedIndex = 2;
            $('.createEvent').addClass('selected');
        } else if ($(event.target).hasClass("addTask")) {
            $('.createTask').addClass('selected');
            createChoice.selectedIndex = 3;
        } else if ($(event.target).hasClass("addTag")) {
            $('.createTag').addClass('selected');
            createChoice.selectedIndex = 4;
        }
    });

    $('.listitem > .sortitem > select').click();
    $('.mainsort').click(function(event){
        var thisArrow = $(this).find(".accordionarrow");
        if ($(thisArrow).hasClass("arrowdown")) {
            $(thisArrow).removeClass("arrowdown");
        }
        else {
            $(thisArrow).addClass("arrowdown");
        }
        /*if ($(event.target).attr("aria-selected") != "true") {
            $(event.target).click(function(){
                return false;
            });
        }*/
    });

    $('.settingoption > a').click(function(event){
        if ($(event.target).hasClass('selected')) {
            $(event.target).removeClass('selected');
            $(event.target).siblings('a').addClass('selected');
        } else {
            $(event.target).addClass('selected');
            $(event.target).siblings('a').removeClass('selected');
        }
    });

    $('.sidelist > a > li').click(function(event){
        var itemList = $('.sidelist > a > li').index(this);
        var detailsList = $('.textrow');
        var phoneNo = $('.phonenumber');
        var contLoc = $('.contactlocation');
        var eField = $('.emailfield');
        $('.phonenumber.selected').removeClass('selected');
        $(phoneNo[itemList]).addClass('selected');
        $('.contactlocation.selected').removeClass('selected');
        $(contLoc[itemList]).addClass('selected');            
        $('.textrow.selected').removeClass("selected");
        $(detailsList[itemList]).addClass("selected");
        $('.emailfield.selected').removeClass('selected');
        $(eField[itemList]).addClass('selected');
        $("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
        var splitString = $(event.target).html().split(" ");
        var splitString1 = splitString[0].toLowerCase();
        if (splitString.length > 1) {
            var splitString2 = splitString[1].toLowerCase();
        }
        $('#profilepic').attr("src", "img/contact.png");
        //$('#emailfield').html(splitString1 + splitString2 + "@evenspring.com");

        var text = "";
        var possible = "0123456789";
        for( var i=0; i < 10; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            if (i == 2 || i == 5) {
                text += "-";
            }
        }
        //$("#phonenumber").html(text);

        var personItem = new Array();
        var curPerson;
        var perRow = $('.personrow');
        personItem[0] = "Harris Weaver";
        personItem[1] = "Momin Khan";
        personItem[2] = "Chris Hooe";
        personItem[3] = "Andrew Elgert";
        personItem[4] = "Aujang Abadi";
        personItem[5] = "John Will";
        personItem[6] = "Tyler Carbone";
        personItem[7] = "Allen Hatzi";
        personItem[8] = "Elizabeth Hatzi";
        personItem[9] = "JP Bonner";
        personItem[10] = "Emily XiaoXiao";
        personItem[11] = "Mike Odum";
        personItem[12] = "Brendan Mauer";
        personItem[13] = "Han Solo";
        personItem[14] = "Taylor Smith";
        personItem[15] = "Jeff Macclintock";
        personItem[16] = "Kevin O'Brien";
        personItem[17] = "Katy Hummel";
        personItem[18] = "Anna Tu";
        personItem[19] = "Derrick Gonzalo";
        personItem[20] = "Austin Gore";
        personItem[21] = "Brooke Hammel";
        personItem[22] = "Laurel Liles";
        personItem[23] = "Ronnie Shupe";
        personItem[24] = "Doug Wendel";
        personItem[25] = "Ronald Puryear";
        personItem[26] = "Mary Pedigo";
        personItem[27] = "Lauren Morton";
        personItem[28] = "Bo Qin";
        personItem[29] = "Brittany Hale";

        for( var f=0; f < 5; f++ ) {
            curPerson = Math.floor(Math.random() * 29) + 1;
            $(perRow[f]).find('h4').html(personItem[curPerson]);
        }

        var textArray = new Array();
        var curText;
        var textRow = $('.textrow');
        textRow = textRow[0];
        textArray[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut posuere arcu a iaculis malesuada. Aenean pretium varius fermentum. Nam dolor sem, convallis bibendum libero eu, faucibus venenatis velit. Proin sed nulla non dui porttitor scelerisque et placerat purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi arcu nibh, egestas non egestas vitae, placerat vel enim. Proin ultrices lacinia nulla, a cursus dolor faucibus vel.";
        textArray[1] = "Vestibulum dictum arcu sit amet mollis hendrerit. Aenean sed enim at ipsum vehicula porttitor sed et lorem. Aenean eget urna vitae eros interdum hendrerit. Proin elementum arcu vel ligula ultrices hendrerit. Cras et tempor elit, nec rhoncus ante. Donec rutrum neque elit, at hendrerit nisi pulvinar a. Maecenas in dolor vel ligula aliquet facilisis sit amet vel augue. Donec at vestibulum tortor, quis hendrerit mauris. Curabitur rutrum augue sed pretium venenatis.";
        textArray[2] = "Donec sed nisl ut nulla adipiscing ornare. Suspendisse ullamcorper orci lectus, ut consequat purus condimentum nec. Curabitur elementum lacus eu ligula cursus euismod. Ut id suscipit justo. Donec dapibus, dolor sit amet hendrerit tincidunt, nisi mi hendrerit tortor, in convallis augue diam sit amet sapien. Pellentesque urna neque, fermentum at lorem vitae, consectetur blandit nunc. Pellentesque dapibus dictum turpis, ut convallis magna placerat sit amet. Vivamus feugiat dapibus risus. Fusce euismod, nisl vitae fermentum luctus, enim elit tincidunt mauris, sed feugiat quam massa sit amet nunc. Fusce faucibus eget tellus eget ornare. Ut eget erat eget sapien aliquet fringilla pellentesque at urna. Donec tincidunt velit faucibus tincidunt condimentum. Donec viverra tellus at porttitor egestas. Mauris consectetur iaculis commodo.";
        textArray[3] = "Aliquam ultricies ligula ut elit euismod eleifend. Praesent mollis volutpat ultrices. Aliquam urna lacus, congue at odio a, aliquet condimentum elit. Vivamus velit lectus, accumsan vitae convallis ac, feugiat id eros. Ut id lacus sit amet ligula molestie egestas quis at tortor. Fusce tempor leo a consectetur varius. Etiam a turpis eu sapien volutpat condimentum. Sed eu adipiscing risus.";
        textArray[4] = "Curabitur dignissim nunc vitae laoreet ullamcorper. Fusce euismod sem tincidunt nisl luctus fringilla sit amet sed metus. Nulla in volutpat elit. Proin ac hendrerit velit. Nunc eu dui in lacus ullamcorper facilisis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam in nulla eget sem pharetra vulputate. Donec vestibulum, ipsum at porta egestas, nisi nibh congue massa, sed lobortis dolor augue a dui. Mauris ut convallis nibh. Etiam at fringilla risus. Etiam a mattis orci, sed porttitor ipsum. Pellentesque dapibus posuere nisl, et condimentum eros malesuada in.";
        textArray[5] = "Donec porta, dui sed volutpat egestas, risus arcu posuere massa, eget eleifend dolor nisi ac magna. Nullam placerat felis ultrices ante facilisis ultrices. In sit amet consequat est. In pharetra fermentum eleifend. Vivamus cursus, justo sed vestibulum placerat, turpis velit rutrum leo, non placerat nunc massa quis nisi. Quisque vitae lectus sem. Nunc adipiscing eget orci et imperdiet. Sed et sodales turpis. Ut eu quam sodales, luctus augue non, luctus nisi.";
        textArray[6] = "Mauris gravida volutpat convallis. Duis lobortis nibh neque, eu adipiscing purus sagittis eu. Mauris sit amet est sit amet elit lacinia semper semper sit amet nulla. Nam eu imperdiet mi, non consequat libero. Ut congue metus in orci suscipit, sed blandit diam laoreet. Nunc mattis lacinia mauris ut blandit. Integer porta mauris eget consectetur eleifend. Sed rutrum dolor a venenatis commodo. Suspendisse vitae molestie nisl, a viverra enim. Aenean vulputate tempus scelerisque. Sed risus turpis, scelerisque non eros sit amet, interdum luctus quam. Nulla facilisi. Ut molestie posuere luctus. Donec consequat eleifend euismod.";
        textArray[7] = "Praesent tempus enim eget velit aliquam, sed blandit dui suscipit. Mauris varius facilisis dui, vel laoreet diam congue ut. Nulla eget felis pulvinar, scelerisque massa sed, fermentum nulla. In quis odio sed arcu feugiat egestas et eu est. Cras ut urna vel ante condimentum viverra in sed enim. Integer risus orci, bibendum ut turpis vel, volutpat vehicula est. Maecenas ac dapibus eros, id luctus massa. Phasellus blandit, risus ut fringilla dapibus, urna nulla convallis sapien, eget faucibus arcu quam id ante. Fusce posuere ullamcorper nisl, id dignissim massa vehicula vel. Phasellus sagittis ipsum at lorem semper, sit amet vulputate odio condimentum. Pellentesque ac fermentum lacus. Donec fermentum metus eget pharetra ullamcorper. Proin consequat dui ut justo tincidunt, sed luctus mauris consectetur. In non convallis diam, in tincidunt sapien.";
        textArray[8] = "Maecenas nec orci in sapien mattis ornare. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse nec tincidunt purus. Suspendisse pulvinar commodo adipiscing. Sed pulvinar mollis aliquam. Cras facilisis facilisis turpis. In lobortis mauris sed quam lacinia, vel tristique odio consectetur. Donec id mauris arcu. In volutpat malesuada felis, non laoreet purus gravida a. Duis aliquet sapien ante, at tempus dolor blandit vel. Nunc pharetra, est et sodales molestie, purus libero blandit ante, id fringilla ante justo a sem. Nunc malesuada elementum ante lacinia tempus. Cras ultrices lectus ullamcorper lectus auctor congue.";
        textArray[9] = "Sed nec magna at orci euismod pulvinar sed ut augue. Ut sollicitudin mi metus, non ultricies turpis fringilla id. Vestibulum sed ipsum quis magna fringilla posuere. Suspendisse potenti. Fusce condimentum auctor blandit. Vivamus urna lectus, interdum quis gravida vel, blandit ut justo. Sed id massa a est commodo porta. Donec mauris augue, gravida ut quam in, mattis posuere nunc. Phasellus eu est sed lectus scelerisque cursus nec non nibh. Cras semper orci quis sem tristique viverra. In vel nulla suscipit, tempor turpis a, molestie justo. In id nulla vitae turpis sollicitudin adipiscing ac nec magna. Vivamus sed arcu purus. Nulla condimentum condimentum aliquam. Vestibulum ut ultricies arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.";

        /*for( var g=0; g < 5; g++ ) {
            curText = Math.floor(Math.random() * 10);
            $(textRow).html(textArray[curText]);
        }*/

        var mArray = new Array();
        var curMonth;
        var mRow = $('#bday');
        mArray[0] = "January";
        mArray[1] = "February";
        mArray[2] = "March";
        mArray[3] = "April";
        mArray[4] = "May";
        mArray[5] = "June";
        mArray[6] = "July";
        mArray[7] = "August";
        mArray[8] = "Semptember";
        mArray[9] = "October";
        mArray[10] = "November";
        mArray[11] = "December";

        /*for( var h=0; h < 5; h++ ) {
            curMonth = Math.floor(Math.random() * 11) + 1;
            var ranDay = Math.floor(Math.random() * 28) + 1;
            var ranYear = Math.floor(Math.random() * 10);
            $(mRow[h]).html(mArray[curMonth] + " " + ranDay + ", " + "198" + ranYear);
        }*/

        var taskItem = new Array();
        var curTask;
        var tRow = $('.taskrow');
        taskItem[0] = "Meet about Day Won";
        taskItem[1] = "Go skydiving";
        taskItem[2] = "Play video games";
        taskItem[3] = "Go for a hike";
        taskItem[4] = "Go swimming";
        taskItem[5] = "Kill the bad guys";
        taskItem[6] = "Finish BBTC";
        taskItem[7] = "Play guitar";
        taskItem[8] = "Pick up groceries";
        taskItem[9] = "Do laundry";
        taskItem[10] = "Mow the lawn";
        taskItem[11] = "Play drums";
        taskItem[12] = "Watch football";
        taskItem[13] = "Write an application";
        taskItem[14] = "Go scuba diving";
        taskItem[15] = "Go racing";
        taskItem[16] = "Go to the beach";
        taskItem[17] = "Get lunch";
        taskItem[18] = "Go work out";
        taskItem[19] = "Write a novel";
        taskItem[20] = "Watch a movie";
        taskItem[21] = "Study for the test";
        taskItem[22] = "Grab a beer";
        taskItem[23] = "Go by the bank";
        taskItem[24] = "Listen to music";
        taskItem[25] = "Get some sleep";
        taskItem[26] = "Cook dinner";
        taskItem[27] = "Go to the concert";
        taskItem[28] = "Play fooseball";
        taskItem[29] = "Run a marathon";

        for( var j=0; j < 5; j++ ) {
            curTask = Math.floor(Math.random() * 29) + 1;
            $(tRow[j]).find('h4').html(taskItem[curTask]);
        }

        var eventItem = new Array();
        var curEvent;
        var eRow = $('.eventrow');
        eventItem[0] = "DayWon Meeting";
        eventItem[1] = "Skydiving Trip";
        eventItem[2] = "E3";
        eventItem[3] = "Hiking Trip";
        eventItem[4] = "Swimming Lessons";
        eventItem[5] = "The World Cup";
        eventItem[6] = "NBA Finals";
        eventItem[7] = "Dinner with Parents";
        eventItem[8] = "Grocery Shopping";
        eventItem[9] = "Thanksgiving Day";
        eventItem[10] = "New Years";
        eventItem[11] = "Rock Concert";
        eventItem[12] = "Football Sunday";
        eventItem[13] = "HackRVA";
        eventItem[14] = "Scuba Trip";
        eventItem[15] = "Nascar Race";
        eventItem[16] = "Beach Vacation";
        eventItem[17] = "Lunch with John";
        eventItem[18] = "RVA Marathon";
        eventItem[19] = "Book Signing";
        eventItem[20] = "Movie Premier";
        eventItem[21] = "Final Exam";
        eventItem[22] = "Bar Crawl";
        eventItem[23] = "Career Fair";
        eventItem[24] = "Tennis Match";
        eventItem[25] = "Tacky Sweater Party";
        eventItem[26] = "Potluck";
        eventItem[27] = "Presidential Election";
        eventItem[28] = "Bingo Night";
        eventItem[29] = "Art Show";

        for( var k=0; k < 5; k++ ) {
            curEvent = Math.floor(Math.random() * 29) + 1;
            $(eRow[k]).find('h4').html(eventItem[curEvent]);
        }

        if ($(window).width() < 768) {
            $("#contactpanel2").addClass('mobileIn');
        }

    });

    $("form").unbind('submit').bind('submit', function(event){		
		var showPopupMessage = function(target, message, style) {
			var statusPopup = new Opentip($(target), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
			statusPopup.show();
			statusPopup.container.css('z-index', 100000);
			setTimeout(function() {
				statusPopup.hide();
			}, 2000);
		};
		
        var data = {};
		var url = "";
		var objectDescription = "none";
        if ($(event.target).parent().hasClass("createTag")) {
            var tagTitle = $("#tagName").val();
            tagTitle = String(tagTitle);
            var data = {
                tag: {
                    name: tagTitle
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/tags";
			objectDescription = "Tag: " + tagTitle;
        } else if ($(event.target).parent().hasClass("createTask")) {
            var taskTitle = $("#taskName").val();
            taskTitle = String(taskTitle);
            var taskDesc = $("#taskNotes").val();
            taskDesc = String(taskDesc);
            var taskDue = $("#taskDue").val();
            console.log("due: " + taskDue);
            var data = {
                task: {
                    title: taskTitle,
                    notes: taskDesc,
                    status: false,
                    due: taskDue
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/tasks";
			objectDescription = "Task: " + taskTitle;
        } else if ($(event.target).parent().hasClass("createContact")) {
            var contactFirst = String($("#contactFirst").val());
            var contactLast = String($("#contactLast").val());
            var contactTitle = contactFirst + " " + contactLast;
            var contactOrg = $("#contactOrg").val();
            contactOrg = String(contactOrg);
            var contactNo = $("#contactNumber").val();
            contactNo = String(contactNo);
            var contactAddress = $("#contactAddr").val();
            contactAddress = String(contactAddress);
            var contactPl = $("#contactPlace").val();
            contactPl = String(contactPl);
            var data = {
                contact: {
                    name: contactTitle,
                    organization: contactOrg,
                    phone: contactNo,
                    address: contactAddress,
                    place: contactPl
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/contacts";
			objectDescription = "Contact: " + contactTitle;
        } else if ($(event.target).parent().hasClass("createEvent")) {
            var eventTitle = $("#eventName").val();
            eventTitle = String(eventTitle);
            var eventDesc = $("#eventDetails").val();
            eventDesc = String(eventDesc);
            var eventLoc = $("#eventLocation").val();
            eventLoc = String(eventLoc);
            var eventSt = $("#eventStart").val();
            var eventEn = $("#eventEnd").val();
            var data = {
                event: {
                    title: eventTitle,
                    description: eventDesc,
                    location: eventLoc,
                    start_datetime: eventSt,
                    end_datetime: eventEn
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/events";
			objectDescription = "Event: " + eventTitle;
        }
		
		$.ajax({
			type: 'POST',
			url: url,
			contentType: "application/json",
			dataType: "json",
			data: data,
			headers: {
				"X-AUTHENTICATION-TOKEN": authToken,
				"X-AUTHENTICATION-EMAIL": userEmail
			},
			success: function (data) {
				console.log(data);
				showPopupMessage(event.target, "Successfully created " + objectDescription, "success");
			},
			error: function (e) {
				console.log(e.statusText);
				showPopupMessage(event.target, "Error creating " + objectDescription, "error");
			}
		});
        return false;
    });

    $('#tasklist > li').click(function(event){
        $("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
    });

    $('#eventlist > li').click(function(event){
        $("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
    });

    $('#taglist > li').click(function(event){
        $("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
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
            $( "span:contains('" + timeView + "')" ).click();
        }
    });

    $('#detailmenubar > img').click(function(event){
        var viewChoice = $('.infopanel');
        $('.infopanel.selected').removeClass('selected');
        $('img.selected').removeClass('selected');
        $(event.target).addClass('selected');
        if (this.src.indexOf("contact") != -1) {
            $(viewChoice[0]).addClass('selected');
        } else if (this.src.indexOf("task") != -1) {
            $(viewChoice[1]).addClass('selected');
        } else if (this.src.indexOf("event") != -1) {
            $(viewChoice[2]).addClass('selected');
        } else if (this.src.indexOf("tag") != -1) {
            $(viewChoice[3]).addClass('selected');
        }
    });

    $("#createselect").change(function(){
        var chosen = "create" + $("#createselect option:selected").html();
        var chosenForm = document.getElementsByClassName(chosen);
        chosenForm = chosenForm[0];
        $('.createForm.selected').removeClass('selected');
        $(chosenForm).addClass('selected');
    });

    $(".listSorter").change(function(){
        setTimeout(function(){
            rebindEvents();
        }, 100);
    });

    if ($("#contactShow").length) {
        var showContacts = document.getElementById("contactShow");
        $(showContacts).unbind('change').change(function() {
            if (showContacts.value === "Recent") {
                $("#showRecent").click();
            } else if (showContacts.value === "All") {
                $("#showAll").click();
            }
        });
    }

    if ($("#contactSort").length) {
        var sortContacts = document.getElementById("contactSort");
        sortContacts.onchange = function() {
            if (sortContacts.value === "Company") {
                $("#byCompany").click();
            } else {
                $("#byName").click();
            }
        }
    }

    if ($("#taskSort").length) {
        var sortTasks = document.getElementById("taskSort");
        sortTasks.onchange = function() {
            if (sortTasks.value === "Priority") {
                $("#byPriority").click();
            } else if (sortTasks.value === "Alphabetically") {
                $("#byName").click();
            } else if (sortTasks.value === "Contact") {
                $("#byContact").click();
            } else {
                $("#byDate").click();
            }
        }
    }

    $('.flipswitch').unbind('click').click(function(){
        var slider = $('#detailPanel');
        if (slider.hasClass('panelIn')) {
            slider.attr("class", "panelOut");
            $('#fliparrow').addClass("flipagain");
            setTimeout(function(){

            }, 400)
        } else {
            slider.attr("class", "panelIn");
            $('#fliparrow').attr("class", "flipimage");
            setTimeout(function(){
                $('#fliparrow').attr("class", "flipped");
            }, 400);
        }
    });

    if ($('#calendarcont').length) {
        $('#calendarcont').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true
        });
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
    $('#curDate').html(today);

    setTimeout(function(){
        $('#collapseall').click();
        var fullCount = $('.sidelist > a');
        $("#itemCount").html(fullCount.length);
        setTimeout(function(){
            $(".spaceimage").remove();
            $(".dashitem").accordion("refresh");
        }, 1000);
    }, 100);

    Opentip.styles.bottomtip = {
      tipJoint: "top",
      group: "tags",
      target: true,
      offset: [0, -140],
      delay: 0
      /*className: "myStyle",
      background: "#000"*/
    };
    Opentip.styles.toptip = {
      tipJoint: "bottom",
      group: "tags",
      target: true,
      offset: [0, -130],
      delay: 0
      /*className: "myStyle",
      background: "#000"*/
    };
    Opentip.styles.righttip = {
      tipJoint: "left",
      group: "tags",
      target: true,
      delay: 0,
      offset: [10, -140]
      /*className: "myStyle",
      background: "#000"*/
    };
    Opentip.styles.success = {
      tipJoint: "top",
      target: true,
      offset: [0, -140],
      delay: 0,
      background: "#72FF72",
	  borderColor: "#3CFF3C",
    };
    Opentip.styles.error = {
      tipJoint: "top",
      target: true,
      offset: [0, -140],
      delay: 0,
      background: "#FF7272",
	  borderColor: "#FF3C3C",
    };
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
        new Opentip("#maintag", "Tasks", {
            style: "bottomtip"
        });
    }
    if ($("#printimg").length) {
        new Opentip("#printimg", "Print", {
            style: "bottomtip"
        });
    }
    if ($("#orphanimage").length) {
        new Opentip("#orphanimage", "Orphans", {
            style: "bottomtip"
        });
    }
    if ($("#detailmenubar").length) {
        new Opentip("#detailmenubar > img:first-child", "Contacts", {
            style: "bottomtip"
        });     
        new Opentip("#detailmenubar > img:nth-child(2)", "Events", {
            style: "bottomtip"
        });    
        new Opentip("#detailmenubar > img:nth-child(3)", "Tasks", {
            style: "bottomtip"
        });     
        new Opentip("#detailmenubar > img:nth-child(4)", "Tags", {
            style: "bottomtip"
        }); 
        new Opentip("#detailmenubar > img:last-child", "Delete", {
            style: "bottomtip"
        }); 
        new Opentip("#detailmenubar > a > img", "Create", {
            style: "bottomtip"
        }); 
    }
    if ($("#dashcreate").length) {
        new Opentip("#dashcreate", "Create", {
            style: "bottomtip"
        });
    }
    if ($('.flipswitch').length) {
        new Opentip(".flipswitch", "Details View", {
            style: "righttip"
        });
    }
    if ($('.small-create-icon').length) {
        new Opentip(".small-create-icon", "Create", {
            style: "toptip"
        });
    }
    setTimeout(function(){
        $("#loader").removeClass("showLoader");
    }, 300);
	
	// navbar active state for the dropdown View button
	var viewMenu = $('#viewmenu');
	var links = $('a', viewMenu);
	if (links.hasClass('active'))
		viewMenu.addClass('active');
	else viewMenu.removeClass('active');
	
	// javascript-based calling of modals so as to not interfere with Ember URLS with #
	var allModals = $('.modalDialog');
	var closeButtons = $('.close');
	closeButtons.click(function(){ allModals.removeClass('active'); });	
	var modal1Links = $('.openModal');
	modal1Links.click(function(){ $('#openModal').addClass('active'); });
	var modal2Links = $('.openModal2');
	modal2Links.click(function(){ $('#openModal2').addClass('active'); });
	var modal3Links = $('.openModal3');
	modal3Links.click(function(){ $('#openModal3').addClass('active'); });
}

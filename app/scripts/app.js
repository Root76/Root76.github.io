var App = window.App = Ember.Application.create();

/***Router***/
App.Router.map(function () {
    this.resource("dashboard");
    this.resource("contacts", function() {
        this.resource("contact", { path: "/:contact_id" });    
    });
    this.resource("events", function() {
        this.resource("event", { path: "/:event_id" });    
    });
    this.resource("tasks", function() {
        this.resource("task", { path: "/:task_id" });
    });
    this.resource("tags", function() {
        this.resource("tag", { path: "/:tag_id" });
    });
    this.resource("orphans", function() {
        this.resource("orphan", { path: "/:orphan_id" });    
    });
    this.resource("create", function() {
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

        $(".listitem").accordion({
            active: false,
            collapsible: true
        });

        $('.showitem').click(function(event){
            var sortType = event.target.id;;
            var sortList = document.getElementsByClassName(sortType);;
            if ($(event.target).hasClass('selected')) {
                $(event.target).removeClass('selected');
                $(sortList).css("display", "none");
            } else {
                $(event.target).addClass('selected');
                $(sortList).css("display", "block");                
            }
        });

        $('.sortitem').click(function(event){
            if ($(event.target).hasClass('selected') || $(event.target).parent().hasClass('sortby')) {
                console.log('already selected');
                if ($(event.target).find('ul').hasClass('invis')) {
                    $(event.target).find('ul').removeClass('invis');
                } else {
                    $(event.target).find('ul').addClass('invis');
                }
            } else {
                console.log("not selected");
                $('.selected').find('ul').removeClass("sortby");
                $(event.target).parent().find('.sortitem.selected').removeClass('selected');
                $('.invis').removeClass('invis');
                $(event.target).addClass('selected');
                $(event.target).find('ul').addClass("sortby");
            }
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
                collapsible: true
            });
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
        });

        $('form').submit(function(){
            return false;
        });

        $('.sidelist > li').click(function(event){

            $("#contactname").html($(event.target).html());
            $('.currentcontact').removeClass("currentcontact");
            $(event.target).addClass("currentcontact");
            var splitString = $(event.target).html().split(" ");
            var splitString1 = splitString[0].toLowerCase();
            if (splitString.length > 1) {
                var splitString2 = splitString[1].toLowerCase();
            }
            $('#profilepic').attr("src", "img/" + splitString1 + ".png");
            $('#emailfield').html(splitString1 + splitString2 + "@evenspring.com");

            var text = "";
            var possible = "0123456789";
            for( var i=0; i < 10; i++ ) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                if (i == 2 || i == 5) {
                    text += "-";
                }
            }
            $("#phonenumber").html(text);

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
                console.log("item: " + personItem[curPerson]);
                $(perRow[f]).find('h4').html(personItem[curPerson]);
            }

            var textArray = new Array();
            var curText;
            var textRow = $('#textrow');
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

            for( var g=0; g < 5; g++ ) {
                curText = Math.floor(Math.random() * 10);
                $(textRow).html(textArray[curText]);
            }

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

            for( var h=0; h < 5; h++ ) {
                curMonth = Math.floor(Math.random() * 11) + 1;
                var ranDay = Math.floor(Math.random() * 28) + 1;
                var ranYear = Math.floor(Math.random() * 10);
                $(mRow[h]).html(mArray[curMonth] + " " + ranDay + ", " + "198" + ranYear);
            }

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
                console.log("item: " + taskItem[curTask]);
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
                console.log("item: " + eventItem[curEvent]);
                $(eRow[k]).find('h4').html(eventItem[curEvent]);
            }

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

        $('#calendarcont').datepicker();

        console.log ("query string: " + authToken);
        console.log ("email: " + userEmail);
        $("#loggedin").find("span").html(userEmail);


    });
  }.observes('currentPath')
});

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

/***Rest Adapter***/

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://staging-krqwhjugxs.elasticbeanstalk.com',
  headers: {
    "X-AUTHENTICATION-TOKEN": authToken,
    "X-AUTHENTICATION-EMAIL": userEmail
  }
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});

/***Models***/

App.Contact = DS.Model.extend({
    name: DS.attr('string')
});
App.Event = DS.Model.extend({
    title: DS.attr('string')
});
App.Task = DS.Model.extend({
    title: DS.attr('string')
});

/*Routes

/*Index*/
/*App.IndexRoute = Ember.Route.extend({
    model: function() {
      return this.modelFor('contacts');
    }
});*/

/*Tasks

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
    return this.get('store').find('task', params.Task_id);
  }
});

/*Events

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

/*Contacts

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

/*var people = App.Contact.find(1);
App.Contact = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
});*/

/*
App.ContactsRoute = Ember.Route.extend({
    model: function() {
        return Ember.$.getJSON('https://ec2-54-204-113-9.compute-1.amazonaws.com/');
    }
});
*/

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
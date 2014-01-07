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
        /*this.resource("create.contact", {path:'/contact'}, function(){
            this.route("index");
        });*/
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

        $('#contactlist > li').click(function(event){
            $("#contactname").html($(event.target).html());
            $('.currentcontact').removeClass("currentcontact");
            $(event.target).addClass("currentcontact");
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

        $('#calendarcont').datepicker();

    });
  }.observes('currentPath')
});

DS.RESTAdapter.reopen({
  host: 'https://ec2-54-204-113-9.compute-1.amazonaws.com/',
  headers: {
    "API_KEY": "secret key",
    "ANOTHER_HEADER": "Some header value"
  }
});

/*
App.ContactsRoute = Ember.Route.extend({
    model: function() {
        return Ember.$.getJSON('http://staging-krqwhjugxs.elasticbeanstalk.com/contacts');
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
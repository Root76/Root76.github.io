setTimeout(function() {
    var logSelect = document.getElementById("eaddr");
    logSelect.onchange = function() {
        if (logSelect.value === "Logout") {
            document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://daywon.s3-website-us-west-2.amazonaws.com/login.html";
        }
    }
}, 1000);

function rebindEvents() {

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
            header: "h3.mainsort", // force only 1 header in this accordion
			beforeActivate: function(evt, obj) {
				var OFFSET = -30;
				var collapsing = obj.newHeader.length === 0;
				if (!collapsing)
					$('body').scrollTo($(this).offset().top - $('body').offset().top + OFFSET);
			}
        });
        $('.accordionarrow').removeClass('arrowdown');
    });
	
	$('.detailSection').accordion({
		active: 0,
		collapsible: true,
		beforeActivate: function(evt, obj) {
			var collapsing = obj.newHeader.length === 0;
			if (collapsing)
				$(evt.target).find('.detailArrow').removeClass('arrowdown');
			else
				$(evt.target).find('.detailArrow').addClass('arrowdown');
		}
	});
	$('.detailSection').click();

    $('#expandall').click(function(){
		var oldScrollTo = $.fn.scrollTo; // temp disable scrollTo
		$.fn.scrollTo = function() {}; 
	
        var accord;
        var accords = $('.mainsort');
        for (var a = 0; a < accords.length; a++) {
            accord = accords[a];
            if ($(accord).attr("aria-selected") == "false") {
                accord.click();
            }
        }
        $('.accordionarrow').addClass('arrowdown');
		
		$.fn.scrollTo = oldScrollTo; // restore scrollTo
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
	
	$("#contactsdash").click(function() {
		$("#viewmenu > a")[0].click();
	});

    $(".backArrow").click(function(){
        $("#contactpanel2").attr("class", "col-md-7 mobileOut");
        $("#eventpanel2").attr("class", "col-md-7 mobileOut");
        $("#taskpanel2").attr("class", "col-md-7 mobileOut");
        $("#tagpanel2").attr("class", "col-md-7 mobileOut");
        setTimeout(function(){
            $("#contactpanel2").removeClass("mobileOut");
            $("#eventpanel2").removeClass("mobileOut");
            $("#taskpanel2").removeClass("mobileOut");
            $("#tagpanel2").removeClass("mobileOut");
        }, 600);
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
    $(".dynamicEmail").parent().click(function(){
        /*Grabbing the innerHTML alone doesn't work because of the <script> tags Ember inserts around model data. As a workaround, we grab all of the innerHTML, load it into a hidden div, drop the <script> tags from the DOM, and grab the hidden div's innerHTML (just the email address)*/
        $(".desktopEmail").attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=");
        $(".mobileEmail").attr("href", "mailto:");
        var desktopLink = $(".desktopEmail").attr("href");
        var mobileLink = $(".mobileEmail").attr("href");
        var emailAddr = $(".emailfield");
        emailAddr = $(emailAddr[0]).html();
        $("#preloader").html(emailAddr);
        $("#preloader > script").remove();
        emailAddr = $("#preloader").html();
        console.log("email Addr: " + emailAddr);
        $(".desktopEmail").attr("href", desktopLink + emailAddr);
        $(".mobileEmail").attr("href", mobileLink + emailAddr);
        console.log("desktop link: " + $('.desktopEmail').attr('href'));
        console.log("mobile link: " + $('.mobileEmail').attr('href'));
    });

    $('.sidelist > a > li').click(function(event){
        var itemList = $('.sidelist > a > li').index(this);
        var detailsList = $('.textrow');
        var phoneNo = $('.phonenumber');
        var contLoc = $('.contactlocation');
        var eField = $('.emailfield');
        var clickedRow = $(event.target).closest('li');
        $('.phonenumber.selected').removeClass('selected');
        $(phoneNo[itemList]).addClass('selected');
        $('.contactlocation.selected').removeClass('selected');
        $(contLoc[itemList]).addClass('selected');            
        $('.textrow.selected').removeClass("selected");
        $(detailsList[itemList]).addClass("selected");
        $('.emailfield.selected').removeClass('selected');
        $(eField[itemList]).addClass('selected');
        $('.currentcontact').removeClass("currentcontact");
        clickedRow.addClass("currentcontact");
        var splitString = clickedRow.html().split(" ");
        var splitString1 = splitString[0].toLowerCase();
        if (splitString.length > 1) {
            var splitString2 = splitString[1].toLowerCase();
        }

        if ($(window).width() < 768) {
            $("#contactpanel2").addClass('mobileIn');
            $("#eventpanel2").addClass('mobileIn');
            $("#taskpanel2").addClass('mobileIn');
            $("#tagpanel2").addClass('mobileIn');
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

		var relatedContacts = $("li[objectid*='contact']");
		var relatedEvents = $("li[objectid*='event']");
		var relatedTasks = $("li[objectid*='task']");
		var relatedTags = $("li[objectid*='tag']");
		var contactIds = new Array();
		var eventIds = new Array();
		var taskIds = new Array();
		var tagIds = new Array();
		var thisObject;
		var i;

		for (i = 0; i < relatedContacts.length; i++) {
			thisObject = $(relatedContacts[i]).attr('objectid');
			thisObject = thisObject.replace(/\D/g,'');
        	contactIds[i] = thisObject;
        }
        //contactIds = contactIds.join(",");
		for (i = 0; i < relatedEvents.length; i++) {
			thisObject = $(relatedEvents[i]).attr('objectid');
			thisObject = thisObject.replace(/\D/g,'');
        	eventIds[i] = thisObject;
        }
        //eventIds = eventIds.join(",");
		for (i = 0; i < relatedTasks.length; i++) {
			thisObject = $(relatedTasks[i]).attr('objectid');
			thisObject = thisObject.replace(/\D/g,'');
        	taskIds[i] = thisObject;
        }
		//taskIds = taskIds.join(",");
		for (i = 0; i < relatedTags.length; i++) {
			thisObject = $(relatedTags[i]).attr('objectid');
			thisObject = thisObject.replace(/\D/g,'');
        	tagIds[i] = thisObject;
        }
		//tagIds = tagIds.join(",");

		console.log("contacts: " + contactIds);
		console.log("events: " + eventIds);
		console.log("tasks: " + taskIds);
		console.log("tags: " + tagIds);

        if ($(event.target).parent().hasClass("createTag")) {
            var tagTitle = $("#tagName").val();
            tagTitle = String(tagTitle);
            var data = {
                tag: {
                    name: tagTitle,
                    contact_ids: contactIds,
                    event_ids: eventIds,
                    task_ids: taskIds
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/tags";
			objectDescription = "Tag: " + tagTitle;
        } else if ($(event.target).parent().hasClass("createTask")) {
            var taskTitle = $("#taskName").val();
            taskTitle = String(taskTitle);
            var taskDesc = $("#taskNotes").val();
            taskDesc = String(taskDesc);
            var taskDue = moment($("#taskDue").val()).format();
            console.log("due: " + taskDue);
            var data = {
                task: {
                    title: taskTitle,
                    notes: taskDesc,
                    status: false,
                    due: taskDue,
                    contact_ids: contactIds,
                    event_ids: eventIds,
                    tag_ids: tagIds
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
                    email: contactPl,
                    event_ids: eventIds,
                    task_ids: taskIds,
                    tag_ids: tagIds
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
            var eventSt = moment($("#eventStart").val()).format();
            var eventEn = moment($("#eventEnd").val()).format();
            var data = {
                event: {
                    title: eventTitle,
                    description: eventDesc,
                    location: eventLoc,
                    start_datetime: eventSt,
                    end_datetime: eventEn,
                    contact_ids: contactIds,
                    task_ids: taskIds,
                    tag_ids: tagIds
                }
            };
			url = "http://daywon-api-staging.herokuapp.com/events";
			objectDescription = "Event: " + eventTitle;
        }
        console.log(data);
		
		$.ajax({
			type: 'POST',
			url: url,
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(data),
			headers: {
				"X-AUTHENTICATION-TOKEN": "4N9-_NWfYvYxpesMVpne",
				"X-AUTHENTICATION-EMAIL": "hweaver@evenspring.com"
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
        //$("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
    });

    $('#eventlist > li').click(function(event){
        //$("#contactname").html($(event.target).html());
        $('.currentcontact').removeClass("currentcontact");
        $(event.target).addClass("currentcontact");
    });

    $('#taglist > li').click(function(event){
        //$("#contactname").html($(event.target).html());
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

    $('#calToday').click(function() {
        $('.fc').fullCalendar('today');
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
        if (slider.hasClass('panelOut')) {
            slider.attr("class", "panelIn");
            $('#fliparrow').addClass("flipagain");
            setTimeout(function(){

            }, 400)
        } else {
            slider.attr("class", "panelOut");
            $('#fliparrow').attr("class", "flipimage");
            setTimeout(function(){
                $('#fliparrow').attr("class", "flipped");
            }, 400);
        }
    });

    if ($('.ocount').length) {
	    var totalOrphans = $('.ocount');
	    totalOrphans[0].innerHTML = $('.eventCounter').length;
	    totalOrphans[1].innerHTML = $('.taskCounter').length;
	    totalOrphans[2].innerHTML = $('.tagCounter').length;
	}

    /*if ($('#calendarcont').length) {
        $('#calendarcont').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            events: {

            }
        });
    }*/

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
    $('#curDate').html(today);

    setTimeout(function(){
        $('#collapseall').click();
        var fullCount = $('.sidelist li');
        $("#itemCount").html(fullCount.length);
        setTimeout(function(){
            $(".spaceimage").remove();
			try { 
				$(".dashitem").accordion("refresh"); 
			} catch (e) { }
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
    Opentip.styles.lefttip = {
      tipJoint: "right",
      group: "tags",
      target: true,
      delay: 0,
      offset: [10, -140]
      /*className: "myStyle",
      background: "#000"*/
    };    Opentip.styles.success = {
      tipJoint: "top",
      target: true,
      offset: [0, -140],
      delay: 0,
      background: "#72FF72",
	  borderColor: "#3CFF3C"
    };
    Opentip.styles.error = {
      tipJoint: "top",
      target: true,
      offset: [0, -140],
      delay: 0,
      background: "#FF7272",
	  borderColor: "#FF3C3C"
    };
    Opentip.styles.calitem = {
      tipJoint: "bottom",
      group: "tags",
      target: true,
      offset: [0, -140],
      delay: 0
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
        new Opentip("#maintag", "Tags", {
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
        new Opentip("#detailmenubar > *:nth-child(5) > img", "Task Completed", {
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
    if ($('#contactcontent').length) {
    	var contactImages = $('#contactcontent .infopanel:first-child img');
    	new Opentip(contactImages[0], "Phone Number", {
            style: "lefttip"
        });
    	new Opentip(contactImages[1], "Send Email", {
            style: "lefttip"
        });
        new Opentip("#bdayImage", "Birthday", {
            style: "lefttip"
        });
        new Opentip("#locationImage", "Location", {
            style: "lefttip"
        });
    }
    if ($('.contactDetails').length) {
        var slideImages = $('.contactgroup img');
        new Opentip(slideImages[0], "Email Address", {
            style: "lefttip"
        });
        new Opentip(slideImages[1], "View Emails", {
            style: "lefttip"
        });
        new Opentip(slideImages[2], "Phone Number", {
            style: "lefttip"
        });
        new Opentip(slideImages[3], "Birthday", {
            style: "lefttip"
        });
        new Opentip(slideImages[4], "Location", {
            style: "lefttip"
        });
        new Opentip(slideImages[5], "Related Events", {
            style: "lefttip"
        });
        new Opentip(slideImages[6], "Related Tasks", {
            style: "lefttip"
        });
        new Opentip(slideImages[7], "Related Tags", {
            style: "lefttip"
        });
    }
    if ($('.itemcounts').length) {
    	var settingIcons = $('.itemcount');
    	new Opentip(settingIcons[0], "Contacts", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[1], "Events", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[2], "Tasks", {
            style: "lefttip"
        });
    	new Opentip(settingIcons[3], "Tags", {
            style: "lefttip"
        });
    }
    if ($('.taggedObjects').length) {
    	var taggedItems = $('.taggedObjects img');
        new Opentip(taggedItems[0], "Related Events", {
            style: "lefttip"
        });
        new Opentip(taggedItems[1], "Related Tasks", {
            style: "lefttip"
        });
        new Opentip(taggedItems[2], "Related Tags", {
            style: "lefttip"
        });
    }
    setTimeout(function(){
        $("#loader").removeClass("showLoader");
    }, 200);
	
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

setTimeout(function(){

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
    $("#eaddr option:first").html(userEmail);

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

    if ($(".loggedin").length) {
        $(".loggedin").bind("touchmove", function(e) {
            e.preventDefault();
        });
    }
    if ($("#mobileNav").length) {
        $("#mobileNav").bind("touchmove", function(e) {
            e.preventDefault();
        });
    }

    var ajaxObj = {
        headers: {
            "X-AUTHENTICATION-TOKEN": "4N9-_NWfYvYxpesMVpne",
            "X-AUTHENTICATION-EMAIL": "hweaver@evenspring.com"
        }
    };
    var contacts = new Bloodhound({
      datumTokenizer: function(contact) { return Bloodhound.tokenizers.whitespace(contact.name || contact.email || ""); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-staging.herokuapp.com/contacts',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.contacts;
        }
      }
    });
    var events = new Bloodhound({
      datumTokenizer: function(event) { return Bloodhound.tokenizers.whitespace(event.title || ""); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-staging.herokuapp.com/events',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.events;
        }
      }
    });
    var tasks = new Bloodhound({
      datumTokenizer: function(task) { return Bloodhound.tokenizers.whitespace(task.title || ""); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-staging.herokuapp.com/tasks',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.tasks;
        }
      }
    });
    var tags = new Bloodhound({
      datumTokenizer: function(tag) { return Bloodhound.tokenizers.whitespace(tag.name || ""); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-staging.herokuapp.com/tags',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.tags;
        }
      }
    });
    /*var orphans = new Bloodhound({
      datumTokenizer: function(orphan) { return Bloodhound.tokenizers.whitespace(orphan.events.title); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-staging.herokuapp.com/orphans',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.orphans;
        }
      }
    });*/

    contacts.initialize();
    events.initialize();
    tasks.initialize();
    tags.initialize();
    var localStorageClearInterval = 5000;
    setInterval(function() {
        localStorage.clear();
        contacts.index.datums = [];
        contacts._loadPrefetch(contacts.prefetch);
        events.index.datums = [];
        events._loadPrefetch(events.prefetch);
        tasks.index.datums = [];
        tasks._loadPrefetch(tasks.prefetch);
        tags.index.datums = [];
        tags._loadPrefetch(tags.prefetch);
    }, localStorageClearInterval);

    var contactsDatasource = {
        name: 'Contacts',
        displayKey: 'name',
        source: contacts.ttAdapter(),
        templates: {
            header: '<h2>Contacts</h2>'
        }
    };
    var eventsDatasource = {
        name: 'Events',
        displayKey: 'title',
        source: events.ttAdapter(),
        templates: {
            header: '<h2>Events</h2>'
        }
    };
    var tasksDatasource = {
        name: 'Tasks',
        displayKey: 'title',
        source: tasks.ttAdapter(),
        templates: {
            header: '<h2>Tasks</h2>'
        }
    };
    var tagsDatasource = {
        name: 'Tags',
        displayKey: 'name',
        source: tags.ttAdapter(),
        templates: {
            header: '<h2>Tags</h2>'
        }
    };
    var typeaheadOptions = {
        highlight: true
    };
    var onTypeaheadSelected = function (obj, datum) {
        $(obj.target).typeahead('val', '');

        var objectID;
        var displayText;
        var extraClasses;
        //check which object has been selected
        if (datum.hasOwnProperty('organization')) { // contact
            objectID = 'contact' + datum.id;
            displayText = datum.name;
            extraClasses = "association contactAssociation";
        } else if (datum.hasOwnProperty('start_datetime')) { // event
            objectID = 'event' + datum.id;
            displayText = datum.title;
            extraClasses = "association eventAssociation";
        } else if (datum.hasOwnProperty('notes') && datum.hasOwnProperty('due')) { // task
            objectID = 'task' + datum.id;
            displayText = datum.title;
            extraClasses = "association taskAssociation";
        } else if (datum.hasOwnProperty('name') && datum.hasOwnProperty('id')) { // tag
            objectID = 'tag' + datum.id;
            displayText = datum.name;
            extraClasses = "association tagAssociation";
        } else { // invalid
            console.log("Unknown datum selected: " + datum);
        }
        if (objectID && displayText) {
            var itemList = $(".relatedList > ul", ".createForm.selected");
            var existingItems = $('[objectid=' + objectID + ']', itemList);
            if (existingItems.length === 0) {
                var newRow = $('<li objectid="' + objectID + '" class="' + extraClasses + '"><span>' + displayText + '</span><img src="img/close.png"></li>');
                $('img', newRow).click(function() { newRow.remove(); });
                itemList.append(newRow);
            }
        }
    };

    $("#typeAheadContact").typeahead(typeaheadOptions, eventsDatasource, tasksDatasource, tagsDatasource)
        .on('typeahead:selected', onTypeaheadSelected);
    $("#typeAheadEvent").typeahead(typeaheadOptions, contactsDatasource, tasksDatasource, tagsDatasource)
        .on('typeahead:selected', onTypeaheadSelected);
    $("#typeAheadTask").typeahead(typeaheadOptions, contactsDatasource, eventsDatasource, tagsDatasource)
        .on('typeahead:selected', onTypeaheadSelected);
    $("#typeAheadTag").typeahead(typeaheadOptions, contactsDatasource, eventsDatasource, tasksDatasource)
        .on('typeahead:selected', onTypeaheadSelected);

    window.bindSearchField = function(a, b, c) {
        var searchAll = $("#searchAll");
        if (searchAll.hasClass('tt-input'))
            return;

        var searchTypeaheadOptions = $.extend({}, typeaheadOptions);
        searchTypeaheadOptions.hint = false;
        searchAll.typeahead(searchTypeaheadOptions, contactsDatasource, eventsDatasource, tasksDatasource, tagsDatasource)
            .on('typeahead:selected',  function(obj, datum) {
                $(obj.target).typeahead('val', '');

                var id = datum.id;
                if (datum.hasOwnProperty('organization')) { // contact
                    document.location.href = document.location.href.split('#')[0] + '#/contacts/' + id;
                } else if (datum.hasOwnProperty('start_datetime')) { // event
                    document.location.href = document.location.href.split('#')[0] + '#/events/' + id;
                } else if (datum.hasOwnProperty('notes') && datum.hasOwnProperty('due')) { // task
                    document.location.href = document.location.href.split('#')[0] + '#/tasks/' + id;
                } else if (datum.hasOwnProperty('name') && datum.hasOwnProperty('id')) { // tag
                    document.location.href = document.location.href.split('#')[0] + '#/tags/' + id;
                } else { // invalid
                }
            });
        searchAll.focus();
    };
}, 100);
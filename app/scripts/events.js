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

    $('.showitem').unbind("click").bind("click", function(event){
        var subSortType = event.target.id;
        var subSortList = document.getElementsByClassName(subSortType);
        if ($(event.target).hasClass('selected')) {
            $(event.target).removeClass('selected');
            $(subSortList).css("display", "none");
        } else {
            $(event.target).addClass('selected');
            $(subSortList).css("display", "block");
        }
        $(".listitem").accordion("refresh");
    });

    $('.sortitem').unbind("click").bind("click", function(event){
        var sortType = event.target.id;
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
        setTimeout(function(){
            if ($("#subEvent.selected").length) {
                $(".subEvent").css("display", "block");
            } else {
                $(".subEvent").css("display", "none");
            }
            if ($("#subTask.selected").length) {
                $(".subTask").css("display", "block");
            } else {
                $(".subTask").css("display", "none");
            }
            if ($("#subContact.selected").length) {
                $(".subContact").css("display", "block");
            } else {
                $(".subContact").css("display", "none");
            }
            if ($("#subTag.selected").length) {
                $(".subTag").css("display", "block");
            } else {
                $(".subTag").css("display", "none");
            }
            $(".listitem").accordion("refresh"); 
        }, 1000);
    });

    setTimeout(function(){
		$('.listitem > h3').unbind("click").bind("click", function(){

            var thisArrow = $(this).parent().find(".accordionarrow");
            var thisId = $(this).find('a').attr('href');
            thisId = thisId.replace( /^\D+/g, '');
            var currentObject, objectType;
            var dataContacts, dataEvents, dataTasks, dataTags;

	        if ($(thisArrow).hasClass("arrowdown")) {
	            $(thisArrow).removeClass("arrowdown");
	        } else {
                $(thisArrow).addClass("arrowdown");

                if ($(this).hasClass("dataRetrieved")) {
                    console.log("already have data, not requesting again");
                } else {
                    $(this).addClass('dataRetrieved');
                    $('.currentAccord').removeClass('currentAccord');
                    $(this).parent().addClass('currentAccord');
                    var contactListCont = $('.currentAccord').find('.subContact');
                    var eventListCont = $('.currentAccord').find('.subEvent');
                    var taskListCont = $('.currentAccord').find('.subTask');
                    var tagListCont = $('.currentAccord').find('.subTag');

                    console.log(contactListCont.length + " " + eventListCont.length + " " + taskListCont.length + " " + tagListCont.length);

                    if ($(this).parent().hasClass('maincontact')) {
                        objectType = "contacts";
                    } else if ($(this).parent().hasClass('mainevent')) {
                        objectType = "events";
                    } else if ($(this).parent().hasClass('maintask')) {
                        objectType = "tasks";
                    } else if ($(this).parent().hasClass('maintag')) {
                        objectType = "tags";
                    } 

                    $.ajax({
                        type: 'GET',
                        url: 'http://daywon-api-prod.herokuapp.com/' + objectType + "/" + thisId,
                        contentType: "application/json",
                        dataType: "json",
                        headers: {
                            "X-AUTHENTICATION-TOKEN": authToken,
                            "X-AUTHENTICATION-EMAIL": userEmail
                        },
                        success: function (data) {
                            console.log("original data: " + data['events']);
                            try {
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
                            }
                        },
                        error: function (e) {
                            //alert("There was an error loading settings: " + e);
                        }

                    });
                }
            }
	    });
	}, 100);

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
    	$("#loader").addClass("showLoader");
    	setTimeout(function(){
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
	        setTimeout(function(){
	    		$("#loader").removeClass("showLoader");
	    	}, 100);
	    }, 100);
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
    	$("#loader").addClass("showLoader");
    	setTimeout(function(){
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
	        setTimeout(function(){
	    		$("#loader").removeClass("showLoader");
	    	}, 100);
		}, 100);
    });

    $("#createicon").click(function(event){
        var createChoice = document.getElementById("createselect");
        if (createChoice.length) {
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
        }
    });

    $('.detailCreate').click(function(){
        $("#createicon").click();
    });

    $('.listitem > .sortitem > select').click();
	
	$("#contactsdash").click(function() {
		$("#viewmenu > a")[0].click();
	});

    $(".backArrow").click(function(){
        $("#contactpanel2").addClass("mobileOut").removeClass("mobileIn");
        $("#eventpanel2").addClass("mobileOut").removeClass("mobileIn");
        $("#taskpanel2").addClass("mobileOut").removeClass("mobileIn");
        $("#tagpanel2").addClass("mobileOut").removeClass("mobileIn");
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

	function hasWhiteSpace(s) {
	  return s.indexOf(' ') >= 0;
	}

    $(".dynamicEmail").parent().click(function(){
        /*Grabbing the innerHTML alone doesn't work because of the <script> tags Ember inserts around model data. As a workaround, we grab all of the innerHTML, load it into a hidden div, drop the <script> tags from the DOM, and grab the hidden div's innerHTML (just the email address)*/
        $(".dynamicEmail").attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=");
        $(".mobileEmail").attr("href", "mailto:");
        var desktopLink = $(".desktopEmail").attr("href");
        var mobileLink = $(".mobileEmail").attr("href");
        var emailAddr = $(".emailfield");
        emailAddr = $(emailAddr[0]).html();
        $("#preloader").html(emailAddr);
        $("#preloader > script").remove();
        emailAddr = $("#preloader").html();
        $(".dynamicEmail").attr("href", desktopLink + emailAddr);
        $(".mobileEmail").attr("href", mobileLink + emailAddr);
    });

    $("#mobileContact").click(function(){
        $(".backArrow").click();
    });

    $('.sidelist li').unbind("click").bind("click", function(event){
        var itemList = $('.sidelist li').index(this);
        var infoPanels = $('.infopanel');
        var detailsList = $('.textrow');
        var phoneNo = $('.phonenumber');
        var contLoc = $('.contactlocation');
        var eField = $('.emailfield');
        var clickedRow = $(event.target).closest('li');
        $(".dashboardSorter").removeClass("selected");
        $('.currentcontact').removeClass("currentcontact");
        clickedRow.addClass("currentcontact");
        $('.infopanel.selected').removeClass('selected');
        if ($(".dashList").length) {
            $(infoPanels[itemList]).addClass("selected");
        } else {
            if ($("#contactpanel2").length) {
                $(infoPanels[0]).addClass("selected");
            }
            if ($("#eventpanel2").length) {
                $(infoPanels[1]).addClass("selected");
            }
            if ($("#taskpanel2").length) {
                $(infoPanels[2]).addClass("selected");
            }
            if ($("#tagpanel2").length) {
                $(infoPanels[3]).addClass("selected");
            }
        }
        $("#eventpanel2").removeClass("dashRecent");
        $("#eventpanel2").removeClass("dashTasks");
        $("#eventpanel2").removeClass("dashEvents");
        $("#eventpanel2").removeClass("dashTags");
        if (itemList == 0) {
            $("#eventpanel2").addClass("dashRecent");
        } else if (itemList == 1) {
            $("#eventpanel2").addClass("dashTasks");
            $("#taskSorting").addClass("selected");
        } else if (itemList == 2) {
            $("#eventpanel2").addClass("dashEvents");
            $("#eventSorting").addClass("selected");
        } else if (itemList == 3) {
            $("#eventpanel2").addClass("dashTags");
            $("#tagSorting").addClass("selected");
        }
        var selectedObject = $(clickedRow).html();
        var selectedObjectId;
        $("#preloader").html(selectedObject);
        $("#preloader script").remove();
        selectedObject = $("#preloader > span:first-child").html();
        selectedObjectId = $("#preloader > span:last-child").html();
        $(".orphantitle").html(selectedObject);
        $("#selectedID").html(selectedObjectId);
        /*if (hasWhiteSpace(selectedObject)) {
	        var splitString = $(selectedObject).html().split(" ");
	        var splitString1 = splitString[0].toLowerCase();
	        if (splitString.length > 1) {
	            var splitString2 = splitString[1].toLowerCase();
	        }
    	}*/

        if ($(window).width() < 1025) {
            $("#contactpanel2").addClass('mobileIn');
            $("#eventpanel2").addClass('mobileIn');
            $("#taskpanel2").addClass('mobileIn');
            $("#tagpanel2").addClass('mobileIn');
            if ($(".dashContent").length) {
                var mobileContent = $(".dashContent");
                $(mobileContent).removeClass("dashContent");
                setTimeout(function(){
                    $(mobileContent).addClass("dashContent");
                }, 1);
            }
        }

    });

    $("#allDay").unbind("click").bind("click", function(){
        var allDay = $("#allDay");
        if (allDay.is(":checked")) {
            $("#eventEnd").val("");
            $("#eventEnd").attr("disabled", "disabled");
        } else {
            $("#eventStart").removeAttr("disabled");
            $("#eventEnd").removeAttr("disabled");
        }
    });

    $("#recurring").unbind("click").bind("click", function(){
        var recurring = $("#recurring");
        if (recurring.is(":checked")) {
            $("#recurringContainer").addClass("active");
        } else {
            $("#recurringContainer").removeClass("active");
            $("#recurringContainer input").val("");
        }
    });

    $("#trashicon").unbind("click").bind("click", function(){
        setTimeout(function(){
            $(".deleteContainer > div:first-child").click(function(){
                $("#destroy").click();
                deleteTip.hide();
                var deleteTip2 = new Opentip("#trashicon", '<span>Item deleted.</span>', {
                    style: "deleteconfirm2"
                });
                deleteTip2.show();
                setTimeout(function(){
                    deleteTip2.hide();
                }, 1500);
            });
            $(".deleteContainer > div:last-child").click(function(){
                deleteTip.hide();
            });
        }, 100);
    });

    $("#detailTrash").unbind("click").bind("click", function(){
        setTimeout(function(){
            $(".deleteContainer > div:first-child").click(function(){
                $("#destroy").click();
                deleteTip3.hide();
                var deleteTip4 = new Opentip("#trashicon", '<span>Item deleted.</span>', {
                    style: "deleteconfirm2"
                });
                deleteTip4.show();
                setTimeout(function(){
                    deleteTip4.hide();
                }, 1500);
            });
            $(".deleteContainer > div:last-child").click(function(){
                deleteTip3.hide();
            });
        }, 100);
    });

    $(".createForm").unbind('submit').bind('submit', function(event){		

		var showPopupMessage = function(target, message, style) {
			var statusPopup = new Opentip($(target), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
			statusPopup.show();
			statusPopup.container.css('z-index', 100000);
			setTimeout(function() {
				statusPopup.hide();
				setTimeout($('.close').click(), 300);
                setTimeout(function(){
                    $('.createForm input').val("");
                    $('.createForm .formrow:last-child input').val("Submit");
                    $('.createForm .association img').click();
                }, 700);
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
		for (i = 0; i < relatedTags.length; i++) {
			thisObject = $(relatedTags[i]).attr('objectid');
			thisObject = thisObject.replace(/\D/g,'');
        	tagIds[i] = thisObject;
        }

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
			url = "http://daywon-api-prod.herokuapp.com/tags";
			objectDescription = "Tag: " + tagTitle;
        } else if ($(event.target).parent().hasClass("createTask")) {
            var taskTitle = $("#taskName").val();
            taskTitle = String(taskTitle);
            var taskDesc = $("#taskNotes").val();
            taskDesc = String(taskDesc);
            var taskDue = moment($("#taskDue").val()).format();
            var taskPriority = $("#taskPriority").prop("selectedIndex");
            var data = {
                task: {
                    title: taskTitle,
                    notes: taskDesc,
                    status: false,
                    due: taskDue,
                    priority: taskPriority,
                    contact_ids: contactIds,
                    event_ids: eventIds,
                    tag_ids: tagIds
                }
            };
			url = "http://daywon-api-prod.herokuapp.com/tasks";
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
			url = "http://daywon-api-prod.herokuapp.com/contacts";
			objectDescription = "Contact: " + contactTitle;
        } else if ($(event.target).parent().hasClass("createEvent")) {

            var eventTitle = $("#eventName").val();
            eventTitle = String(eventTitle);
            var eventDesc = $("#eventDetails").val();
            eventDesc = String(eventDesc);
            var eventLoc = $("#eventLocation").val();
            eventLoc = String(eventLoc);
            var eventSt = moment($("#eventStart").val()).format();
            var isAllDay = new Boolean($("#allDay:checked").length);
            var isRecurring = new Boolean($("#recurring:checked").length);

            var monday = new Boolean(false);
            var tuesday = new Boolean(false);
            var wednesday = new Boolean(false);
            var thursday = new Boolean(false);      
            var friday = new Boolean(false);
            var saturday = new Boolean(false);
            var sunday = new Boolean(false);
            var interval = document.getElementById("recurrChoice").selectedIndex;
            var repeatInterval;
            var endingCount;
            var endingDate;

            if (isRecurring == true) {
                if (interval == 0) {
                    repeatInterval = $("#intervalSelect").val();
                    if (!repeatInterval.length || repeatInterval < 2) {
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
                } else if (interval == 5) {
                    monday = true;
                    wednesday = true;
                    friday = true;
                } else if (interval == 6) {
                    tuesday = true;
                    thursday = true;
                }
                endingCount = $("#recurrNumber").val();
                endingDate = $("#endEventRepeat").val();
            } else if (isRecurring == false){
                console.log("not recurring");
            }

            var eventEn = moment($("#eventEnd").val()).format();
            repeatInterval = parseInt(repeatInterval, 10);
            endingCount = parseInt(endingCount, 10);
            var data = {
                event: {
                    title: eventTitle,
                    description: eventDesc,
                    location: eventLoc,
                    recurring: isRecurring,
                    recurrence: {
                        frequency: repeatInterval,
                        on_monday: monday,
                        on_tuesday: tuesday,
                        on_wednesday: wednesday,
                        on_thursday: thursday,
                        on_friday: friday,
                        on_saturday: saturday,
                        on_sunday: sunday,
                        ends_after: {
                            occurences: endingCount,
                            date: endingDate
                        }
                    },
                    start_datetime: eventSt,
                    end_datetime: eventEn,
                    contact_ids: contactIds,
                    task_ids: taskIds,
                    tag_ids: tagIds
                }
            };
			url = "http://daywon-api-prod.herokuapp.com/events";
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
				"X-AUTHENTICATION-TOKEN": authToken,
				"X-AUTHENTICATION-EMAIL": userEmail
			},
			success: function (data) {
				console.log(data);
				showPopupMessage(event.target, "Successfully created " + objectDescription, "success");
                setTimeout(refetchTypeaheadData, 1000);
			},
			error: function (e) {
				console.log(e.statusText);
				showPopupMessage(event.target, "Error creating " + objectDescription, "error");
			}
		});
        return false;
    });

    $("#associationForm").submit(function(){

        var url = "http://daywon-api-prod.herokuapp.com/";
        var data;
        var orphanName = $("#contactname").html();
        var orphanID = $("#selectedID").html();

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
        
        for (i = 0; i < relatedTags.length; i++) {
            thisObject = $(relatedTags[i]).attr('objectid');
            thisObject = thisObject.replace(/\D/g,'');
            tagIds[i] = thisObject;
        }

        console.log("contacts: " + contactIds);
        console.log("events: " + eventIds);
        console.log("tasks: " + taskIds);
        console.log("tags: " + tagIds);

        if ($("#typeAheadOrphanEvent").length) {
            url += "events/" + orphanID;
            data = {
                contact_ids: contactIds,
                task_ids: taskIds,
                tag_ids: tagIds
            };
        } else if ($("#typeAheadOrphanTask").length) {
            url += "tasks/" + orphanID;
            data = {
                contact_ids: contactIds,
                event_ids: eventIds,
                tag_ids: tagIds
            };
        } else if ($("#typeAheadOrphanTag").length) {
            url += "tags/" + orphanID;
            data = {
                contact_ids: contactIds,
                event_ids: eventIds,
                task_ids: taskIds
            };
        }

        $.ajax({
            type: 'PUT',
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                console.log(data);
                showPopupMessage(event.target, "Successfully edited " + orphanName, "success");
                setTimeout(refetchTypeaheadData, 1000);
            },
            error: function (e) {
                console.log(e.statusText);
                showPopupMessage(event.target, "Error editting " + orphanName, "error");
            }
        });
        return false;
    });

    $(".settingToggler").change(function(){
            
            var url = "http://daywon-api-prod.herokuapp.com/users/settings";
            var setting1 = new Boolean($("#toggle:checked").length);
            var setting2 = new Boolean($("#toggle2:checked").length);
            var setting3 = new Boolean($("#toggle3:checked").length);
            var setting4 = new Boolean($("#toggle4:checked").length);
            var setting5 = new Boolean($("#toggle5:checked").length);

            var data = {
                user: {
                    sort_by_last_name: setting1,
                    show_new_user_popups: setting2,
                    display_contact_notes: setting3,
                    push_info_to_webmail: setting4,
                    receive_email: setting5
                }
            };

            $.ajax({
                type: 'PUT',
                url: url,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(data),
                headers: {
                    "X-AUTHENTICATION-TOKEN": authToken,
                    "X-AUTHENTICATION-EMAIL": userEmail
                },
                success: function (data) {
                    console.log(data);
                    setTimeout(refetchTypeaheadData, 1000);
                },
                error: function (e) {
                    console.log(e.statusText);
                }
            });

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
            if (timeView == "list") {
                timeView = "Agenda";
            }
            $( "span:contains('" + timeView + "')" ).click();
        }
    });

    $('#calToday').click(function() {
        $('.fc').fullCalendar('today');
    });

    $('#detailmenubar > img').click(function(){
        if (this.src.indexOf("trash") == -1) {
            var viewChoice = $('.infopanel');
            $('.infopanel.selected').removeClass('selected');
            $('img.selected').removeClass('selected');
            $(event.target).addClass('selected');
            if (this.src.indexOf("contact") != -1) {
                $(viewChoice[0]).addClass('selected');
            } else if (this.src.indexOf("event") != -1) {
                $(viewChoice[1]).addClass('selected');
            } else if (this.src.indexOf("task") != -1) {
                $(viewChoice[2]).addClass('selected');
            } else if (this.src.indexOf("tag") != -1) {
                $(viewChoice[3]).addClass('selected');
            }
        }
    });

    $('.notesLabel2').unbind("click").bind("click", function(){
        $('.flipswitch').click();
        setTimeout(function(){
            $('.notesField').dblclick()
        }, 300);
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

    if ($(".dashboardContainer").length) {
        var tomorrow = moment().add('days', 1).format('MMMM Do');
        var day2 = moment().add('days', 2).format('dddd, MMMM Do');
        var day3 = moment().add('days', 3).format('dddd, MMMM Do');
        var day4 = moment().add('days', 4).format('dddd, MMMM Do');
        var day5 = moment().add('days', 5).format('dddd, MMMM Do');
        var day6 = moment().add('days', 6).format('dddd, MMMM Do');
        var day7 = moment().add('days', 7).format('dddd, MMMM Do');
        console.log("tomorrow: " + day2);
        var dayList = $(".daySeparator");
        $(dayList[0]).find('h3').html("Tomorrow, " + tomorrow);
        $(dayList[1]).find('h3').html(day2);
        $(dayList[2]).find('h3').html(day3);
        $(dayList[3]).find('h3').html(day4);
        $(dayList[4]).find('h3').html(day5);
        $(dayList[5]).find('h3').html(day6);
        $(dayList[6]).find('h3').html(day7);
        setTimeout(function(){
            $("#loader").removeClass("showLoader");
            $("#openModal6").removeClass("active");
        }, 4000);
    } else {
        $("#openModal6").removeClass("active");
    }

    if ($("#sortbycolumn").length) {
        setTimeout(function(){
            var allItems = $('.listitem');
            for (var i = 0; i < 15; i++) {
                $(allItems[i]).addClass('active');
            }
            allItems.accordion("refresh");
            setTimeout($("#loader").removeClass("showLoader"), 500);
        }, 500);
        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 155) {
                console.log("rock bottom");
                var allItems = $('.listitem');
                var j = 0;
                for (var i = 0; j < 15; i++) {
                    if ($(allItems[i]).hasClass('active')) {
                        console.log('skipping, already active');
                    } else {
                        $(allItems[i]).addClass('active');
                        j++;
                    }
                }
                allItems.accordion("refresh");
            }
        };
    }

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

    $(".deleteContainer > div-child").click(function(){
        //alert("clicked");
        deleteTip.hide();
    });

    if ($('.ocount').length) {
        $.ajax({
            type: 'GET',
            url: 'http://daywon-api-prod.herokuapp.com/orphans',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                var orphanObj = JSON.stringify(data);
                orphanObj = JSON.parse(orphanObj);
                var orphanObjRoot = orphanObj.orphans;
                orphanObjRoot = JSON.stringify(orphanObjRoot);
                orphanObjRoot = orphanObjRoot.substring(1, orphanObjRoot.length-1);
                var orphanEvents = JSON.parse(orphanObjRoot);
                orphanEvents = orphanEvents.tasks;
                orphanEvents = orphanEvents.length;
                var orphanTasks = JSON.parse(orphanObjRoot);
                orphanTasks = orphanTasks.tasks;
                orphanTasks = orphanTasks.length;
                var orphanTags = JSON.parse(orphanObjRoot);
                orphanTags = orphanTags.tags;
                orphanTags = orphanTags.length;
                $("#totalOrphans").html(orphanEvents + orphanTasks + orphanTags);
                var orphanCounters = $(".ocount");
                $(orphanCounters[0]).html(orphanEvents);
                $(orphanCounters[1]).html(orphanTasks);
                $(orphanCounters[2]).html(orphanTags);
            },
            error: function (e) {
                //alert("There was an error loading orphans: " + e);
            }
        });
    }

    if ($('#settingmain').length) {
        var totalUsers = $(".userRow").length;
        $("#reportCount > span").html(totalUsers);
        $.ajax({
            type: 'GET',
            url: 'http://daywon-api-prod.herokuapp.com/users/settings/',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                var arr = [];
                    for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        arr.push(data[key]);  
                    }
                }
                if (arr[0] === true) {
                    $("#toggle").attr("checked", "checked");
                } else {
                    $("#toggle").removeAttr("checked");
                }
                if (arr[1] === true) {
                    $("#toggle2").attr("checked", "checked");
                } else {
                    $("#toggle2").removeAttr("checked");
                }
                if (arr[2] === true) {
                    $("#toggle3").attr("checked", "checked");
                } else {
                    $("#toggle3").removeAttr("checked");
                }
                if (arr[3] === true) {
                    $("#toggle4").attr("checked", "checked");
                } else {
                    $("#toggle4").removeAttr("checked");
                }
                if (arr[4] === true) {
                    $("#toggle5").attr("checked", "checked");
                } else {
                    $("#toggle5").removeAttr("checked");
                }
            },
            error: function (e) {
                alert("There was an error loading settings: " + e);
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://daywon-api-prod.herokuapp.com/users/info/',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                var arr = [];
                    for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        arr.push(data[key]);  
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    console.log(arr[i]);
                }
                $("#settingname > h1").html(arr[0]);
                $("#settingname > h3").html(arr[1]);
                $("#settingimage").attr("src", arr[2]);
            },
            error: function (e) {
                //alert("There was an error loading settings: " + e);
            }
        });
    }

    if ($("#adminTable").length) {
        $.ajax({
            type: 'GET',
            url: 'http://daywon-api-prod.herokuapp.com/reports_admin',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                var arr = [];
                var userList = "";
                    for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        arr.push(data[key]);  
                    }
                }
                arr = arr[0];
                arr = arr.sort(function(a, b) {
                    var x = a.name; var y = b.name;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                $("#reportCount > span").html(arr.length);
                for (var i = 0; i < arr.length; i++) {
                    userList += '<tr class="userRow"><td>' + arr[i].name + '</td><td>' + arr[i].email + '</td><td>' + arr[i].active + '</td></tr>';
                }
                $("#adminTable > tbody").html(userList);
            },
            error: function (e) {
                //alert("There was an error loading settings: " + e);
            }
        });
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
    };    
    Opentip.styles.success = {
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
    Opentip.styles.deleteconfirm = {
      tipJoint: "top",
      group: "deletion",
      target: true,
      offset: [0, -140],
      delay: 0,
      showOn: "click",
      hideTrigger: "closeButton"
    };
    Opentip.styles.deleteconfirm2 = {
      tipJoint: "top",
      group: "deletion",
      target: true,
      offset: [0, -140],
      delay: 0,
      showOn: null,
      background: "#72FF72",
      borderColor: "#3CFF3C"
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
            style: "toptip"
        });     
        new Opentip("#detailmenubar > img:nth-child(2)", "Events", {
            style: "toptip"
        });    
        new Opentip("#detailmenubar > img:nth-child(3)", "Tasks", {
            style: "toptip"
        });     
        new Opentip("#detailmenubar > img:nth-child(4)", "Tags", {
            style: "toptip"
        });   
        new Opentip("#detailmenubar > *:nth-child(5) > img", "Task Completed", {
            style: "bottomtip"
        }); 
        new Opentip("#trashicon", "Delete", {
            style: "toptip"
        }); 
        var deleteTip = new Opentip("#trashicon", '<p>Are you sure you want to delete this item?</p><br /><div class="deleteContainer"><div>Yes</div><div>No</div></div>', {
            style: "deleteconfirm"
        });
        new Opentip("#detailmenubar > a > img", "Create", {
            style: "bottomtip"
        }); 
    }
    if ($("#detailTrash").length) {
        new Opentip("#detailTrash", "Delete", {
            style: "toptip"
        }); 
        var deleteTip3 = new Opentip("#detailTrash", '<p>Are you sure you want to delete this item?</p><br /><div class="deleteContainer"><div>Yes</div><div>No</div></div>', {
            style: "deleteconfirm"
        });
    }
    if ($("#createicon").length) {
        new Opentip("#createicon", "Create", {
            style: "toptip"
        });
    }
    if ($(".detailCreate").length) {
        new Opentip(".detailCreate", "Create", {
            style: "toptip"
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
        new Opentip(slideImages[0], "Send Email", {
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
    if ($("#adminTable").length) {
        new Opentip("#analyticsLogo", "Google Analytics", {
            style: "toptip"
        });
        new Opentip("#chimpLogo", "Mailchimp", {
            style: "toptip"
        });
    }
	
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
    var modal4Links = $('.openModal4');
    modal4Links.click(function(){ $('#openModal4').addClass('active'); });
    var modal5Links = $('.openModal5');
    modal5Links.click(function(){ $('#openModal5').addClass('active'); });
    var modal6Links = $('.openModal6');
    modal6Links.click(function(){ $('#openModal6').addClass('active'); });

	// set current email
    $("#eaddr option:first").html(userEmail);
    
    var ajaxObj = {
        headers: {
            "X-AUTHENTICATION-TOKEN": authToken,
            "X-AUTHENTICATION-EMAIL": userEmail
        }
    };
    var contacts = new Bloodhound({
      datumTokenizer: function(contact) { return Bloodhound.tokenizers.whitespace(contact.name || contact.email || ""); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'http://daywon-api-prod.herokuapp.com/contacts',
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
        url: 'http://daywon-api-prod.herokuapp.com/events',
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
        url: 'http://daywon-api-prod.herokuapp.com/tasks',
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
        url: 'http://daywon-api-prod.herokuapp.com/tags',
        ajax: ajaxObj,
        filter: function(obj) {
          return obj.tags;
        }
      }
    });

    contacts.initialize();
    events.initialize();
    tasks.initialize();
    tags.initialize();

    window.refetchTypeaheadData = function() {
        localStorage.clear();
        contacts.index.datums = [];
        contacts._loadPrefetch(contacts.prefetch);
        events.index.datums = [];
        events._loadPrefetch(events.prefetch);
        tasks.index.datums = [];
        tasks._loadPrefetch(tasks.prefetch);
        tags.index.datums = [];
        tags._loadPrefetch(tags.prefetch);
    };

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
            if ($(".relatedOrphans").length) {
                var itemList = $(".relatedOrphans > ul");
            } else {
                var itemList = $(".relatedList > ul", ".createForm.selected");
            }
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
    $("#typeAheadOrphanEvent").typeahead(typeaheadOptions, contactsDatasource, tasksDatasource, tagsDatasource)
        .on('typeahead:selected', onTypeaheadSelected);
    $("#typeAheadOrphanTask").typeahead(typeaheadOptions, contactsDatasource, eventsDatasource, tagsDatasource)
        .on('typeahead:selected', onTypeaheadSelected);     
    $("#typeAheadOrphanTag").typeahead(typeaheadOptions, contactsDatasource, eventsDatasource, tasksDatasource)
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

    console.log ("AT: " + authToken);
    console.log ("UE: " + userEmail);

    $("#recurrChoice").change(function(){
        if (this.selectedIndex > 0) {
            $("#recurringInterval").hide();
        } else {
            $("#recurringInterval").show();
        }
    });

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

    $('#eventStart').datetimepicker({
        id:"eventDateStart",
        formatTime: 'g:i A',
        format: 'm/d/Y g:i A'
    });
    $('#eventEnd').datetimepicker({
        id:"eventDateEnd",
        formatTime: 'g:i A',
        format: 'm/d/Y g:i A'
    });
    $('#taskDue').datetimepicker({
        id:"taskDate",
        formatTime: 'g:i A',
        format: 'm/d/Y g:i A'
    });
    $('#endEventRepeat').datetimepicker({
        id:"endEvent",
        formatTime: 'g:i A',
        format: 'm/d/Y g:i A'
    });

    $('.formrow img').click(function(event){
        $(event.target).parent().find('input').focus();
    });

    function ajaxOrphans() {

        $.ajax({
            type: 'GET',
            url: 'http://daywon-api-prod.herokuapp.com/orphans',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": userEmail
            },
            success: function (data) {
                var orphanObj = JSON.stringify(data);
                orphanObj = JSON.parse(orphanObj);
                var orphanObjRoot = orphanObj.orphans;
                orphanObjRoot = JSON.stringify(orphanObjRoot);
                orphanObjRoot = orphanObjRoot.substring(1, orphanObjRoot.length-1);
                var orphanEvents = JSON.parse(orphanObjRoot);
                orphanEvents = orphanEvents.tasks;
                orphanEvents = orphanEvents.length;
                console.log("orphan events: " + orphanEvents);
                var orphanTasks = JSON.parse(orphanObjRoot);
                orphanTasks = orphanTasks.tasks;
                orphanTasks = orphanTasks.length;
                console.log("orphan tasks: " + orphanTasks);
                var orphanTags = JSON.parse(orphanObjRoot);
                orphanTags = orphanTags.tags;
                orphanTags = orphanTags.length;
                console.log("orphan tags: " + orphanTags);
                var totalOrphans = orphanEvents + orphanTags + orphanTasks;
                console.log(totalOrphans);
                $("#orphancount > span").html(totalOrphans);
                $("#totalOrphans").html(totalOrphans);
            },
            error: function (e) {
                //alert("There was an error loading orphans: " + e);
            }
        });

    }

    ajaxOrphans();

    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);

}, 100);
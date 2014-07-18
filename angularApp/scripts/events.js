setTimeout(function() {
    var logSelect = document.getElementById("eaddr");
    logSelect.onchange = function() {
        if (logSelect.value === "Logout") {
            document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://daywon.s3-website-us-west-2.amazonaws.com/login.html";
        }
    }
}, 2000);

rebindEvents();

function rebindEvents() { 

    var baseURL = "https://daywon-api-staging.herokuapp.com";

    setTimeout(function(){

        $('nav a').click(function(evt){
    		var link = $(this);
    		var samePage = link.hasClass('active');
    		samePage |= evt.ctrlKey || (evt.button != 0) // opening in new tab shouldn't show a loading bar on this tab
    		if (!link.hasClass('dropdown-toggle'))
    			samePage |= link.parent().hasClass('active');
    		
    //		if (!samePage)
    //			$("#loader").addClass("showLoader");
        });

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

        $('.detailCreate').click(function(){
            $("#createicon").click();
        });
    	
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

        $(".emailLink").attr("href", "");

        $(".emailLink").parent().click(function(){
            /*Grabbing the innerHTML alone doesn't work because of the <script> tags Ember inserts around model data. As a workaround, we grab all of the innerHTML, load it into a hidden div, drop the <script> tags from the DOM, and grab the hidden div's innerHTML (just the email address)*/
            var emailAddr = $(".emailfield");
            emailAddr = $(emailAddr[0]).html();
            $("#preloader").html(emailAddr);
            $("#preloader > script").remove();
            $("#preloader > span > script").remove();
            emailAddr = $("#preloader > span").html();
            if (emailAddr != null) {
                emailAddr = emailAddr.replace(/\s+/g, '');
                console.log("email: " + emailAddr);
                $(".dynamicEmail").attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=");
                $(".mobileEmail").attr("href", "mailto:");
                var desktopLink = $(".dynamicEmail").attr("href");
                var mobileLink = $(".mobileEmail").attr("href");
                $(".dynamicEmail").attr("href", desktopLink + emailAddr);
                $(".mobileEmail").attr("href", mobileLink + emailAddr);
            } else {
                $('#openModal7').addClass('active');
                return false;
            }
        });

        $("#mobileContact").click(function(){
            $(".backArrow").click();
        });

        setTimeout(function(){
            $('.sidelist li').unbind("click").bind("click", function(event){
                var itemList = $('.dashList li').index(this);
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
        }, 500);

        $("#recurring").unbind("click").bind("click", function(){
            var recurring = $("#recurring");
            if (recurring.is(":checked")) {
                $("#recurringContainer").addClass("active");
            } else {
                $("#recurringContainer").removeClass("active");
                $("#recurringContainer input").val("");
            }
        });

        $(".allDayStart").hide();
        $(".allDayEnd").hide();

        $("#allDay").unbind("click").bind("click", function(){
            var allDay = $("#allDay");
            if (allDay.is(":checked")) {
                $(".eventDateStart").hide();
                $(".eventDateEnd").hide();
                $(".allDayStart").show();
                $(".allDayEnd").show();
            } else {
                $(".eventDateStart").show();
                $(".eventDateEnd").show();
                $(".allDayStart").hide();
                $(".allDayEnd").hide();
            }
        });

        $(".taskDateTime").hide();

        $("#taskTime").unbind("click").bind("click", function(){
            var taskTime = $("#taskTime");
            if (taskTime.is(":checked")) {
                $(".taskDate").hide();
                $(".taskDateTime").show();
            } else {
                $(".taskDate").show();
                $(".taskDateTime").hide();
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

        $("#emailsContainer img:first-of-type").unbind("click").bind("click", function(){
            $("#emailsContainer").append('<input type="text" class="contactEmail" />');
        });
        $("#phonesContainer img:first-of-type").unbind("click").bind("click", function(){
            $("#phonesContainer").append('<input type="text" class="contactPhone" />');
        });
        $("#emailsContainer img:last-of-type").unbind("click").bind("click", function(){
            var totalFields = $(this).siblings('input');
            if (totalFields.length > 1) {
                $(totalFields[(totalFields.length - 1)]).remove();
            }
        });
        $("#phonesContainer img:last-of-type").unbind("click").bind("click", function(){
            var totalFields = $(this).siblings('input');
            if (totalFields.length > 1) {
                $(totalFields[(totalFields.length - 1)]).remove();
            }
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

        $("#createselect").change(function(){
            var chosen = "create" + $("#createselect option:selected").html();
            var chosenForm = document.getElementsByClassName(chosen);
            chosenForm = chosenForm[0];
            $('.createForm.selected').removeClass('selected');
            $(chosenForm).addClass('selected');
        });

        if ($(".dashboardContainer").length) {
            var today = moment(today).format('MMMM Do');
            var day2 = moment().add('days', 1).format('dddd, MMMM Do');
            var day3 = moment().add('days', 2).format('dddd, MMMM Do');
            var day4 = moment().add('days', 3).format('dddd, MMMM Do');
            var day5 = moment().add('days', 4).format('dddd, MMMM Do');
            var day6 = moment().add('days', 5).format('dddd, MMMM Do');
            var day7 = moment().add('days', 6).format('dddd, MMMM Do');
            var dayList = $(".daySeparator");
            $(dayList[0]).find('h3').html("Today, " + today);
            $(dayList[1]).find('h3').html(day2);
            $(dayList[2]).find('h3').html(day3);
            $(dayList[3]).find('h3').html(day4);
            $(dayList[4]).find('h3').html(day5);
            $(dayList[5]).find('h3').html(day6);
            $(dayList[6]).find('h3').html(day7);
        } else {
        }

        $('#prioritySelector').change(function(){
            console.log(this.value);
        });

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

        setTimeout(function(){
            if ($('.flipswitch').length) {
                var scroller = new IScroll('#dCol1', {
                    mouseWheel: true,
                    scrollbars: true,
                    invertWheelDirection: false
                });
                var scroller2 = new IScroll('#dCol2', {
                    mouseWheel: true,
                    scrollbars: true,
                    invertWheelDirection: false
                });
                var scroller3 = new IScroll('#dCol3', {
                    mouseWheel: true,
                    scrollbars: true,
                    invertWheelDirection: false,
                    interactiveScrollbars: true
                });
            }
        }, 500);

        $(".deleteContainer > div-child").click(function(){
            //alert("clicked");
            deleteTip.hide();
        });


        if ($("#adminTable").length) {
            $.ajax({
                type: 'GET',
                url: baseURL + '/reports_admin',
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "X-AUTHENTICATION-TOKEN": authToken,
                    "X-AUTHENTICATION-EMAIL": authEmail
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

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;

        today = moment(today).format('dddd, MMMM Do, YYYY');
        $('#curDate').html(today);

        Opentip.styles.bottomtip = {
          tipJoint: "top",
          group: "tags",
          target: true,
          offset: [0, -140],
          delay: 0
        };
        Opentip.styles.toptip = {
          tipJoint: "bottom",
          group: "tags",
          target: true,
          offset: [0, -130],
          delay: 0
        };
        Opentip.styles.righttip = {
          tipJoint: "left",
          group: "tags",
          target: true,
          delay: 0,
          offset: [10, -140]
        };
        Opentip.styles.lefttip = {
          tipJoint: "right",
          group: "tags",
          target: true,
          delay: 0,
          offset: [10, -140]
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
        	new Opentip(contactImages[1], "Compose Email", {
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
            new Opentip(slideImages[0], "Compose Email", {
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
        var modal7Links = $('.openModal7');
        modal6Links.click(function(){ $('#openModal7').addClass('active'); });

    	// set current email
        $("#eaddr option:first").html(authEmail);
        
        var ajaxObj = {
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": authEmail
            }
        };

        $.ajax({
            type: 'GET',
            url: baseURL + '/contacts',
            contentType: "application/json",
            dataType: "json",
            headers: {
                "X-AUTHENTICATION-TOKEN": authToken,
                "X-AUTHENTICATION-EMAIL": authEmail
            },
            success: function (data) {
                var emailData = data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].emails.length > 0 && !data[i].name) {
                        emailData[i].firstEmail = data[i].emails[0].email;
                    }
                }
                var contacts = new Bloodhound({
                  datumTokenizer: function(contact) { return Bloodhound.tokenizers.whitespace(contact.name || ""); },
                  queryTokenizer: Bloodhound.tokenizers.whitespace,
                  local: data
                });

                var contactEmails = new Bloodhound({
                  datumTokenizer: function(contact) { return Bloodhound.tokenizers.whitespace(contact.firstEmail || ""); },
                  queryTokenizer: Bloodhound.tokenizers.whitespace,
                  local: emailData
                });

                var events = new Bloodhound({
                  datumTokenizer: function(event) { return Bloodhound.tokenizers.whitespace(event.title || ""); },
                  queryTokenizer: Bloodhound.tokenizers.whitespace,
                  prefetch: {
                    url: baseURL + '/events',
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
                    url: baseURL + '/tasks',
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
                    url: baseURL + '/tags',
                    ajax: ajaxObj,
                    filter: function(obj) {
                      return obj.tags;
                    }
                  }
                });

                contacts.initialize();
                contactEmails.initialize();
                events.initialize();
                tasks.initialize();
                tags.initialize();

                window.refetchTypeaheadData = function() {
                    localStorage.clear();
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
                var emailsDatasource = {
                    name: 'Emails',
                    displayKey: 'firstEmail',
                    source: contactEmails.ttAdapter(),
                    templates: {
                        header: '<h2>Emails</h2>'
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
                            $('.association > img').click(function() { newRow.remove(); });
                            itemList.append(newRow);
                        }
                    }
                };

                var redirectObject = function (obj, datum) {
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
                };

                var addSelectedObject = function (obj, datum) {
                    $(obj.target).typeahead('val', '');
                    var mainObjectId = $('#contactname span').html();
                    $("#scriptRemover").html(mainObjectId);
                    $("#scriptRemover").find('script').remove();
                    mainObjectId = $("#scriptRemover").html();
                    $("#scriptRemover").html("");
                    console.log("main object:" + mainObjectId);
                    var mainObjectType;
                    if ($("#contactname").hasClass('contactname')) {
                        mainObjectType = "contact";
                    } else if ($("#contactname").hasClass('eventname')) {
                        mainObjectType = "event";
                    } else if ($("#contactname").hasClass('taskname')) {
                        mainObjectType = "task";
                    } else if ($("#contactname").hasClass('tagname')) {
                        mainObjectType = "tag";
                    }
                    console.log("object type:" + mainObjectType);
                    var objectID;
                    var displayText;
                    var objImage;
                    var payload;
                    var url = baseURL + mainObjectType + 's/' + mainObjectId;
                    //check which object has been selected
                    if (datum.hasOwnProperty('organization')) { // contact
                        objectID = 'contact' + datum.id;
                        displayText = datum.name;
                        objImage = "contacts";
                    } else if (datum.hasOwnProperty('start_datetime')) { // event
                        objectID = 'event' + datum.id;
                        displayText = datum.title;
                        objImage = "events";
                    } else if (datum.hasOwnProperty('notes') && datum.hasOwnProperty('due')) { // task
                        objectID = 'task' + datum.id;
                        displayText = datum.title;
                        objImage = "tasks";
                    } else if (datum.hasOwnProperty('name') && datum.hasOwnProperty('id')) { // tag
                        objectID = 'tag' + datum.id;
                        displayText = datum.name;
                        objImage = "tags";
                    } else { // invalid
                        console.log("Unknown datum selected: " + datum);
                    }
                    if (objectID && displayText) {
                        var itemList = $(".infopanel.selected");
                        var existingItems = $('[objectid=' + objectID + ']', itemList);
                        if (existingItems.length === 0) {
                            var newRow = $('<div objectid="' + objectID + '" class="contactrow tagrow newlyadded"><a href="#/' + objImage + '/' + datum.id + '"><img src="img/' + objImage + '.png"><h4>' + displayText + '</h4><span class="hidden">' + datum.id + '</span></a><img src="img/close.png" class="removeAssoc" /></div>');
                            itemList.append(newRow);
                            $('.removeAssoc').click(function() { newRow.remove(); });
                        }
                        var allObjects = $('.infopanel.selected .contactrow');
                        var objectArray = new Array();
                        var thisObjId;
                        for (var i = 0; i < allObjects.length; i++) {
                            thisObjId = $(allObjects[i]).find('span').html();
                            $("#scriptRemover").html(thisObjId);
                            $("#scriptRemover").find("script").remove();
                            thisObjId = $("#scriptRemover").html();
                            $("#scriptRemover").html("");
                            objectArray[i] = thisObjId;
                        }
                        if (objImage === "contacts") {
                            if (mainObjectType === "event") {
                                payload = {
                                    event: {
                                        contact_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "task") {
                                payload = {
                                    task: {
                                        contact_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "tag") {
                                payload = {
                                    tag: {
                                        contact_ids: objectArray
                                    }
                                }
                            }
                            console.log(payload);
                        }
                        else if (objImage === "events") {
                            if (mainObjectType === "contacts") {
                                payload = {
                                    contact: {
                                        event_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "task") {
                                payload = {
                                    task: {
                                        event_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "tag") {
                                payload = {
                                    tag: {
                                        event_ids: objectArray
                                    }
                                }
                            }
                            console.log(payload);
                        }
                        else if (objImage === "tasks") {
                            if (mainObjectType === "contacts") {
                                payload = {
                                    contact: {
                                        task_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "event") {
                                payload = {
                                    event: {
                                        task_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "tag") {
                                payload = {
                                    tag: {
                                        task_ids: objectArray
                                    }
                                }
                            }
                            console.log(payload);
                        }
                        else if (objImage === "tags") {
                            if (mainObjectType === "contacts") {
                                payload = {
                                    contact: {
                                        tag_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "event") {
                                payload = {
                                    event: {
                                        tag_ids: objectArray
                                    }
                                }
                            } else if (mainObjectType === "task") {
                                payload = {
                                    task: {
                                        tag_ids: objectArray
                                    }
                                }
                            }
                            console.log(payload);
                        }

                        var showPopupMessage = function(target, message, style) {
                            var statusPopup = new Opentip($(".panelcontent"), message, {style: style, showOn: null, hideOn: 'null', removeElementsOnHide: true});
                            statusPopup.show();
                            statusPopup.container.css('z-index', 100000);
                            setTimeout(function() {
                                statusPopup.hide();
                                setTimeout($('.close').click(), 300);
                            }, 2000);
                        };

                        $.ajax({
                            type: 'PUT',
                            url: url,
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(payload),
                            headers: {
                                "X-AUTHENTICATION-TOKEN": authToken,
                                "X-AUTHENTICATION-EMAIL": authEmail
                            },
                            success: function (data) {
                                console.log(data);
                                showPopupMessage("#contactname", "Successfully associated object");
                                setTimeout(refetchTypeaheadData, 1000);
                            },
                            error: function (e) {
                                console.log(e.statusText);
                                showPopupMessage("#contactname", "Error associating object");
                            }
                        });
                    }
                };

                $("#typeAheadContact").typeahead(typeaheadOptions, eventsDatasource, tasksDatasource, tagsDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadEvent").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, tasksDatasource, tagsDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadTask").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, eventsDatasource, tagsDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadTag").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, eventsDatasource, tasksDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadOrphanEvent").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, tasksDatasource, tagsDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadOrphanTask").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, eventsDatasource, tagsDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);     
                $("#typeAheadOrphanTag").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource, eventsDatasource, tasksDatasource)
                    .on('typeahead:selected', onTypeaheadSelected);
                $("#typeAheadAddContact").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource)
                    .on('typeahead:selected', addSelectedObject);
                $("#typeAheadAddEvent").typeahead(typeaheadOptions, eventsDatasource)
                    .on('typeahead:selected', addSelectedObject);
                $("#typeAheadAddTask").typeahead(typeaheadOptions, tasksDatasource)
                    .on('typeahead:selected', addSelectedObject);
                $("#typeAheadAddTag").typeahead(typeaheadOptions, tagsDatasource)
                    .on('typeahead:selected', addSelectedObject);
                $("#typeAheadJustContacts").typeahead(typeaheadOptions, contactsDatasource, emailsDatasource)
                    .on('typeahead:selected', redirectObject);
                $("#typeAheadJustEvents").typeahead(typeaheadOptions, eventsDatasource)
                    .on('typeahead:selected', redirectObject);
                $("#typeAheadJustTasks").typeahead(typeaheadOptions, tasksDatasource)
                    .on('typeahead:selected', redirectObject);
                $("#typeAheadJustTags").typeahead(typeaheadOptions, tagsDatasource)
                    .on('typeahead:selected', redirectObject);

                window.bindSearchField = function(a, b, c) {
                    var searchAll = $("#searchAll");
                    if (searchAll.hasClass('tt-input'))
                        return;
                    var searchTypeaheadOptions = $.extend({}, typeaheadOptions);
                    searchTypeaheadOptions.hint = false;
                    searchAll.typeahead(searchTypeaheadOptions, contactsDatasource, emailsDatasource, eventsDatasource, tasksDatasource, tagsDatasource)
                    .on('typeahead:selected',  function(obj, datum) {

                        $("#loader").addClass("showLoader");
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
            },
            error: function (e) {
                console.log("There was an error prefetching contacts: " + e);
            }
        });

        setTimeout(function(){

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

            setTimeout(function(){

                $('#eventStart').datetimepicker({
                    id:"eventDateStart",
                    formatTime: 'g:i A',
                    format: 'm/d/Y g:i A',
                    validateOnBlur:false
                });
                $('#allDayStart').datetimepicker({
                    id:"allDayStart",
                    format: 'm/d/Y',
                    timepicker: false,
                    validateOnBlur:false
                });
                $('#eventEnd').datetimepicker({
                    id:"eventDateEnd",
                    formatTime: 'g:i A',
                    format: 'm/d/Y g:i A',
                    validateOnBlur:false
                });
                $('#allDayEnd').datetimepicker({
                    id:"allDayEnd",
                    format: 'm/d/Y',
                    timepicker: false,
                    validateOnBlur:false
                });
                $('#taskDue').datetimepicker({
                    id:"taskDate",
                    format: 'm/d/Y',
                    timepicker: false,
                    validateOnBlur:false
                });
                $('#taskDueTime').datetimepicker({
                    id:"taskDateTime",
                    formatTime: 'g:i A',
                    format: 'm/d/Y g:i A',
                    validateOnBlur:false
                });
                $('#endEventRepeat').datetimepicker({
                    id:"endEvent",
                    formatTime: 'g:i A',
                    format: 'm/d/Y g:i A',
                    validateOnBlur:false
                });

                $('.formrow img').click(function(event){
                    $(event.target).parent().find('input').datetimepicker('show');
                });

            }, 1000);

            window.addEventListener('load', function() {
                new FastClick(document.body);
            }, false);

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-46373758-1']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        }, 1);

    }, 100);

}
/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

$(window).load(function() {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

    var portraits = $(".charPorts img");

    var bounce = new Bounce();
    bounce.translate({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 0 },
      duration: 1500
    });
    var bounce2 = new Bounce();
    bounce2.translate({
      from: { x: 0, y: 0 },
      to: { x: -100, y: 0 },
      duration: 1500
    });
    var bounce3 = new Bounce();
    bounce3.translate({
      from: { x: 0, y: 0 },
      to: { x: 0, y: -100 },
      duration: 1000
    });
    var bounce4 = new Bounce();
    bounce4.scale({
      from: { x: 0.5, y: 0.5 },
      to: { x: 1, y: 1 }
    });

    $("#preload").addClass("active");
    bounce4.applyTo($("#mainLogo"));

    var largeCharacters = $("#charCarousel img");
    var charIndex = 0;
    $(largeCharacters[charIndex]).addClass("animating");
    charIndex++;
    $(largeCharacters[charIndex]).addClass("animating");
    charIndex++;
    var animatedCharacters = setInterval(function(){
        console.log(charIndex);
        $(largeCharacters[charIndex]).removeClass("animating").removeClass("startAnimation");
        setTimeout(function(){
            $(largeCharacters[charIndex]).addClass("animating");
            charIndex++;
            if (charIndex == largeCharacters.length) {
                charIndex = 0;
            }
        }, 1000);
    }, 45000);

    setTimeout(function(){
        var i = 0;
        var showPortraits = setInterval(function(){
            if (i < portraits.length) {
                if (i < 2) {
                    bounce.applyTo($(portraits[i]));
                    $(portraits[i]).addClass("active");
                } else {
                    bounce2.applyTo($(portraits[i]));
                    $(portraits[i]).addClass("active");
                }
                i++;
            } else {
                clearInterval(showPortraits);
                setTimeout(function(){
                    $("#mainHeader").textillate({ 
                        in: { 
                            effect: 'bounceInDown',
                            delay: 50,
                            shuffle: true
                        } 
                    });
                    $("#mainHeader").addClass("active");
                    setTimeout(function(){
                        $("#secondHeader").addClass("active");
                        $("#secondHeader").click(function(){
                            $("#trailerContainer").addClass("active");
                            $("#darkOverlay").addClass("active");
                            $("#charCarousel").removeClass("active");
                            setTimeout(function(){
                                $('object').addClass('active');
                                $('#closePlayer').addClass('active');
                                var killTrailer = function(){
                                    var thisVid = $("#trailerContainer").html();
                                    $("#trailerContainer").html('');
                                    $("#closePlayer").unbind('click').removeClass("active");
                                    $("#darkOverlay").unbind('click').removeClass("active");
                                    $("#trailerContainer").removeClass("active");
                                    $("#charCarousel").addClass("active");
                                    $("object").removeClass("active");
                                    setTimeout(function(){
                                        $("#trailerContainer").html(thisVid);
                                    }, 400);
                                };
                                $('#closePlayer').click(function(){
                                    killTrailer()
                                });
                                $('#darkOverlay').click(function(){
                                    killTrailer()
                                });
                            }, 500);
                        });
                        var socialIcons = $("#socialImages img");
                        i = 0;
                        var showSocials = setInterval(function(){
                            if (i < socialIcons.length) {
                                bounce3.applyTo($(socialIcons[i]));
                                $(socialIcons[i]).addClass("active");
                                i++;
                            } else {
                                clearInterval(showSocials);
                                $("#charCarousel").addClass("active");
                                setTimeout(function(){
                                    $("#contactLink").addClass("active");
                                    $("#walter").addClass("active");
                                }, 200);
                            }
                        }, 200);
                    }, 1500);
                }, 200);
            }
        }, 200);
    }, 100);

})(jQuery); // End of use strict

/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {

    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 100
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    $("#navLogo > img").click(function(){
        $(".nav > li:first-child > a").click()
    });

    $(".projectImage").click(function(event){
        $("#modalImage").attr("src", $(event.target).attr("src"));
        setTimeout(function(){
            $(".modal-backdrop").click(function(){
                $("#myModal").modal("hide");
            });
        }, 200);
    });

    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 250) {
            $("#about").addClass("active");
            if ($("body").width() > 768) {
                $("#about1").textillate({
                    initialDelay: 400,
                    in: {  
                        effect: 'flipInY',
                        delay: 3
                    }  
                });
                $("#about2").textillate({
                    initialDelay: 2400,
                    in: {  
                        effect: 'flipInY',
                        delay: 3
                    }  
                });
                $("#about3").textillate({
                    initialDelay: 6000,
                    in: {  
                        effect: 'flipInY',
                        delay: 3
                    }  
                });
            }
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 940) {
                $("#work").addClass("active");
                var allScreenshots = $(".projectImage");
                var thisImage;
                console.log(allScreenshots);
                setTimeout(function(){
                    for (var i = 0; i < allScreenshots.length; i++) {
                        thisImage = allScreenshots[i];
                        console.log(thisImage);
                        $(thisImage).addClass("active");
                    }
                }, 700);
            }
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 1900) {
                $("#games").addClass("active");
                if ($("body").width() > 768) {

                    // $("#contact1").textillate({
                    //     initialDelay: 400,
                    //     in: {  
                    //         effect: 'flipInY',
                    //         delay: 3
                    //     }  
                    // });  

                    // setTimeout(function(){
                    //     $("#contact2").addClass("active");
                    //     setTimeout(function(){
                    //         $(".banner-social-buttons").addClass("active");
                    //     }, 700);
                    // }, 1000);

                } else {

                    // $("#contact2").addClass("active");

                    // setTimeout(function(){
                    //     $(".banner-social-buttons").addClass("active");
                    // }, 700);
                
                }

            }
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight + 2600) {
                $("#contact").addClass("active");
                if ($("body").width() > 768) {

                    $("#contact1").textillate({
                        initialDelay: 400,
                        in: {  
                            effect: 'flipInY',
                            delay: 3
                        }  
                    });  

                    setTimeout(function(){
                        $("#contact2").addClass("active");
                        setTimeout(function(){
                            $(".banner-social-buttons").addClass("active");
                        }, 700);
                    }, 1000);

                } else {

                    $("#contact2").addClass("active");

                    setTimeout(function(){
                        $(".banner-social-buttons").addClass("active");
                    }, 700);
                
                }

            }
        }
    };

});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

function init() {
    setTimeout(function(){
        $("#mainBg").addClass("active");
        setTimeout(function(){
            $("#root").addClass("active");
            setTimeout(function(){
                $("#seventySix").removeClass("notYet");
                $("#seventySix").addClass("active");
            //     $('#seventySix').textillate({
            //         initialDelay: 400,
            //         in: {  
            //             effect: 'rollIn'  
            //         }  
            //     });
                setTimeout(function(){
                    $("#downButton").addClass("active");
                }, 800);
            }, 500);
        }, 800);
    }, 100);
}

init()
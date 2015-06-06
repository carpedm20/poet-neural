$("#spinner").hide();
var load_check = false;
var make_check = false;
var review_page = 1;

function update_reviews() {
    if (!load_check) {
        load_check = true;

        $.ajax({
            dataType: "json",
            url: '/carpedm20/alba/load/' + review_page,
            success: function(data) {
                backup = $("#btn-wrapper").wrap('<p/>').parent().html();
                $("#btn-wrapper").remove();
                for (var idx in data['reviews']) {
                    review = data['reviews'][idx];
                    tmp = '<div class="posts"><section class="post"><h1 class="content-subhead">' + review[1] + '</h1><div class="post-description"><p>' + review[0] + '</p></div></section></div>'
                    $("#reviews").append(tmp);
                }
                $("#reviews").append(backup);

                $("#review-btn").click(function() {
                    update_reviews();
                });

                load_check = false;
                review_page++;
            }
        });
    }
}

$(document).ready(function () {
    $("#review-btn").click(function() {
        update_reviews();
    });
    $("form").submit(function(e) {
        $("#submit-btn").hide();
        $("#spinner").show();
        $("#spinner").css('visibility', 'visible');
        $("#spinner").css('position', 'relative');
        e.preventDefault();
        var data = $(this).serializeArray();
        $.ajax({
            dataType: "json",
            method: "POST",
            url: '/carpedm20/alba/make/',
            data: data,
            success: function(data) {
                for (var idx in data['reviews']) {
                    review = data['reviews'][idx];
                    console.log(review);
                    tmp = '<div class="posts"><section class="post"><h1 class="content-subhead">' + review[1] + '</h1><div class="post-description"><p>' + review[0] + '</p></div></section></div>'
                    $("#reviews").prepend(tmp);
                }
                $("#submit-btn").show();
                $("#spinner").hide();
                $("#spinner").css('position', 'absolute');

                make_check = false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
                $("#submit-btn").show();
                $("#spinner").hide();
                $("#spinner").css('position', 'absolute');
            }
        });
        return false;
    });
});

//jQuery to collapse the home-menu on scroll
$(window).scroll(function() {
    if ($(".splash").offset().top > 330) {
        $(".home-menu").addClass("top-nav-collapse");
    } else {
        $(".home-menu").removeClass("top-nav-collapse");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

var alba_theater = new TheaterJS();

alba_theater
  .describe("SimSim", { speed: .3, accuracy: 1, invincibility: 4 }, "#alba-title")

alba_theater
  .on("*", function (eventName, originalEvent, sceneName, arg) {
  })
  .on("say:start, erase:start", function (eventName) {
    var self    = this,
        current = self.current.voice;
    self.utils.addClass(current, "saying");
  })
  .on("say:end, erase:end", function (eventName) {
    var self    = this,
        current = self.current.voice;
    //self.utils.removeClass(current, "saying");
  });


alba_theater
  .write("SimSim:인공지능 심심이", 1000)
  .write("SimSim:심심이 뉴런")


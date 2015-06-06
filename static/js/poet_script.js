$("#spinner").hide();
$(document).ready(function () {
    $(".like").click(function() {
        var poet = $(this);
        var pid = $(this).attr('id');
        $.ajax({
            dataType: "json",
            url: '/carpedm20/poet/like/' + pid,
            success: function(data) {
                console.log(data);
                if (data.success) {
                    poet.html('<i class="fa fa-heart"></i> 좋아요 '+data.count);
                }
            }
        });
    });
    $("form").submit(function(e) {
        $("#submit-btn").hide();
        $("#spinner").show();
        $("#spinner").css('visibility', 'visible');
        $("#spinner").css('position', 'relative');
        e.preventDefault();
        var data = $(this).serializeArray();
        console.log(data);
        $.ajax({
            dataType: "json",
            method: "POST",
            url: '/carpedm20/poet/make/',
            data: data,
            success: function(data) {
                window.location.href = "/carpedm20/poet/" + data['index'];
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

var poet_theater = new TheaterJS();

poet_theater
  .describe("Poet", { speed: .3, accuracy: 1, invincibility: 4 }, "#poet-title")

poet_theater
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


poet_theater
  .write("Poet:인공지능 시팔이", 1000)
  .write("Poet:시인 뉴럴")


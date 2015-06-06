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
var alba_theater = new TheaterJS();

poet_theater
  .describe("Poet", { speed: .3, accuracy: 1, invincibility: 4 }, "#poet-title")
alba_theater
  .describe("Alba", { speed: .3, accuracy: 1, invincibility: 4 }, "#alba-title")

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


poet_theater
  .write("Poet:인공지능 시팔이", 1000)
  .write("Poet:시인 뉴럴")

alba_theater
  .write("Alba:인공지능 알바", 1000)
  .write("Alba:뉴럴 알바")

var theater = new TheaterJS();

theater
  .describe("Poet", { speed: .05, accuracy: 1, invincibility: 4 }, "#title")

theater
  .on("*", function (eventName, originalEvent, sceneName, arg) {
    var args  = Array.prototype.splice.apply(arguments, [3]),
        log   = '{\n      name: "' + sceneName + '"';

    log += ",\n      args: " + JSON.stringify(args).split(",").join(", ");
    log += "\n    }";

  })
  .on("say:start, erase:start", function (eventName) {
    // this refer to the TheaterJS instance.
    var self    = this,
        
        // The current actor is referenced as this.current
        // Its voice is the third element passed to the describe method.
        // It could be of two types: a DOM element or a function.
        current = self.current.voice;

    // TheaterJS has some useful methods such as
    // addClass, hasClass, removeClass, ...
    // Note: the "saying" class adds the blinking caret.
    self.utils.addClass(current, "saying");
  })
  .on("say:end, erase:end", function (eventName) {
    var self    = this,
        current = self.current.voice;

    // When say or erase ends, remove the caret.
    //self.utils.removeClass(current, "saying");
  });


theater
  .write("Poet:시인 뉴럴")
  .write(400)

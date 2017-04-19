var putils = (function ($) {
  "use strict";

  window.console.log("Loading putils");
  // Converts an Number represention of milliseconds into an object holding
  // formatted hours, minutes and second strings.
      function millisToTime(ms) {
          let secs = Math.round(ms/1000);
          let hours = Math.floor(secs / (60 * 60)).toString();

          let divisor_for_minutes = secs % (60 * 60);
          let minutes = Math.floor(divisor_for_minutes / 60);

          let divisor_for_seconds = divisor_for_minutes % 60;
          let seconds = Math.ceil(divisor_for_seconds);


          let obj = {
              "h": hours,
              "m": minutes,
              "s": seconds
          };
          return obj;
      }
   let module = {};
   module.millisToTime = millisToTime;
   return module;
}(jQuery));

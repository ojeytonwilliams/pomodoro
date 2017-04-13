// TODO is there any need to store the times in
// this object?  Isn't it sufficient to have them
// on the DOM?  Performance?

// TODO It's probably clearer to have three functions setWork, setNotes and setBreak
// rather than this awkward switch.  What does it get us?

var pomodoro = (function ($) {
  var module = {};
  function Pomodoro(work, notes, breakTime, element) {
      this.notes = notes;
      this.work = work;
      this.breakTime = breakTime;
      this.workTimer = null;
      this.notesTimer = null;
      this.breakTimer = null;

      var widthCoefficient = 11/1000;
    //  var minutesToSeconds = 1000;


      this.startWorking = function startWorking(){
        // convert minutes to seconds and then start the timer
        this.workTimer.prepare(this.work);
        if(this.notes > 0){
          this.notesTimer.prepare(this.notes + this.work);
        }
        this.start();
      };

      this.pause = function pause() {
        // TODO placeholder pause, just stopping the timers.
        this.stop();
      }

      this.start = function restart() {
        this.workTimer.start();
        this.notesTimer.start();
      }

      this.resume = function resume() {
        this.workTimer.resume();
        this.notesTimer.resume();
      }

      this.startBreak = function startBreak() {
        // convert minutes to seconds and then start the timer
        this.breakTimer.start(breakTime);
      };

      this.stop = function stop() {
        this.workTimer.stop();
        this.notesTimer.stop();
        this.breakTimer.stop();
      };

      this.setTime = function setTime(time, type) {
        switch (type) {
          case 0:
            this.work = time;
            element.children('.first-timer').width(widthCoefficient*this.work);
            break;
          case 1:
            this.notes = time;
            element.children('.second-timer').width(widthCoefficient*this.notes);
            break;
          case 2:
            this.breakTime = time;
            element.children('.break-timer').width(widthCoefficient*this.breakTime);
            break;
          default:

        }
      };
      this.updateTimes = function updateTimes(work, notes, breakTime) {
        this.setTime(work, 0);
        this.setTime(notes, 1);
        this.setTime(breakTime, 2);
      };

      // Initial update.
      this.updateTimes(work, notes, breakTime);

      function report(workTime, pausedTime) {
        window.console.log("Work: " + workTime + " Paused: " + pausedTime);
      }
      this.setWorkTimer = function setWorkTimer(updateDisplay, audio) {
        this.workTimer = new Timer(updateDisplay, audio, report);
      };


      this.setNotesTimer = function setNotesTimer (updateDisplay, audio) {
          this.notesTimer = new Timer(updateDisplay, audio, report);
      };

      this.setBreakTimer = function setBreakTimer (updateDisplay, audio) {
        this.breakTimer = new Timer(updateDisplay, audio, report);
      };
  }





  module.create = function createPomodoro(work, notes, breakTime, element) {
    return new Pomodoro(work, notes, breakTime, element);
  };

  return module;
}(jQuery));

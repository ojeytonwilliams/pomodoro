// TODO is there any need to store the times in
// this object?  Isn't it sufficient to have them
// on the DOM?  Performance?

// TODO: The coupling between js and html is too tight.

// TODO It's probably clearer to have three functions setWork, setNotes and setBreak
// rather than this awkward switch.  What does it get us?

var pomodoroBuilder = (function ($) {
  "use strict";
  var module = {};
  function Pomodoro(work, notes, breakTime, element) {
      this.notesDuration = notes;
      this.workDuration = work;
      this.breakDuration = breakTime;
      this.workTimer = null;
      this.notesTimer = null;
      this.breakTimer = null;

// TODO: Magic number, explain!
      var widthCoefficient = 11/60000;
    //  var minutesToSeconds = 1000;


      this.startWorking = function startWorking(){
        this.workTimer.prepare(this.workDuration).start();
      };

      this.startNotes = function startNotes(){
        this.notesTimer.prepare(this.notesDuration).start();
      };

      this.pause = function pause() {
        this.workTimer.stop();
        this.notesTimer.stop();
      };

      var restart = () => {
        this.workTimer.start();
        this.notesTimer.start();
      };

      this.resume = function resume() {
        this.workTimer.resume();
        this.notesTimer.resume();
      };

      this.startBreak = function startBreak() {
        // convert minutes to seconds and then start the timer
        this.breakTimer.prepare(this.breakDuration).start();
      };

      this.stop = function stop() {
        this.workTimer.stop();
        this.notesTimer.stop();
        this.breakTimer.stop();
      };

      this.setWorkDuration = function setWorkDuration(time) {
        this.workDuration = time;
      }

      this.setNotesDuration = function setNotesDuration(time) {
        this.notesDuration = time;
      }

      this.setBreakDuration = function setBreakDuration(time) {
        this.breakDuration = time;
      }
      this.updateDurations = function updateDurations(work, notes, breakTime) {
        this.setWorkDuration(work);
        this.setNotesDuration(notes);
        this.setBreakDuration(breakTime);
      };

      // Initial update.
      this.updateDurations(work, notes, breakTime);



      this.setWorkTimer = function setWorkTimer(updateDisplay, audio, callback) {
    //    this.workTimer = new Timer(updateDisplay, audio, report);
     this.workTimer = new Timer(updateDisplay, audio, callback);
      };

      this.setNotesTimer = function setNotesTimer (updateDisplay, audio, callback) {
          this.notesTimer = new Timer(updateDisplay, audio, callback);
      };

      this.setBreakTimer = function setBreakTimer (updateDisplay, audio, callback) {
        this.breakTimer = new Timer(updateDisplay, audio, callback);
      };
  }





  module.create = function createPomodoro(work, notes, breakTime, element) {
    return new Pomodoro(work, notes, breakTime, element);
  };

  return module;
}(jQuery));

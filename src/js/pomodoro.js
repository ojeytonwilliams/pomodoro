(function ($) {
  'use strict';
  var minutesToMillis = 2000; // TODO it's set low for debugging, but should
  // be 60000.
  //  var minutesToMillis = 60000;

  var widthCoefficient = 11/minutesToMillis;
  function updateDisplay(display, remainingTime) {
      let time = putils.millisToTime(remainingTime);
      let minutes = display.children(".minutes.units");
      let minutesLeadingZero = display.children(".minutes.leading-zero");
      window.console.log(minutesLeadingZero);
      let seconds = display.children(".seconds.units");
      let secondsLeadingZero = display.children(".seconds.leading-zero");
      minutes.text(time.m + ":")
      seconds.text(time.s);

      if (time.m < 10) {
          addTranslucentZero(minutesLeadingZero);
      } else {
          removeTranslucentZero(minutesLeadingZero);
      }

      if (time.s < 10) {
          if (time.m > 0) {
              addOpaqueZero(secondsLeadingZero);
          } else {
              addTranslucentZero(secondsLeadingZero);
          }
      } else {
          removeTranslucentZero(secondsLeadingZero);
          removeOpaqueZero(secondsLeadingZero);
      }

      if (time.m <= 0) {
          minutes.addClass('zero');
      } else {
          minutes.removeClass('zero');
      }

      if (time.s <= 0) {
          seconds.addClass('zero');
      } else {
          seconds.removeClass('zero');
      }

      function addTranslucentZero(elem) {
          elem.text('0').addClass('zero');
      }

      function removeTranslucentZero(elem) {
          elem.text('').removeClass('zero');
      }

      function addOpaqueZero(elem) {
          elem.text('0');
      }

      function removeOpaqueZero(elem) {
          elem.text('');
      }
  }


  function updateWork(remainingTime) {
      updateDisplay($(".work-display"), remainingTime);
  }

  function updateNotes(remainingTime) {
      updateDisplay($(".notes-display"), remainingTime);
  }

  function updateBreak(remainingTime) {
      $(".break-display").text(remainingTime);
  }

  function resetDisplay() {
      window.console.log("Resetting work to: " + ($('#work-list > li').val() * minutesToMillis));
      updateWork($('#work-list > li.active').val() * minutesToMillis);
      updateNotes($('#notes-list > li.active').val() * minutesToMillis);
      updateBreak($('#break-list > li.active').val() * minutesToMillis);
  }

  var pomodoroElement = $(".pomodoro");
  var pomodoro = createPomodoro();

  resetDisplay();
  initButtons();

  function createPomodoro() {
      var first = $('#work-list > li.active').val() * minutesToMillis // = Number(timings.find("input.set-first").val());
      var second = $('#notes-list > li.active').val() * minutesToMillis //Number(timings.find("input.set-second").val());
      var breakTime = $('#break-list > li.active').val() * minutesToMillis //Number(timings.find("input.set-break").val());
      var out = pomodoroBuilder.create(first, second, breakTime);
      var workAudio = new Audio("../assets/audio/250629__kwahmah-02__alarm1.mp3");
      var notesAudio = new Audio("../assets/audio/250629__kwahmah-02__alarm1.mp3");
      var breakAudio = new Audio("../assets/audio/250629__kwahmah-02__alarm1.mp3");
      workAudio.volume = 0.05;
      notesAudio.volume = 0.05;
      breakAudio.volume = 0.05;

      let reportWorkAndStartNotes = (workTime, pausedTime) => {
        window.console.log("Work: " + workTime + " Paused: " + pausedTime);
        out.startNotes();
      }

      let reportNotes = (notesTime, pausedTime) => {
        window.console.log("Notes: " + notesTime + " Paused: " + pausedTime);
        // TODO: Tell the user they can take a break.
        enable($('.button-start'));
        disable($('.button-pause'));
        disable($('.button-resume'));
        disable($('.button-reset'));
      }

      let reportBreak = (breakTime, pausedTime) => {
        window.console.log("Break: " + breakTime + " Paused: " + pausedTime);
        // TODO: Everything.
      }

      out.setWorkTimer(updateWork, workAudio, reportWorkAndStartNotes);
      out.setNotesTimer(updateNotes, notesAudio, reportNotes);
      out.setBreakTimer(updateBreak, breakAudio, reportBreak);
      return out;
  }

  function disable(elem) {
      elem.removeClass('ready').prop("disabled", true);
  }

  function enable(elem) {
      elem.addClass('ready').prop("disabled", false);
  }

  function toggle(elem) {
      elem.toggleClass('ready').prop("disabled", (i, val) => {
          return !val
      });
  }

  function initButtons() {
      $('#work-list > li').click(function() {
          let time = $(this).val() * minutesToMillis;
          pomodoro.setWorkDuration(time);
          pomodoroElement.children('.first-timer').width(widthCoefficient*time);
          // Unset the previously active li
          $('#work-list > li').removeClass('active')
          // And set this one
          $(this).addClass('active');
      });

      $('#notes-list > li').click(function() {
          let time = $(this).val() * minutesToMillis;
          pomodoro.setNotesDuration(time);
          pomodoroElement.children('.second-timer').width(widthCoefficient*time);
          // Unset the previously active li
          $('#notes-list > li').removeClass('active')
          // And set this one
          $(this).addClass('active');
      });

      $('#break-list > li').click(function() {
          let time = $(this).val() * minutesToMillis;
          pomodoro.setBreakDuration(time);
          pomodoroElement.children('.third-timer').width(widthCoefficient*time);
          // Unset the previously active li
          $('#break-list > li').removeClass('active')
          // And set this one
          $(this).addClass('active');
      });

      $(".button-start").click(function() {
          pomodoro.startWorking();
          disable($(".button-start"));
          enable($(".button-pause"));
          enable($(".button-reset"));
          disable($(".button-resume"));
      });

      $(".button-pause").click(function() {
          pomodoro.pause();
          toggle($(this));
          enable($(".button-resume"));
      });

      $(".button-resume").click(function() {
          pomodoro.resume();
          toggle($(this));
          enable($(".button-pause"));
      });

      $(".button-reset").click(function() {
          pomodoro.stop();
          resetDisplay();
          toggle($(this));
          enable($(".button-start"));
          disable($(".button-resume"));
          disable($(".button-pause"));
      });
  }
})(jQuery);

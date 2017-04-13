function Timer(updateDisplay, audio, reportTimes) {

    this.timerId = null;
    this.updateDisplay = updateDisplay;
    this.audio = audio;
    this.duration = null;
    this.desiredDuration = null;
    this.startTime = null;
    this.paused = false;

    var finishTimingBound = finishTiming.bind(this);

    // update every tenth of a second.
    var delta = 100;

    // TODO make this private.
    this.updateTimer = function(endTime) {
        var hours, minutes, seconds, remainingTime;

        this.duration = endTime - Date.now();

        if (this.duration <= 0) {
            finishTimingBound();
        }
        this.updateDisplay(this.duration);
    };

    function finishTiming() {
        this.audio.play();
        this.duration = 0;
        clearInterval(this.timerId);
        this.timerId = null;

        var millisPaused = Date.now() - this.startTime - this.desiredDuration;
        window.console.log((`Worked for ${Math.floor(this.desiredDuration/1000)} minutes with ${millisPaused/1000} minutes
        of unscheduled breaks`));

        if(reportTimes && typeof reportTimes === "function") {
          reportTimes(this.desiredDuration, millisPaused);
        }
    }



    this.prepare = function prepare(duration) {
        if (!Number(duration)) throw new Error("Malformed time input.  Please enter a number");
        this.desiredDuration = duration;
        this.duration = duration; // If the timer has a non-zero duration it is
        // ready to go.
    }

    this.start = function start() {
        this.startTime = Date.now();
        commenceTicking.bind(this)();
    };


    function commenceTicking() {
        if (this.duration > 0) { // The timer is in the ready state and can be
            // toggled between paused and running
            if (this.timerId === null) { // The timer is not running and should
                // be started
                if (!Number(this.duration)) throw new Error("Malformed time input.  Please enter a number");
                this.timerId = setInterval(this.updateTimer.bind(this), delta, Date.now() + Number(this.duration));
            } // It is already running.
        } // If it's not ready then nothing happens.
    }

    this.resume = function resume() {
        commenceTicking.bind(this)();
    }


    this.stop = function stop() {
        clearInterval(this.timerId); // If no timer is running, this does nothing.
        this.audio.load(); // WARNING: this is an ugly hack since I haven't been
        //able to find a better way to stop and reset the audio file.
        // the reference needs to be null, so that the timer can be restarted.
        this.timerId = null;
    };
}

/*var timer = new Timer("an id");
timer.startTimer(Date.now() + 5210);
var timerTwo = new Timer("timer TWO!!");
timerTwo.startTimer(Date.now() + 11000);

timer.startTimer(Date.now() + 15210); */

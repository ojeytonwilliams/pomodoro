function Timer(updateDisplay, audio, reportTimes) {

    this.timerId = null;
    this.updateDisplay = updateDisplay;
    this.audio = audio;
    this.duration = null;
    this.desiredDuration = null;
    this.startTime = null;
    this.paused = false;


    // update every tenth of a second.
    var delta = 100;

    var updateTimer = (endTime) => {
        this.duration = endTime - Date.now();

        if (this.duration <= 0) {
            finishTiming();
        }
        this.updateDisplay(this.duration);
    };

    var finishTiming = () => {
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
    };



    this.prepare = function prepare(duration) {
      window.console.log("Preparing with duration: " + duration );
        if (!Number(duration)) throw new Error("Malformed time input.  Please enter a number");
        this.desiredDuration = duration;
        this.duration = duration; // If the timer has a non-zero duration it is
        // ready to go.
        return this;
    };

    this.toggle = function toggle() {
      if (this.timerId === null) {
        commenceTicking();
      } else {
        this.stop();
      }
    };

    this.start = function start() {
        this.startTime = Date.now();
        window.console.log("Starting with startTime: " + this.startTime);
        commenceTicking();
    };


    var commenceTicking = () => {
      window.console.log("Commencing ticking with time: " + this.duration);
        if (this.duration > 0) { // The timer is in the ready state and can be
            // toggled between paused and running
            if (this.timerId === null) { // The timer is not running and should
                // be started
                if (!Number(this.duration)) throw new Error("Malformed time input.  Please enter a number");
                window.console.log("Setting up interval!");
                this.timerId = setInterval(updateTimer, delta, Date.now() + Number(this.duration));
            } // It is already running.
        } // If it's not ready then nothing happens.
    };

    this.resume = function resume() {
        commenceTicking();
    };


    this.stop = function stop() {
        clearInterval(this.timerId); // If no timer is running, this does nothing.
        this.audio.load(); // WARNING: this is an ugly hack since I haven't been
        //able to find a better way to stop and reset the audio file.
        // the reference needs to be null, so that the timer can be restarted.
        this.timerId = null;
    };
}

const { ipcRenderer } = require('electron');

const render = (function() {

  const ERROR_DELAY = 1500;

  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');

  const playButton = document.getElementById('play');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const stopButton = document.getElementById('stop');

  const namesCompleted = document.getElementById('completed');
  const namesSkipped = document.getElementById('skipped');

  const errorMessage = document.getElementById('error');
  const errorMessageText = document.getElementById('error-message');

  let play = false;

  function init() {
    buttonListeners();
    listen_for_updates();
  }

  function buttonListeners() {

    playButton.addEventListener('click', function(e) {

      let startingDateString = startDate.value;
      let endingDateString = endDate.value;

      if (!play) {

        if (isValidDate(startingDateString) && isValidDate(endingDateString) && isValidDateRange(startingDateString, endingDateString)) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          play = true;
          sendProgramState({play: 'play', dateOne: startingDateString, dateTwo: endingDateString});
        } else {
          startShakeIcon(playIcon);
          showError('Invalid date! <br />Dates must be entered in "mm/dd/yyyy" format.');

          if (isValidDate(startingDateString) && isValidDate(endingDateString) &&
              !isValidDateRange(startingDateString, endingDateString)) {
            showError('Invalid date range! <br /> First date must take place before second date.');
            addErrorBorder(startDate);
            setTimeout(removeErrorBorder, ERROR_DELAY, startDate);
            addErrorBorder(endDate);
            setTimeout(removeErrorBorder, ERROR_DELAY, endDate);
          } else {

            if (!isValidDate(startingDateString)) {
              addErrorBorder(startDate);
              setTimeout(removeErrorBorder, ERROR_DELAY, startDate);
            }

            if (!isValidDate(endingDateString)) {
              addErrorBorder(endDate);
              setTimeout(removeErrorBorder, ERROR_DELAY, endDate);
            }

          }

          setTimeout(hideError, ERROR_DELAY);
          setTimeout(stopShakeIcon, 100, playIcon);
        }

      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        play = false;
        sendProgramState({play: 'pause', dateOne: startingDateString, dateTwo: endingDateString});
      }
    });

    stopButton.addEventListener('click', function(e) {
      sendProgramState({play: 'stop', dateOne: "", dateTwo: ""});
    });
  }

  function sendProgramState(data) {
    ipcRenderer.send('program-controller', data);
  }

  function listen_for_updates() {
    ipcRenderer.on('update-name-count', (event, data) => {
      console.log("Recieved data: " + data);
      namesCompleted.innerHTML = "Names Completed: " + data.completed;
      namesSkipped.innerHTML = "Names Skipped: " + data.skipped;
    });
  }

  // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
  function isValidDate(dateString)
  {
      // First check for the pattern
      if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
          return false;

      // Parse the date parts to integers
      var parts = dateString.split("/");
      var day = parseInt(parts[1], 10);
      var month = parseInt(parts[0], 10);
      var year = parseInt(parts[2], 10);

      // Check the ranges of month and year
      if(year < 1000 || year > 3000 || month == 0 || month > 12)
          return false;

      var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

      // Adjust for leap years
      if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
          monthLength[1] = 29;

      // Check the range of the day
      return day > 0 && day <= monthLength[month - 1];
  };

  function isValidDateRange(value, comparedTo){
    value = value.split(/\D+/g);
    comparedTo = comparedTo.split(/\D+/g);
    let FirstDate = new Date(value[2],value[1],value[0]);
    let SecondDate = new Date(comparedTo[2],comparedTo[1],comparedTo[0]);

    return FirstDate.getTime() < SecondDate.getTime();
 }

  function startShakeIcon(element) {
    element.classList.add('fa-shake');
  }

  function stopShakeIcon(element) {
    element.classList.remove('fa-shake');
  }

  function showError(message) {
    errorMessageText.innerHTML = message;
    errorMessage.style.display = 'block';
  }

  function hideError() {
    errorMessageText.innerHTML = "";
    errorMessage.style.display = 'none';
  }

  function addErrorBorder(element) {
    element.classList.add('border-red-600');
    element.classList.add('border-8');
  }

  function removeErrorBorder(element) {
    element.classList.remove('border-red-600');
    element.classList.remove('border-8');
  }

  return {
    init: init,
  };


}());

render.init();
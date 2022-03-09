const { ipcRenderer } = require('electron');

const render = (function() {

  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');

  const playButton = document.getElementById('play');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const stopButton = document.getElementById('stop');

  const namesCompleted = document.getElementById('completed');
  const namesSkipped = document.getElementById('skipped');


  let play = false;

  function init() {
    buttonListeners();
    listen_for_updates();
  }

  function buttonListeners() {

    playButton.addEventListener('click', function(e) {

      let startingDate = startDate.value;
      let endingDate = endDate.value;

      if (!play) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        play = true;
        sendProgramState({play: 'play', dateOne: startingDate, dateTwo: endingDate});
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        play = false;
        sendProgramState({play: 'pause', dateOne: startingDate, dateTwo: endingDate});
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

  return {
    init: init,
  };


}());

render.init();
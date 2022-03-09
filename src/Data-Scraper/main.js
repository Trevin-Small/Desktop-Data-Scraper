const {ipcMain} = require('electron');
const { exec, execFile} = require('child_process');
const { PythonShell } = require('python-shell');
const spawn = require("child_process").spawn;

// Attach listener in the main process with the given ID
ipcMain.on('program-controller', (event, arg) => {

  let playState = arg.play;
  let startingDate = arg.dateOne;
  let endingDate = arg.dateTwo;

  let options = {
    cwd: "/Users/mac/Documents/Desktop-Data-Scraper/src/Data-Scraper/",
    timeout: 10000
  }

  let myShellScript = null;

  if (playState === 'play') {

    myShellScript = spawn('sh', ["/Users/mac/Documents/Desktop-Data-Scraper/src/Data-Scraper/scraper.sh", startingDate, endingDate], options);
    myShellScript.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    myShellScript.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    myShellScript.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } else  {
    console.log("other");
  }

  console.log("Play state: " + playState + ", Start Date: " + startingDate + ", End Date: " + endingDate);
});
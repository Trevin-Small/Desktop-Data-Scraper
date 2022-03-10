const {ipcMain} = require('electron');
const spawn = require("child_process").spawn;

const dataScraper = (function(win) {

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

      myShellScript.stdout.setEncoding('utf8');
      myShellScript.stdout.on('data', (data) => {
        data = data.toString();
        console.log(data.toString());
        updateRenderNameCount(data);
      });
      myShellScript.stderr.on('data', (data) => {
        data = data.toString();
        console.log(`stderr: ${data}`);

      });
      myShellScript.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    } else  {
      console.log("other");
    }
  });

  function updateRenderNameCount(stdOutString) {

    console.log(stdOutString.substring(0, 10));

    if (stdOutString.substring(0, 10) !== "completed:") {
      return;
    }

    const completedNames = stdOutString.split(' ')[1];
    const skippedNames = stdOutString.split(' ')[3];
    const data = {completed: completedNames, skipped: skippedNames};

    win.webContents.send('update-name-count', data);
    console.log("Sent: " + data);
  }

});

exports.dataScraper = dataScraper;

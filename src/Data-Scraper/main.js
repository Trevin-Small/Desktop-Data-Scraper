const {ipcMain} = require('electron');
const spawn = require("child_process").spawn;

const dataScraper = (function(win) {

  // Attach listener in the main process with the given ID
  ipcMain.on('program-controller', (event, arg) => {

    let playState = arg.play;
    let startingDate = arg.dateOne;
    let endingDate = arg.dateTwo;

    if (!isValidDate(startingDate) || !isValidDate(endingDate)) {
      startingDate = '';
      endingDate = '';
    }


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

exports.dataScraper = dataScraper;

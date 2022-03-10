# Desktop Data Scraper

#### A desktop app built around my [data entry bot](https://github.com/Trevin-Small/Data-Scraper-V2) I use for work.

![Desktop App](https://github.com/Trevin-Small/Desktop-Data-Scraper/blob/master/app_screenshot.png)

# This app automates data entry for Driggs Title agency.
- Enter in the date range for which you wish to complete records, and press play!
-  The software will open a new selenium controlled browser instance and complete data entry automagically.
- It keeps track of the number of "names" (records) completed, as well as names skipped.

## Built with electron, tailwind css, html, JS, nodeJS, python, and even a bit of shell.
- Truly a smorgasbord!

# How it works:
- Electron handles the UI, and once a valid date range is entered and the play button toggled, electron executes a bash script.
- This enters a python virtual environment before executing my [data entry program](https://github.com/Trevin-Small/Data-Scraper-V2)
- Once running, this python program opens an instance of chrome controlled by selenium, opening the websites required for Driggs Data Entry.
- The bot scrapes and parses HTML on important pages, grabbing and post-processing data that it needs.
- Data is then automatically entered into the correct records on the Driggs website at lightning speed.
- During this process, electron communicates with the python script, and updates the UI to reflect the number of records which have been completed.
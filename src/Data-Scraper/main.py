import users, title_agencies, agents, browser_windows, functions
from selenium import webdriver
import sys

def main():

    user = users.UserCredentials()
    titleAgencies = title_agencies.TitleAgencies()
    agent = agents.DriggsAgent()
    selenBrowser = webdriver.Chrome('./chromedriver')
    windows = browser_windows.BrowserWindows(selenBrowser)

    dateOne = "01/31/2021"
    dateTwo = "01/31/2022"

    if (len(sys.argv) == 3):
        dateOne = sys.argv[1]
        dateTwo = sys.argv[2]

    functions.setDates(dateOne, dateTwo)
    functions.getAgencies(user, titleAgencies, windows, selenBrowser)

    NUMBER_OF_NAMES = 200
    namesCompleted = 0
    namesSkipped = 0

    for i in range(NUMBER_OF_NAMES):
        dataEntered = functions.enterData(agent, titleAgencies, windows, selenBrowser)
        if dataEntered:
            namesCompleted += 1
        else:
            namesSkipped += 1

        print("completed: " + str(namesCompleted) + " skipped: " + str(namesSkipped))

    print("Program Complete. Names Completed: " + str(namesCompleted))

main()
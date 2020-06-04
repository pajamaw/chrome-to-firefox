# About 
I made this because I was annoyed that I still hadn't switched over from chrome to safari or firefox. I've found that firefox has a better development environment for javascript as well as for following network requests - safari also has some great capabilities such as viewing the console of your iPhone on the computer, allowing you to debug without setting up an nginx tunnel. 

So between privacy concerns and just better usability as an engineer. Here i am. 

Right now this just works for firefox. 

Note: I use both Firefox Developer Edition & Safari Technology Preview. 

## How to use
Go ahead and run 
`npm install`
after you clone the package. 

Afterwards, make sure that any instance of chrome is closed and that the app is completely inactive. Force quit if necessary. 

Then run `node index.js`.

Chrome will open and the program will fetch a list of your extensions. Then it will open firefox and begin installing each one. This requires user action. So the firefox browser will prompt you after a couple of seconds to "Add Addon" when a comparable addon is found in the firefox library. 

With some add-on's after you click "Add Addon" a second tab will open up to enter in your password information / user account etc (e.g. LastPass and other password managers)

When this happens go back to the original tab, as you'll need to continue adding the extensions and can fill in those details after all the extensions have been done. 
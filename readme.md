# What is this 
This program will migrate all your chrome extensions to firefox so that your lazy ass doesn't have any more excuses to stop using an inferior, personal-data-snooping, RAM-reaping, privacy butchering, product. 

## How to use
Go ahead and run 
`npm install`
after you clone the package. 

Afterwards, make sure that any instance of chrome is closed and that the app is completely inactive. Force quit if necessary. 

Run `npm run migration`

Chrome will open and the program will fetch a list of your extensions. Then it will open firefox and begin installing each one. This requires user action. So the firefox browser will prompt you after a couple of seconds to "Add Addon" when a comparable addon is found in the firefox library. 

With some add-on's after you click "Add Addon" a second tab will open up to enter in your password information / user account etc (e.g. LastPass and other password managers) when this happens go back to the original tab, as you'll need to continue adding the extensions and can fill in those details after all the extensions have been done. 

After you've completed the migration MAKE SURE you create/sign-in to a firefox profile (gone are the days where extensions belong to browsers directly).

## Troubleshooting

If you find that you're having an issue with your profile on chrome, try providing a custom path to your chrome profile. I've provided one by default but yours may be located in a different place. Particularly if you use Linux or Windows computers.  

`npm run migration path`

## Why is this
I made this because I was annoyed that I still hadn't switched over from chrome to firefox or safari. In addition to the blatent privacy problems that chrome continues to exhibit - I've found that firefox has a better development environment for engineers - safari also has some great capabilities such as viewing the console of your iPhone on the computer, allowing you to debug without setting up an nginx tunnel. 

So between privacy concerns and just better usability as an engineer. Here i am. 

Update:
Welp - 
I didn't realize when I started this that Safari now forces you to use their App Store native application to download safari extensions.... that throws a little kink in the chain in terms of doing this via selenium but will try and figure that out in the future. For now Firefox is more than sufficient.  

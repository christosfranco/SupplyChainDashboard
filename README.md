## 1: Install Node.js (LTS version)
- https://nodejs.org/en/download
  * You can try if installation was successful (in terminal: node -v)
  * My version is: `v18.16.0`

## 2: Install npm
- (I already had one - so I just updated it from the version 9.5.1 to the latest version 9.6.4)
- for update (MAC) I used: `sudo npm install -g npm@latest` (from root directory)
- to check version (in terminal: `npm -v`)
- My version is: `v9.6.4`

## 3: Install Angular
- `sudo npm install -g @angular/cli`
- `sudo npm install typescript -g`
- Angular CLI version (`15.2.7`) -> check with command `$ng version`

## 4. Install Webstorm 
- (free with students licence - you need to log-in) 
- https://www.jetbrains.com/webstorm/

## 5. Import project from Version-control (VCS)
- use github link of this project
- select your destination folder (where you will have project located)
- It has to be called  `..Supply_Chain/`!

## 6. In Webstorm's terminal 
 - cd into Supply_Chain and run `npm install` and `sudo npm link`
 
## 7. Serve project!
- run `ng serve` 
- *[Optional] go to browser and open http://localhost:4200*

## 8. Open new terminal in Webstorm
- cd into project once again
- run `npm install electron --save-dev`
- start the electron app by running command `npm run electron`

# Update
## To serve project:
### If you are doing it for the first time than you need to run `npm install express`
## Otherwise run just: `node express_server/server.js`
## Open new terminal and run also `npm start`
Happy coding



### !Remember to always have one terminal to run: `ng serve` otherwise `npm run electron` will not work. 

#### I have helped with: `https://www.logicflow.ai/blog/angular-desktop-applications-with-electron`


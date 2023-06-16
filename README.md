## Instructions to run the program from IDE (WebStorm)

### 1: Install Node.js (LTS version)
- https://nodejs.org/en/download

### 2: Install npm

### 3: Install Angular
- `sudo npm install -g @angular/cli`
- `sudo npm install typescript -g`
- We used: Angular CLI version (`15.2.7`) -> check with command `$ng version`

### 4. Install Webstorm
- https://www.jetbrains.com/webstorm/ (free for Students)

### 5. Import project from Version-control (VCS)
- use github link of this project
- select your destination folder (where you will have project located)
- The folder has to be called  `Supply_Chain`!

### 6. In Webstorm's terminal
- all remaining steps should be done from the root folder of the project (in terminal)
- cd into Supply_Chain and run `npm install` and `sudo npm link`

### 7. Finally start the project
- run `ng serve`
- in new terminal run: `node express_server/server.js`

# Volcano-Library-Website-client&server
A project offered from my university (CAB230- Assignments)

Description: In this project i have created a Web User Interface (React) for a Volcano Library and also its' Rest APIs (Express.Js).   

# Installation guides:

1. Install the repo into your local machine

```bash
git clone https://github.com/jtsdaniel/Volcano-Library-Website-client-server.git
```
2. Install MySQL workbench - [follow this guide](https://www.simplilearn.com/tutorials/mysql-tutorial/mysql-workbench-installation). Remember your root password cause we gonna need it to edit knexfile and create connection between application and database.

3. Setup new connection on MySQL workbench then open database "Dump.sql" - you can find it in this path ".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/expvolcano/dump.sql"

Note: for connection parameter use HostName: 127.0.0.1, Port: 3306 and Username: root (standard)

![example](https://github.com/jtsdaniel/Volcano-Library-Website-client-server/blob/master/Client%20Side/Volcano%20Web%20App%20-%20Client%20Side/public/img/Capture.PNG?raw=true)

## Client Side installation

4. Follow this path: ".../Volcano-Library-Website-client-server/Client Side/Volcano Web App - Client Side/" then in your machine's terminal enter "npm install" - [learn more](https://docs.npmjs.com/cli/v6/commands/npm-install)

```bash
npm install
```
## Server Side installation

4. Follow this path: ".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/expvolcano/" then in your machine's terminal enter "npm install" 

```bash
npm install
```

## Install Test Plans for the website (Optional) - this test plans reference to [QUT teaching team](https://github.com/chadggay/volcanoapi-tests/)

5. Follow this path: ".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/volcanoapi-tests/" then in your machine's terminal enter "npm install" 

```bash
npm install
```

# User guides:
1. To run the whole application you must create connection to database as mentioned in "Installation Guide". One mention is you need to change some paramters in knex form to lets the application connect to database. the knex-form can be found in this path:".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/expvolcano/knexfile.js".

![knexfile](https://github.com/jtsdaniel/Volcano-Library-Website-client-server/blob/master/Client%20Side/Volcano%20Web%20App%20-%20Client%20Side/public/img/knexfile.PNG?raw=true)

As you can see the paramaters are similar to the previous paramters we enter when creating new connection in MySQL workbench. Make sure to change "Password" to your root password created during your "MySQL workbench" installation process.

2. Head into this follow path:".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/expvolcano/" in your terminal run command

```bash
npm start
```
You can now see the server (Rest APIs) is running on http://localhost:3000/ 
![server_demo](https://github.com/jtsdaniel/Volcano-Library-Website-client-server/blob/master/Client%20Side/Volcano%20Web%20App%20-%20Client%20Side/public/img/server_demo.PNG?raw=true)

3. Then go to path:".../Volcano-Library-Website-client-server/Client Side/Volcano Web App - Client Side/" in your terminal run command

```bash
npm start
```
You can now see the client side - website is running on http://localhost:3006/ 
![client_demo](https://github.com/jtsdaniel/Volcano-Library-Website-client-server/blob/master/Client%20Side/Volcano%20Web%20App%20-%20Client%20Side/public/img/client_demo.PNG?raw=true)


4. (Optional) if you want to test the server Rest APIs, head into path:".../Volcano-Library-Website-client-server/Server Side/volcanoweb_server_side/volcanoapi-tests/" in your terminal run command

```bash
npm test
```
p.s: For more details of client side or server side please have a look on the reports inside relevant named folders

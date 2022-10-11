# MasterServer
> Master server for the Blog using basic node concepts

## Steps:-
* Download .zip
* cd MasterServer
* Login to your mongoDB Atlas or local mongoDB compass account and create a "blogPost" cluster.
*  import collection to your cluster from Database folder in the MasterServer folder.
* touch .env (create envoirment file)
* insert mongoDb connection url as follow
```
 MONGOURI= mongodb://<connection url>
```
* run _"npm install"_  in terminal.
* run _"npm start"_ in terminal to run in production mode.
* run _"npm run dev"_ in terminal to run in development mode.

Server will start on localhost:5000 by default ,port can be changes from server.js
*************************

**Now you are all ready to use APi**

-------------------

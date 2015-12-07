#Node Project Starter
##Please replace the contents of the public directory with the front-end project starter.

#To start this application
##cd into the webroot and type the following comands:
	sudo su #only if you are on the server
	npm install #install Node application dedpendencies
	mkdir data && mkdir data/db && mkdir log #create data/db and log directories for MongoDB
	chmod 777 log -R && chmod 777 data -R #make directories writeable for MongoDB
	mongod --fork --logpath ./log/mongodb.log --dbpath data/db --smallfiles #start MongoDB as a Daemon
	sudo forever start bin/www #start Node application as a Daemon
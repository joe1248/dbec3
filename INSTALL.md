Remove any existing containers:
docker container rm $(docker container ls --all -q) && docker container ls --all


BUILD ALL: App + db + tools
docker-compose up -d --build

# Get inside the apache server
winpty docker run -ti --rm my_dbec3_image bash
# Get inside the MariaDB server


#JUST Build an image
cd dbec_docker/dbec3
docker build -t my_dbec3_image .


Launch on localhost
docker run -d -p80:80 --rm --name my_running_container_dbec3 my_dbec3_image





Log into Database server
winpty docker exec -it dbec3_dbec_db_1 bash
mysql -p
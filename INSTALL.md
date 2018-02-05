Remove any existing containers:
docker container stop $(docker container ls --all -q) && docker container ls --all
docker container rm $(docker container ls --all -q) && docker container ls --all


BUILD ALL: App + db + tools
docker-compose up -d --build

==> it creates : 
 
 dbec3_my_dbec_database_server_1
 dbec3_my_dbec_web_server_1          
 




# Get inside the apache server 
winpty docker exec -ti dbec3_my_dbec_web_server_1 bash
winpty docker exec -ti dbec3_my_dbec_database_server_1 bash


#JUST Build an image
cd dbec_docker/dbec3
docker build -t my_dbec3_image .


Launch on localhost
docker run -d -p80:80 --rm --name my_running_container_dbec3 my_dbec3_image





Log into Database server
winpty docker exec -it dbec3_dbec_db_1 bash
mysql -p


Add or drop container capabilities. See man 7 capabilities for a full list.
cap_add:
  - ALL

cap_drop:
  - NET_ADMIN
  - SYS_ADMIN
  
  
for DB configs:
    configs:
      - my_config
      - my_other_config
configs:
  my_config:
    file: ./my_config.txt
  my_other_config:
    external: true
    
    
    
# netstat -tlnp
# telnet localhost 3306
#  TODO : install locate comand cos it is practical!


DB:
/etc/mysql/my.cnf
apt-get update && apt-get install vim -y
REtart may be auto upon changes ? /etc/init.d/mysql restart
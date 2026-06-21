printf "### TEST CONNESSIONE ###\n\n"

ping_count=2

## NO CONNECTION: 2>&1 | grep bad address
## CONNECTION: 2>&1 | grep transmitted

printf "\n############################\n"
printf "###      DA GATEWAY     ####\n"
printf "############################"

printf "\n### GATEWAY -> POSTGRESS ###\n"
docker exec sio-gateway ping db -c $ping_count 2>&1 | grep transmitted

printf "\n### GATEWAY -> BACKEND ###\n"
docker exec sio-gateway ping backend -c $ping_count 2>&1 | grep transmitted

printf "\n### GATEWAY -> FE-PROD ###\n"
docker exec sio-gateway ping fe-prod -c $ping_count 2>&1 | grep transmitted

printf "\n### GATEWAY -> FE-TEST ###\n"
docker exec sio-gateway ping fe-test -c $ping_count 2>&1 | grep transmitted

printf "\n### GATEWAY -> FE-SVI ###\n"
docker exec sio-gateway ping fe-sio -c $ping_count 2>&1 | grep transmitted

printf "\n--------------------------------------------\n"
printf "\n############################\n"
printf "###      DA BACKEND     ####\n"
printf "############################"
printf "\n### BACKEND -> POSTGRESS ###\n"
docker exec sio-backend ping db -c $ping_count 2>&1 | grep transmitted

printf "\n--------------------------------------------\n"
printf "\n############################\n"
printf "###        DA FE        ####\n"
printf "############################\n"
printf "\n### FE-PROD -> BACKEND ###\n"
docker exec sio-fe-prod ping backend -c $ping_count 2>&1 | grep bad

printf "\n### FE-TEST -> BACKEND ###\n"
docker exec sio-fe-test ping backend -c $ping_count 2>&1 | grep bad

printf "\n### FE-SVI -> BACKEND ###\n"
docker exec sio-fe-sio ping backend -c $ping_count 2>&1 | grep bad

printf "\n--------------------------------------------\n"

printf "\n### FE-PROD -> POSTGRESS ###\n"
docker exec sio-fe-prod ping db -c $ping_count 2>&1 | grep bad

printf "\n### FE-TEST -> POSTGRESS ###\n"
docker exec sio-fe-test ping db -c $ping_count 2>&1 | grep bad

printf "\n### FE-SVI -> POSTGRESS ###\n"
docker exec sio-fe-sio ping db -c $ping_count 2>&1 | grep bad

docker-compose stop db
docker-compose rm -f db
docker-compose up -d db
sleep 15
docker-compose exec -t web #command to migrate using prisma
docker-compose exec -t web #command to add seed data using prisma
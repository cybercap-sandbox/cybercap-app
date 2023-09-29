docker-compose stop db
docker-compose rm -f db
docker-compose up -d db
sleep 15
docker-compose rm -f web #remove web container to force rebuild
docker-compose build --parallel #rebuild web container
docker-compose exec -t web npx prisma db push #command to migrate using prisma
docker-compose exec -t web npx prisma db seed #command to add seed data using prisma

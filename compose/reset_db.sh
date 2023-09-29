docker-compose stop db
docker-compose stop web
docker-compose rm -f db 
docker-compose rm -f web #remove web container to force rebuild
docker-compose build --parallel #rebuild web container
docker-compose up -d
sleep 15
docker-compose exec -t web npx prisma db push #command to migrate using prisma
docker-compose exec -t web npx prisma db seed #command to add seed data using prisma

## Setup

1. Make sure the ports 3000 and 27017 are available, you'll need them;
2. Download the tar and extract `dump` folder into `/tmp`;
3. Make sure you have an S3 Bucket and Read/Write access keys to this bucket;
4. Create `.env` file. Follow `.env.sample` to know which variables are required;
5. Start the services: `docker-compose up -d`;
6. Put data into DB: `mongorestore /tmp/dump --drop`;
7. Verify system is up with `http:localhost:3000`.
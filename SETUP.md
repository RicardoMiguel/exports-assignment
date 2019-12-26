## Setup

1. Make sure the ports 3000 and 27017 are available, you'll need them;
2. Download the tar and extract `dump` folder into `/tmp`;
3. Make sure you have an S3 Bucket and Read/Write access keys to this bucket;
4. Create `.env` file. Follow `.env.sample` to know which variables are required;
5. Start the services: `docker-compose up -d`;
6. Put data into DB: `mongorestore /tmp/dump --drop`;
7. Verify system is up with `http:localhost:3000`.

## Rest API
### Get an Export Job Result;
`GET /export/:ID` 
```
{
  "_id": "ID",
  "startDate": "DATE",
  "endDate": "DATE",
  "state": "NOT_STARTED | STARTED | FINISHED",
  "exportUri": "STRING"
}
```

### Create an Export Job
```
POST /export
{ 
    "startDate": "STRING (2018-11-30)",
    "endDate": "STRING (2018-12-01)"
}
```

```
status: 202
Location: JOB_URI
```
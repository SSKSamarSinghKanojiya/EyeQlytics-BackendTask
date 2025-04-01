## Description

To be specified.

## Installation

```bash
# install dependencies
$ npm install
```

## Run the server in docker container

````bash
# development
$ npm run dev
$ npm run dev:stop # To shut down containers

## Run the server in local machine

```bash
# development
$ npm start:dev


## API Documentation

```bash
# development
http://localhost:{PORT}/api-spec

# production
{API_URL}/api-spec
````

# Docker Setup

To connect MongoDB while running inside a Docker container, use the following environment variable:

```bash
MONGO_URI=mongodb://db:27017/EyeQlytics

```

# MongoDB Connection URL (For Local Setup)

If you are connecting MongoDB outside Docker (locally), use the following:

```bash

MONGO_URI=mongodb://localhost:27017/EyeQlytics

```

# Additional

# Environment Variables (.env Setup)

Create a .env file and add the following configurations:

```bash
# MongoDB Connection inside Docker
MONGO_URI=mongodb://db:27017/EyeQlytics

# MongoDB Connection for Local Setup
MONGO_URI=mongodb://localhost:27017/EyeQlytics

```

## Clipboard assignment 


## Requirements

* Node 


## Common setup

Clone the repo and install the dependencies.

```bash
git clone 
cd the-example-app.nodejs
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
nodemon index.js
```

To start the test, run the following

```bash
node test
```


## Use Docker
You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/contentful/the-example-app.nodejs.git
```

Step 2: Build the Docker image

```bash
docker build -t the-example-app.nodejs .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 3000:3000 -d the-example-app.nodejs
```

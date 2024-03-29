# :loudspeaker: Shoutout Tool :sparkles:

A tool to collect feedback for subgroups of a group.

## Setup

Create `.env` based on `example.env` and fill in the required values.

#### Connecting to cloud.mongodb.com

````bash
mongosh "mongodb+srv://<cluster_URL>/db" --apiVersion 1 --username <username>
````

Install and start MongoDB following [these](https://www.mongodb.com/docs/manual/administration/install-community/) instructions.

### Run locally

```bash
npm install
npm start
```

### Run in Docker

```bash
docker build -t shoutout-tool .
docker run -p 3000:3000 --rm -it --env-file .env shoutout-tool
```

## Usage
`localhost:3000`
- go to `/create` to create a new session
- your session is then open at `/<session-id>`
- results can be viewed at `/<session-id>/results`

# Subgroup visualization

Experimental. Live [here](https://digitalservicebund.github.io/shoutout-tool/subgroups-visualization.html).

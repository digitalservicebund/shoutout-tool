# :loudspeaker: Shoutout tool :sparkles:

A tool to collect feedback for subgroups of a group.

## Setup

### config.json

````json
{
    "MONGODB_URI": ""
}
````

Install and start MongoDB following [these](https://www.mongodb.com/docs/manual/administration/install-community/) instructions.
```
npm install
npm start
```

## Usage
`localhost:3000`
- go to `/create` to create a new session
- your session is then open at `/<session-id>`
- results can be viewed at `/<session-id>/results`

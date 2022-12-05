const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const MongoClient = require('mongodb').MongoClient;
const dbClient = new MongoClient('mongodb://localhost:27017');

const utils = require('./src/utils.js');
const Session = require('./src/Session.js');
let activeSessions = {};

let sessionsDb;
let submissionsDb;
let guestsDb;
let reactionsDb;

dbClient.connect().then(() => {
  const db = dbClient.db('db');
  sessionsDb = db.collection('sessions');
  submissionsDb = db.collection('submissions');
  guestsDb = db.collection('guests');
  reactionsDb = db.collection('reactions');
  sessionsDb.find().toArray().then(sessions => {
    for (let sessionData of sessions) {
      activeSessions[sessionData.id] = new Session(sessionData, submissionsDb);
      console.log("imported session " + sessionData.id + " from db");
    }
    submissionsDb.find().toArray().then(submissions => {
      for (let submission of submissions) {
        activeSessions[submission.sessionId].submissions.push(submission);
      }
      reactionsDb.find().toArray().then(reactions => {
        for (let reaction of reactions) {
          activeSessions[reaction.sessionId].addReactionToSubmission(reaction.submissionId);
        }
      });
    });
    guestsDb.find().toArray().then(guests => {
      for (let guest of guests) {
        activeSessions[guest.sessionId].addGuest(guest);
      }
    });
  });
});

const libs = {
  'jquery.js': '/node_modules/jquery/dist/jquery.min.js',
  'notie.js': '/node_modules/notie/dist/notie.min.js',
  'main.js': '/src/main.js',
  'notie.css': '/node_modules/notie/dist/notie.css',
  'main.css': '/src/main.css'
};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/html/index.html');
});

app.get('/:var', function(req, res) {
  switch(req.params.var) {
    case 'create':
      res.sendFile(__dirname + '/src/html/create.html');
      break;
    case 'dashboard':
      res.sendFile(__dirname + '/src/html/dashboard.html');
      break;
    default:
      if (activeSessions[utils.formatNameAsId(req.params.var)])
        res.sendFile(__dirname + '/src/html/session.html');
      else
        res.sendFile(__dirname + '/src/html/no-session.html');
  }
});

app.get('/:var/results', function(req, res) {
  if (activeSessions[utils.formatNameAsId(req.params.var)])
    res.sendFile(__dirname + '/src/html/results.html');
  else
    res.sendFile(__dirname + '/src/html/no-session.html');
});

app.get('*/lib/:lib', function(req, res) {
  res.sendFile(__dirname + libs[req.params.lib]);
});

io.on('connection', function(socket) {
  // console.log('user connected: ' + socket.id);

  socket.on('create-session', function(sessionData) {
    sessionData.id = utils.formatNameAsId(sessionData.name);
    if (activeSessions[sessionData.id])
      socket.emit('err', 'a session with the id ' + sessionData.id + ' already exists');
    else {
      activeSessions[sessionData.id] = new Session(sessionData);
      sessionsDb.insertOne(sessionData);
      console.log("created session and stored in db: " + sessionData.id);
      socket.emit('success', 'new session has been created: <b><a href="/' + sessionData.id + '">' + sessionData.id + '</a></b>');
    }
  });

  socket.on('session-login', function(sessionId) {
    let session = activeSessions[sessionId];
    if (session) {
      socket.emit('info', 'welcome to session <b>' + sessionId + '</b>'); //, your id is ' + socket.id);
      socket.emit('session-login-response', {
        data: session.data,
        submissions: session.submissions,
        guests: session.guests
      });
    }
    else
      socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
  });

  socket.on('new-submission', function(submissionData) {
    let session = activeSessions[submissionData.sessionId];
    submissionData.id = session.submissions.length;
    session.handleSubmission(submissionData);
    submissionsDb.insertOne(submissionData).then(() => console.log('submission stored in db'));
    io.emit('broadcast-new-submission', submissionData);
  });

  socket.on('add-guest', function(guest) {
    let session = activeSessions[guest.sessionId];
    guest.id = Object.keys(session.data.entities).length + session.guests.length;
    session.addGuest(guest);
    guestsDb.insertOne(guest).then(() => console.log('guest stored in db'));
    io.emit('broadcast-new-guest', guest);
  });

  socket.on('reaction-added', function(reactionData) {
    activeSessions[reactionData.sessionId].addReactionToSubmission(reactionData.submissionId);
    reactionsDb.insertOne(reactionData).then(() => console.log('reaction stored in db'));
    io.emit('broadcast-reaction-added', reactionData);
  });

  socket.on('command', function(command) {
    switch (command) {
      case 'disable':
        io.emit('disable-session');
        break;
      case 'enable':
        io.emit('enable-session');
        break;
    }
  });

  socket.on('login-results', function(sessionId) {
    let session = activeSessions[sessionId];
    if (session) {
      socket.emit('info', 'results for session <b>' + sessionId + '</b>'); //, your id is ' + socket.id);
      socket.emit('login-results-response', {
        data: session.data,
        submissions: session.submissions,
        guests: session.guests
      });
    }
    else
      console.log("no session exists with the id " + sessionId);
  })

  socket.on('get-dashboard-data', function() {
    let sessionIds = Object.values(activeSessions).map(session => session.data.id);
    socket.emit('receive-dashboard-data', sessionIds);
  })

  socket.on('delete-session', function(sessionId) {
    // TODO
  })

  socket.on('disconnect', function() {
    // console.log('user disconnected: ' + socket.id);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

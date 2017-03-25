'use strict'

var Config 	= require('./config')
var wit 	= require('./services/wit').getWit()
var FB 		= require('./connectors/facebook')
// LETS SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var read = function (sender, message, reply) {
	if (message === 'hello') {
		// Let's reply back hello
		message = 'Hello yourself! I am a chat bot. You can say "show me pics of corgis"'
		reply(sender, message)
	} else {
		// Let's find the user
		FB.getUserProfile(entry.sender.id, function (err, resp, data) {
			console.log(err, resp, data)
      		if(!err) {
        		var sessionId = findOrCreateSession(sender)
				// Let's forward the message to the Wit.ai bot engine
				// This will run all actions until there are no more actions left to do
				wit.runActions(
					sessionId, // the user's current session by id
					message,  // the user's message
					sessions[sessionId].context
				)
      		} else {
        		console.err(err, data);
      		}
  		})
		
	}
}



module.exports = {
	findOrCreateSession: findOrCreateSession,
	read: read,
}
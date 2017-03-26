const request = require('request');

var Wit = ({apiVersion = '20160526', actions, logger, accessToken}) => {

  if (!accessToken) {
    throw new Error('empty WIT accessToken');
  }

  const newRequest = request.defaults({
    uri: "https://api.wit.ai/converse",
    method: "POST",
    json: true,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Accept': 'application/vnd.wit.'+ apiVersion + '+json'
    }
  });

  const callback = (sessionId, context = {}) => (err, response, body) => {
    if (err) return Promise.reject()
    if (body) {
      
      console.log(sessionId, body.entities && body.entities.intent || ''); //, context, body);
      
      const request = {sessionId, context};
      const response = {sessionId, context, text: body.msg, quickreplies: body.quickreplies, entities: body.entities, confidence: body.confidence};

      if (body.type === 'action') {
        if(!actions[ body.action ]) {
          throw new Error('not found: ' + body.action);
        } else {

          return actions[ body.action ](response).then(context => {
            newRequest({
              qs: {
                context,
                v: apiVersion,
                session_id: sessionId,
                q: "",
              },
              body: context
            }, callback(sessionId, context));
          });
        }
      } else if (body.type === 'msg') {
        if (!actions.send) {
          throw new Error('not found: `send`');
        } else {
          return actions.send(request, response).then(context => {
            newRequest({
              qs: {
                context,
                v: apiVersion,
                session_id: sessionId,
                q: ""
              },
              body: context
            }, callback(sessionId, context));
          }).catch(err => console.error(err));
        }
      } else if (body.type === 'stop') {
        if (!actions.stop) {
          throw new Error('not found: `stop`');
        }
        return actions.stop(response);
      }
    }
  };
  const runActions = (sessionId, message, context) => {
    newRequest({
      qs: {
        v: apiVersion,
        session_id: sessionId,
        q: message
      },
      body: context
    }, callback(sessionId, context));
  };
  return {
    runActions,
    interactive: () => {}
  };
};

module.exports = Wit;
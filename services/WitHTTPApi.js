const request = require('request');

var Wit = ({apiVersion, actions, logger, accessToken}) => {

  if (!accessToken) {
    throw new Error('empty WIT accessToken');
  }

  const callback = (sessionId) => (err, response, body) => {
    if (err) return Promise.reject()
    if (body) {
      console.log(body);
      if (body.type === 'action') {
        if(!actions[ body.action ]) {
          throw new Error('not found: ' + body.action);
        } else {
          return actions[ body.action ](body).then(context => {
            request.post({
              uri: "https://api.wit.ai/converse",
              qs: {
                v: apiVersion,
                session_id: sessionId,
                q: ""
              },
              form: context
            }, callback(sessionId));
          });
        }
      } else if (body.type === 'msg') {
        if (!actions.send) {
          throw new Error('not found: `send`');
        } else {
          return actions.send.then(context => {
            request.post({
              uri: "https://api.wit.ai/converse",
              qs: {
                v: apiVersion,
                session_id: sessionId,
                q: ""
              },
              form: context
            }, callback(sessionId));
          }).catch(err => console.error(err));
        }
      } else if (body.type === 'stop') {
        if (!actions.stop) {
          throw new Error('not found: `stop`');
        }
        return actions.stop;
      }
    }
  };
  const runActions = (sessionId, message, context) => {
    request.post({
      uri: "https://api.wit.ai/converse",
      qs: {
        v: apiVersion,
        session_id: sessionId,
        q: message
      },
      form: context
    }, callback(sessionId));
  };
  return {
    runActions,
    interactive: () => {}
  };
};

module.exports = Wit;
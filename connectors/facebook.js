'use strict'

var request = require('request')
var Config = require('../config')

// SETUP A REQUEST TO FACEBOOK SERVER
var newRequest = request.defaults({
	uri: 'https://graph.facebook.com/v2.6/me/messages',
	method: 'POST',
	json: true,
	qs: {
		access_token: Config.PAGE_ACCESS_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	}
})

var getUserProfile = (userId, callback) => request.get({
	uri: "https://graph.facebook.com/v2.6/" + userId,
	method: 'GET',
	json: true,
	qs: {
		fields: 'first_name,last_name,gender',
		access_token: Config.PAGE_ACCESS_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	}
}, callback)

// SETUP A MESSAGE FOR THE FACEBOOK REQUEST
var createMessage = function (recipientId, message, cb) {
	// https://developers.FACEBOOKbook.com/docs/messenger-platform/send-api-reference

	// FOR IMAGES
	// "message":{
	//    "attachment":{
	//      "type":"image",
	//      "payload":{
	//        "url":"https://petersapparel.com/img/shirt.png"
	//      }
	//    }
	//  }

	// FOR TEMPLATES
	// "message":{
	//   "attachment":{
	//     "type":"template",
	//     "payload":{
	//       "template_type":"button",
	//       "text":"What do you want to do next?",
	//       "buttons":[
	//         {
	//           "type":"web_url",
	//           "url":"https://petersapparel.parseapp.com",
	//           "title":"Show Website"
	//         },
	//         {
	//           "type":"postback",
	//           "title":"Start Chatting",
	//           "payload":"USER_DEFINED_PAYLOAD"
	//         }
	//       ]
	//     }
	//   }
	// }

	// if (atts) {
	// 	var message = {
	// 		attachment: {
	// 			"type": "image",
	// 			"payload": {
	// 				"url": msg
	// 			}
	// 		}
	// 	}
	// } else {
	// 	var message = {
	// 		text: msg
	// 	}
	// }

	newRequest(
		{
			form: {
				message,
				recipient: {
					id: recipientId
				},
			}
		},
		function (err, resp, data) {
			if (cb) {
				cb(err || data.error && data.error.message, data)
			}
		}
	);
}

var newMessage = (id, msg, cb) => {
	return createMessage(id, {text: msg}, cb);
}

var newImage = (id, url, cb) => {
	return createMessage(id,
	{
		attachment: {
			"type": "image",
			"payload": {
				"url": msg
			}
		}
	}, cb);
}

var newQuickReply = (id, msg, replies, cb) => {
	return createMessage(id,
	{
		text: msg,
		quick_replies: replies.map(item => ({
			content_type: "text",
			title: item,
			payload: item
		}))
	}, cb);
}

var newButtons = (id, msg, replies, cb) => {
	return createMessage(id,
{
    attachment: {
      "type": "template",
      payload: {
        "template_type": "button",
        text: msg,
        buttons: replies.map(item => ({
            "type": "postback",
            title: item,
            payload: item
          }))
        }
      }
  }, cb);
}

var newLists = (id, msg, replies, cb) => {
	var elements = [
	{
		"title": "Classic T-Shirt Collection",
		"image_url": "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/17425116_1895095950728822_7374737738582360191_n.jpg?oh=01062fd616b5e982fe0801eefa4ae1df&oe=59589A49",
		"subtitle": "See all our colors"
	}];

	elements = elements.concat(
		replies.map(item => ({
			"title": "Classic White T-Shirt",
			"image_url": "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/17458039_1895643334007417_8023598012425899845_n.jpg?oh=7ffa8f38c3c84a9bbcc6cb341d5f245c&oe=59607DEE",
			"subtitle": "100% Cotton, 200% Comfortable",
			// "default_action": {
			// //     "type": "web_url",
			// //     "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
			// //     "messenger_extensions": true,
			// //     "webview_height_ratio": "tall",
			// //     "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
			// },
			"buttons": [
				{
				  "type": "postback",
				  title: item,
				  payload: item,
				  messenger_extensions: true,
				  "webview_height_ratio": "tall",
				}
			]
		}))
	)

	return createMessage(id,
		{
		  attachment: {
		      "type": "template",
		      payload: {
		          "template_type": "list",
		          elements: elements
		          //  "buttons": [
		          //     {
		          //         "title": "View More",
		          //         "type": "postback",
		          //         "payload": "payload"
		          //     }
		          // ]
		      }
		  }
		}, cb);
}

var newCarousels = (id, msg, replies, cb) => {
  var elements = [];

  elements = elements.concat(
		)
	return createMessage(id,
  {
    "attachment":{
      "type":"template",
      payload: {
        "template_type":"generic",
        elements: replies.map(item => ({
          "title":"Welcome to Peter\'s Hats",
          "image_url":"https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/17458039_1895643334007417_8023598012425899845_n.jpg?oh=7ffa8f38c3c84a9bbcc6cb341d5f245c&oe=59607DEE",
          "subtitle":"We\'ve got the right hat for everyone.",
          // "default_action": {
          //   "type": "web_url",
          //   "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
          //   "messenger_extensions": true,
          //   "webview_height_ratio": "tall",
          //   "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
          // },
          "buttons":[
            {
              "type": "postback",
              title: item,
              payload: item
            }
          ]
        }))
      }
    }
  }, cb);
}

// PARSE A FACEBOOK MESSAGE to get user, message body, or attachment
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
var getMessageEntry = function (body) {
	var val = body.object === 'page' &&
						body.entry &&
						Array.isArray(body.entry) &&
						body.entry.length > 0 &&
						body.entry[0] &&
						body.entry[0].messaging &&
						Array.isArray(body.entry[0].messaging) &&
						body.entry[0].messaging.length > 0 &&
						body.entry[0].messaging[0]
	return val || null
}

module.exports = {
	newRequest,
	newMessage,
	newImage,
	newQuickReply,
	newButtons,
	newLists,
  	newCarousels,
	getMessageEntry,
	getUserProfile
}

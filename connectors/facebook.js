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
	},
})

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
	newRequest: newRequest,
	newMessage: newMessage,
	newImage: newImage,
	newQuickReply: newQuickReply,
	getMessageEntry: getMessageEntry
}
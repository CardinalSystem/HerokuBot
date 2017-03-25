'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var request = require('request')


var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


var actions = {
	send(request, response) {
		return new Promise(function(resolve, reject) {
			var id = request.context._fbid_;
        	console.log(JSON.stringify(response),JSON.stringify(request));

      if (response.buttons) {
				FB.newButtons(id, response.text, response.buttons)
			} else if (response.quickreplies) {
				FB.newQuickReply(id, response.text, response.quickreplies)
			} else if (response.text) {
	        	if (checkURL(response.text)) {
					FB.newImage(id, response.text)
				} else {
					FB.newMessage(id, response.text)
				}
			}
        	return resolve();

      })
	},
	say ({sessionId, context, message}) {
		// Bot testing mode, run cb() and return

		console.log('SAY WANTS TO TALK TO:', context)
		console.log('SAY HAS SOMETHING TO SAY:', message)

		if (checkURL(message)) {
			FB.newImage(context._fbid_, message)
		} else {
			FB.newMessage(context._fbid_, message)
		}


		return Promise.resolve(context)

	},

	merge({sessionId, context, entities, message}) {
		// Reset variables
		// delete context.suffix
		// delete context.name
		// Retrive name
		// var name = firstEntityValue(entities, 'name')
		// if (name) {
		// 	context.name = name
		// }
		console.log('call merge')
		var new_context = {}


		// var ord_type = firstEntityValue(entities, 'order_type')
		// if (ord_type == 'product') {
		// 	context.product = ord_type
		// 	delete context.printing
		// 	delete context.ask
		// }
		// else if (ord_type == 'printing') {
		// 	context.printing = ord_type
		// 	delete context.product
		// 	delete context.ask
		// }
		// else
		// {
		// 	context.ask = ord_type
		// 	delete context.product
		// 	delete context.printing
		// }

		var name = firstEntityValue(entities, 'name')
		if (name) {
			new_context.name = name
		}

		var sex = firstEntityValue(entities, 'sex')
		if (sex) {
			new_context.sex = sex
		}
		// Reset the cutepics story

		return Promise.resolve(context);
	},

	error({sessionId, context}) {
		console.log(error.message)
	},

	// list of functions Wit.ai can execute


	sayHello({sessionId, context}) {

		if (context.sex == 'male') {
			context.suffix = 'ครับ'
		}
		else
		{
			context.suffix = 'ค่ะ'
		}

		context.name = 'อาม'

		return Promise.resolve(context)

	}

}

// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit({accessToken: Config.WIT_TOKEN, actions, apiVersion: "20170325"})
}

module.exports = {
	getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
}

// GET WEATHER FROM API
var getWeather = function (location) {
	return new Promise(function (resolve, reject) {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var jsonData = JSON.parse(body)
		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
		      return forecast
		    }
			})
	})
}

// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// LIST OF ALL PICS
var allPics = {
  corgis: [
    'http://i.imgur.com/uYyICl0.jpeg',
    'http://i.imgur.com/useIJl6.jpeg',
    'http://i.imgur.com/LD242xr.jpeg',
    'http://i.imgur.com/Q7vn2vS.jpeg',
    'http://i.imgur.com/ZTmF9jm.jpeg',
    'http://i.imgur.com/jJlWH6x.jpeg',
		'http://i.imgur.com/ZYUakqg.jpeg',
		'http://i.imgur.com/RxoU9o9.jpeg',
  ],
  racoons: [
    'http://i.imgur.com/zCC3npm.jpeg',
    'http://i.imgur.com/OvxavBY.jpeg',
    'http://i.imgur.com/Z6oAGRu.jpeg',
		'http://i.imgur.com/uAlg8Hl.jpeg',
		'http://i.imgur.com/q0O0xYm.jpeg',
		'http://i.imgur.com/BrhxR5a.jpeg',
		'http://i.imgur.com/05hlAWU.jpeg',
		'http://i.imgur.com/HAeMnSq.jpeg',
  ],
  default: [
    'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
  ],
};

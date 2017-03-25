'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var {Wit, log} = require('node-wit')
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
        	console.log('[send] [res]', JSON.stringify(response))
        	console.log('[send] [req]', JSON.stringify(request))

      		if (response.quickreplies) {
				FB.newQuickReply(id, response.text, response.quickreplies)
			// } else if (response.quickreplies) {
			// 	FB.newQuickReply(id, response.text, response.quickreplies)
			} else if (response.text) {
	        	if (checkURL(response.text)) {
					FB.newImage(id, response.text)
				} else {
					FB.newMessage(id, response.text)
				}
			}
			// clear context
			request.context.done = true;
        	return resolve();

      })
	},

	error({sessionId, context}) {
		console.log(error.message)
	},

	// list of functions Wit.ai can execute
	sayHello({sessionId, context, entities}) {
		var sex = firstEntityValue(entities, 'sex')
		if(sex == 'male' || context.suffix == 'ครับ') {
			context.suffix = 'ครับ'
		}
		else{
			context.suffix = 'ค่ะ'
		}
		return Promise.resolve(context)

	},
	sayThanks({sessionId, context, entities}) {
		var sex = firstEntityValue(entities, 'sex')
		if(sex == 'male' || context.suffix == 'ครับ'){
			context.suffix = 'ครับ'
		}
		else{
			context.suffix = 'ค่ะ'
		}
		return Promise.resolve(context)

	},
	sayBye({sessionId, context, entities}) {
		var sex = firstEntityValue(entities, 'sex')
		if(sex == 'male' || context.suffix == 'ครับ'){
			context.suffix = 'ครับ'
		}
		else {
			context.suffix = 'ค่ะ'
		}
		return Promise.resolve(context)

	},
	orderProduct({sessionId, context, entities}) {
		context.productName = 'hello'
		context.amount		= '2'
		context.price		= '100'

		return Promise.resolve(context)
	}

}

// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit({accessToken: Config.WIT_TOKEN, actions, apiVersion: "20170325",logger: new log.Logger(log.DEBUG)})

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



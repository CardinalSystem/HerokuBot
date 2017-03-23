'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAARE0ZATePjUBABC3Uf1ljWGZBZClgZBzSwl5GnxITPPxzZAzwjFXJvRr9Jgtc8KARmae240jEw8qaaxMZBvZAAO1ZBZChbOZAIzy6o5Kd4ddrBuW4Of5h7pCZAlez3fFSKbRHmDo8cGQQDfgoLOMN7RFgOnAB8EM4AthzRCT0kr2KPRwZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing PAGE_ACCESS_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN || 'this_is_my_token'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
  VERIFICATION_TOKEN: VERIFICATION_TOKEN,
}
'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAARE0ZATePjUBAKpKF50VUOEhRigZA6kVdsH6RxMV50dSg1dbmBPZCRNXOUX8PyYZCBS6d3eRirrrNnjGw781p3ggQY2lj95mpZBxiM8ldha2djriE3QDC2Mgye5aQA2Ruq7ZAwBlP9pQLalyXZCsRaZCDrZCxPyyrkBxdXjrUgaZA0gZDZD';
if (!PAGE_ACCESS_TOKEN) {
	throw new Error('Missing PAGE_ACCESS_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN || 'this_is_my_token'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
  VERIFICATION_TOKEN: VERIFICATION_TOKEN,
}
'use strict';

module.exports = {
	cookieSecret: 'towrite',
	db: 'towrite',
	host: 'localhost',
	port: 27017,
	//cookie options, write cookie with res.cookie, read cookie with req.cookies
	options: {
		cookieLong: {
			domain: '127.0.0.1',
			path: '/',
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7
		},
		cookieShort: {
			domain: '127.0.0.1',
			path: '/',
			httpOnly: true,
			maxAge: 1000 * 60
		},
		cookieMedium: {
			domain: '127.0.0.1',
			path: '/',
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24
		}
	}
}
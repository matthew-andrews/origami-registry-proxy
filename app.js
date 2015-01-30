'use strict';

var express = require('express');
require('es6-promise').polyfill();
var fetch = require('node-fetch');

var app = express();
app.use(function(req, res) {
	fetch('http://registry.origami.ft.com'+req.path)
		.then(function(response) {
			res.status(response.status);
			if (!res.ok) {
				return response.text().then(function(err) {
					res.send(err);
				});
			}
			return response.json()
				.then(function(data) {
					if (Array.isArray(data)) {
						data = data.map(function(pkg) {
							if (pkg.url) {
								pkg.url = pkg.url.replace("http://git.svc.ft.com/scm/rip/o-fonts.git", "https://github.com/Financial-Times/o-fonts.git");
							}
							return pkg;
						});
					} else if (data.url) {
						data.url = data.url.replace("http://git.svc.ft.com/scm/rip/o-fonts.git", "https://github.com/Financial-Times/o-fonts.git");
					}
					res.json(data);
				});
		})
		.catch(function(err) {
			console.log(err);
		});

});
app.listen(process.env.PORT || 5050);

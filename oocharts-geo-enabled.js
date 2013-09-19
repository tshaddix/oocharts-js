/*
 * Loads OOcharts dependencies
 * @param {Function} callback
 */
var  _load = function(callback){
	if(!_apiKey) throw "Set APIKey with oo.setAPIKey before calling load";

		// load JSAPI
		var load_jsapi = function (callback) {
			if (typeof google === 'undefined') {
				_loadScript("https://www.google.com/jsapi", callback);
			}
			else { callback(); }
		};

		// load Google Visualization
		var load_visualization = function (callback) {
			if (typeof google.visualization === 'undefined') {
				google.load("visualization", "1", { packages: ['corechart', 'table', 'geochart'], 'callback': callback });
			}
			else {
				var necpac = [];

				if (typeof google.visualization.corechart === 'undefined') {
					necpac.push('corechart');
				}

				if (typeof google.visualization.table === 'undefined') {
					necpac.push('table');
				}

                if(typeof google.visualization.geochart === 'undefined') {
                    necpac.push('geochart');
                }
                
				if (necpac.length > 0) {
					google.load("visualization", "1", { packages: necpac, 'callback': callback });
				}
			}
		};

		var cb = callback;

		load_jsapi(function () {
			load_visualization(function () {
	    		if(cb) cb();

	    		// run autobuild
	    		_autoBuild();
			});
		});
	};

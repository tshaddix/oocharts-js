var oo = (function(document){

	var _serviceEndpoint = "http://localhost:4000/v1/dynamic.jsonp";
	var _apiKey = undefined;

	var _chartColors = ['#1abc9c', '#363f48', '#2ecc71'];

	var  _load = function(callback){
		var m = this;

		var load_jsapi = function (callback) {
			if (typeof google === 'undefined') {
				m.loadScript("https://www.google.com/jsapi", callback);
			}
			else { callback(); }
		};

		var load_visualization = function (callback) {
			if (typeof google.visualization === 'undefined') {
				google.load("visualization", "1", { packages: ['corechart', 'table'], 'callback': callback });
			}
			else {
				var necpac = [];

				if (typeof google.visualization.corechart === 'undefined') {
					necpac.push('corechart');
				}

				if (typeof google.visualization.table === 'undefined') {
					necpac.push('table');
				}

				if (necpac.length > 0) {
					google.load("visualization", "1", { packages: necpac, 'callback': callback });
				}
			}
		};

		var cb = callback;

		load_jsapi(function () {
			load_visualization(function () {
	    		cb();
			});
		});
	};

	var _loadScript = function(src, callback){
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;
		s.async = false;

		s.onreadystatechange = s.onload = function () {

			var state = s.readyState;

			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback.done = true;
				callback();
			}
		};

		var c = document.getElementsByTagName('script')[0];
		c.parentNode.insertBefore(s, c);
	};

	var _setAPIKey = function(key){
		_apiKey = key;
	};

	var _formatDate = function(date){
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		var date = date.getDate().toString();

		if(month.length === 1) month = "0" + month;

		if(date.length === 1) date = "0" + date;

		return  year + '-' + month + '-' + date;
	};

	/*------------------------------------------------------------
	Query
	-------------------------------------------------------------*/

	var _Query = function(profile, startDate, endDate) {
		this.metrics = [];
		this.dimensions = [];
		this.profile = profile;

		startDate = startDate || new Date();
		endDate = endDate || new Date();

		if(startDate instanceof Date){
			startDate = _formatDate(startDate);
		}

		if(endDate instanceof Date){
			endDate = _formatDate(endDate);
		}

		var _isRelativeDate = function(val){ return /^[0-9]+(m|d|w|y)$/.test(val); };
		var _isValidDate = function(val){ return /^([0-9]{4}-[0-9]{2}-[0-9]{2})$|^[0-9]+(m|d|w|y)$/.test(val); };

		if(!_isRelativeDate(startDate) && !_isValidDate(startDate)){
			throw new Error("startDate parameter invalid" );
		}

		if(!_isRelativeDate(endDate) && !_isValidDate(endDate)){
			throw new Error("endDate parameter invalid" );
		}

		if(_isRelativeDate(startDate) && _isRelativeDate(endDate)){
			throw new Error("startDate and endDate cannot both be relative dates");
		}

		this.startDate = startDate;
		this.endDate = endDate;
	};

	_Query.prototype.addMetric = function(metric){
		this.metrics.push(metric);
	};

	_Query.prototype.addDimension = function(dimension){
		this.dimensions.push(dimension);
	};

	_Query.prototype.setFilter = function(filters){
		this.filters = filters;
	};

	_Query.prototype.setSort = function(sort){
		this.sort = sort;
	};

	_Query.prototype.setSegment = function(segment){
		this.segment = segment;
	};

	_Query.prototype.setIndex = function(index){
		this.index = index;
	};

	_Query.prototype.setMaxResults = function(maxResults){
		this.maxResults = maxResults;
	};

	_Query.prototype.execute = function(callback){
		var query = {};

		query.key = _apiKey;
		query.profile = this.profile;
		query.metrics = this.metrics.toString();
		query.start = this.startDate;
		query.end = this.endDate;

		if(this.dimensions.length > 0){
			query.dimensions = this.dimensions.toString();
		}

		if(this.filters){
			query.filters = this.filters;
		}

		if(this.sort){
			query.sort = this.sort;
		}

		if(this.index){
			query.index = this.index;
		}

		if(this.segment){
			query.segment = this.segment;
		}

		if(this.maxResults){
			query.maxResults = this.maxResults;
		}

		JSONP.get(_serviceEndpoint, query, callback);
	};

	/*------------------------------------------------------------
	Timeline
	-------------------------------------------------------------*/
	var _Timeline = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
		this.query.addDimension('ga:date');
	
		this.labels = [];
	
		this.chartOptions = {
			colors : _chartColors
		};
	};

	_Timeline.prototype.setChartOptions = function(opts){
		this.chartOptions = opts;
	};

	_Timeline.prototype.addMetric = function(metric, label){
		this.labels.push(label);
		this.query.addMetric(metric);
	};

	_Timeline.prototype.draw = function(container, fn){
		var t = this;

		this.query.execute(function (response) {

			var data = response.rows;

			//Turn analytics date strings into date
			for (var r = 0; r < data.length; r++) {
				data[r][0] = new Date(data[r][0].substring(0, 4), data[r][0].substring(5, 7), data[r][0].substring(8, 10));
			}

			var dt = new google.visualization.DataTable();

			dt.addColumn('date', 'Date');

			for (var l = 0; l < t.labels.length; l++) {
				dt.addColumn('number', t.labels[l]);
			}

			dt.addRows(data);

			var chart = new google.visualization.LineChart(document.getElementById(container));
			chart.draw(dt, t.chartOptions);

			if (typeof fn != 'undefined') {
				fn();
			}
		});
	};


	/*------------------------------------------------------------
	Exports
	-------------------------------------------------------------*/

	return {
		setAPIKey : _setAPIKey,
		Query : _Query,
		Timeline : _Timeline,
		loadScript : _loadScript,
		load : _load,
		formatDate : _formatDate
	};

})(document);


/**
 * simple JSONP support
 *
 *     JSONP.get('https://api.github.com/gists/1431613', function (data) { console.log(data); });
 *     JSONP.get('https://api.github.com/gists/1431613', {}, function (data) { console.log(data); });
 *
 * gist: https://gist.github.com/gists/1431613
 */
var JSONP = (function (document) {
    var requests = 0,
        callbacks = {};
 
    return {
        /**
         * makes a JSONP request
         *
         * @param {String} src
         * @param {Object} data
         * @param {Function} callback
         */
        get: function (src, data, callback) {
            // check if data was passed
            if (!arguments[2]) {
                callback = arguments[1];
                data = {};
            }
 
            // determine if there already are params
            src += (src.indexOf('?')+1 ? '&' : '?');
 
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script'),
                params = [],
                requestId = requests,
                param;
            
            // increment the requests
            requests++;
 
            // create external callback name
            data.callback = 'JSONP.callbacks.request_' + requestId;
            
            // set callback function
            callbacks['request_' + requestId] = function (data) {
                // clean up
                head.removeChild(script);
                delete callbacks['request_' + requestId];
 
                // fire callback
                callback(data); 
            };
            
            // traverse data
            for (param in data) {
                params.push(param + '=' + encodeURIComponent(data[param]));
            }
 
            // generate params
            src += params.join('&');
 
            // set script attributes
            script.type = 'text/javascript';
            script.src = src;
 
            // add to the DOM
            head.appendChild(script); 
        },
 
        /**
         * keeps a public reference of the callbacks object
         */
        callbacks: callbacks
    };
})(document);
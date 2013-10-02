var oo = (function(document){

	var _serviceEndpoint = "https://api.oocharts.com/v1/dynamic.jsonp";
	var _apiKey = undefined;

	var _defaultTimelineOptions = {};

	var _defaultPieOptions = {};

	var _defaultTableOptions = {};

	var _defaultBarOptions = {};
	
	var _defaultColumnOptions = {};

	/*
	 * Binds OOcharts Objects to DOM Elements based on HTML attributes
	 */
	var _autoBuild = function(){

		/*
		 * Gets all elements containing value for specified attribute
		 * @param {String} attribute
		 * @return {Array} matchingElements
		 */
		var getAllElementsWithAttribute = function(attribute){
			var matchingElements = [];
			var allElements = document.getElementsByTagName('*');
			for (var i = 0; i < allElements.length; i++){
				if (allElements[i].getAttribute(attribute)){
					matchingElements.push(allElements[i]);
				}
			}
			return matchingElements;
		};

		// find all oocharts elements
		var elements = getAllElementsWithAttribute('data-oochart');

		for(var e = 0; e < elements.length; e++){

			var _element = elements[e];

			//get oocharts data
			var type  = _element.getAttribute('data-oochart');
			var startDate = _element.getAttribute('data-oochart-start-date');
			var endDate = _element.getAttribute('data-oochart-end-date');
			var profile = _element.getAttribute('data-oochart-profile');

			// if metric
			if(type.toLowerCase() === 'metric'){
				var metric = new _Metric(profile, startDate, endDate);
				metric.setMetric(_element.getAttribute('data-oochart-metric'));
				metric.draw(_element);
				
			//if column
			} else if (type.toLowerCase() === 'column'){
				var column = new _Column(profile, startDate, endDate);
				
				var metricsString = _element.getAttribute('data-oochart-metrics');
				var metrics = metricsString.split(',');

				for(var m = 0; m < metrics.length; m++){
					column.addMetric(metrics[m], metrics[m+1]);
					m=m+1;
				}
				
				var dimension = _element.getAttribute('data-oochart-dimension');

				column.setDimension(dimension);
				
				column.draw(_element);

			//if timeline
			} else if (type.toLowerCase() === 'timeline'){
				var timeline = new _Timeline(profile, startDate, endDate);

				var metricsString = _element.getAttribute('data-oochart-metrics');
				var metrics = metricsString.split(',');

				for(var m = 0; m < metrics.length; m++){
					timeline.addMetric(metrics[m], metrics[m+1]);
					m=m+1;
				}

				timeline.draw(_element);

			} else if (type.toLowerCase() === 'bar' ) {
				var bar = new _Bar(profile, startDate, endDate);
				
				var metricsString = _element.getAttribute('data-oochart-metrics');
				var metrics = metricsString.split(',');

				for(var m = 0; m < metrics.length; m++){
					bar.addMetric(metrics[m], metrics[m+1]);
					m=m+1;
				}
				
				var dimension = _element.getAttribute('data-oochart-dimension');

				bar.setDimension(dimension);
				
				bar.draw(_element);
			//if pie
			} else if (type.toLowerCase() === 'pie'){
				var pie = new _Pie(profile, startDate, endDate);

				var metricString = _element.getAttribute('data-oochart-metric');
				var dimension = _element.getAttribute('data-oochart-dimension');

				var metric = metricString.split(',');

				pie.setMetric(metric[0], metric[1]);
				pie.setDimension(dimension);

				pie.draw(_element);

			//if table
			} else if (type.toLowerCase() === 'table'){
				var table = new _Table(profile, startDate, endDate);

				var metricString = _element.getAttribute('data-oochart-metrics');
				var dimensionString = _element.getAttribute('data-oochart-dimensions');

				var metrics = metricString.split(',');
				var dimensions = dimensionString.split(',');

				for(var m = 0; m < metrics.length; m++){
					table.addMetric(metrics[m], metrics[m+1]);
					m += 1;
				}

				for(var d = 0; d < dimensions.length; d++){
					table.addDimension(dimensions[d], dimensions[d+1]);
					d += 1;
				}

				table.draw(_element);
			}

			//else ignore and continue
		}
	};

	/*
	 * Loads a specified script and fires callback when finished
	 * @param {String} src
	 * @param {Function} callback
	 */
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
	    		if(cb) cb();

	    		// run autobuild
	    		_autoBuild();
			});
		});
	};

	/*
	 * Sets API Key
	 * @param {String} key
	 */
	var _setAPIKey = function(key){
		_apiKey = key;
	};
	
	/*
	 * Sets Column chart default options
	 * @param {Object} opts
	 */
	var _setColumnDefaults = function(opts){
		_defaultColumnOptions = opts;
	};

	/*
	 * Sets Bar chart default options
	 * @param {Object} opts
	 */
	var _setBarDefaults = function(opts){
		_defaultBarOptions = opts;
	};


	/*
	 * Sets Timeline chart default options
	 * @param {Object} opts
	 */
	var _setTimelineDefaults = function(opts){
		_defaultTimelineOptions = opts;
	};

	/*
	 * Sets Pie chart default options
	 * @param {Object} opts
	 */
	var _setPieDefaults = function(opts){
		_defaultPieOptions = opts;
	};

	/*
	 * Sets Table chart default options
	 * @param {Object} opts
	 */
	var _setTableDefaults = function(opts){
		_defaultTableOptions = opts;
	};

	/*
	 * Helper to format Data object to GA standards
	 * @param {Date} date
	 * @returns {String} formatted date (YYYY-MM-DD)
	 */
	var _formatDate = function(date){
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		var date = date.getDate().toString();

		if(month.length === 1) month = "0" + month;

		if(date.length === 1) date = "0" + date;

		return  year + '-' + month + '-' + date;
	};

	/*
	 * Helper to parse GA date to date object
	 * @param {String} val
	 * @returns {Date} parsed Date
	 */
	var _parseDate = function(val){
		val = val.split('-');
		var newDate = new Date();
		newDate.setFullYear(val[0], val[1]-1, val[2]);
		newDate.setHours(0,0,0,0);
		return newDate;
	};

	/*------------------------------------------------------------
	Query (Core OOcharts Object)
	-------------------------------------------------------------*/

	/*
	 * Query constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Query = function(profile, startDate, endDate) {
		this.metrics = [];
		this.dimensions = [];
		
		if(!profile) throw new Error("Profile argument required");

		this.profile = profile;

		// validate dates
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

	/*
	 * Clears all metrics on Query
	 */
	_Query.prototype.clearMetrics = function(){
		this.metrics = [];
	};

	/*
	 * Clears all dimensions on Query
	 */
	_Query.prototype.clearDimensions = function(){
		this.dimensions = [];
	};

	/*
	 * Adds a metric to Query
	 * @param {String} metric
	 */
	_Query.prototype.addMetric = function(metric){
		this.metrics.push(metric);
	};

	/*
	 * Adds a dimension to Query
	 * @param {String} dimension
	 */
	_Query.prototype.addDimension = function(dimension){
		this.dimensions.push(dimension);
	};

	/*
	 * Sets filters string for Query
	 * @param {String} filters
	 */
	_Query.prototype.setFilter = function(filters){
		this.filters = filters;
	};

	/*
	 * Sets sort string for Query
	 * @param {String} sort
	 */
	_Query.prototype.setSort = function(sort){
		this.sort = sort;
	};

	/*
	 * Sets segment string for Query
	 * @param {String} segment
	 */
	_Query.prototype.setSegment = function(segment){
		this.segment = segment;
	};

	/*
	 * Sets the beginning index for Query
	 * @param {Number or String} index
	 */
	_Query.prototype.setIndex = function(index){
		this.index = index;
	};

	/*
	 * Sets max results for Query
	 * @param {Number or String} maxResults
	 */
	_Query.prototype.setMaxResults = function(maxResults){
		this.maxResults = maxResults;
	};

	/*
	 * Executes query through JSONP
	 * @param {Function} callback(data)
	 */
	_Query.prototype.execute = function(callback){
		var query = {};

		query.key = _apiKey;
		query.profile = this.profile;

		if(this.metrics.length === 0) throw new Error("At least one metric is required");

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

		JSONP.get(_serviceEndpoint, query, function(data){
			if(data.rows.length === 0){
				data.rows = [[]];
			}
				
			callback(data);
		});
	};

	/*------------------------------------------------------------
	Metric
	-------------------------------------------------------------*/

	/*
	 * Metric constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Metric = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
	};

	/*
	 * Sets the metric
	 * @param {String} metric
	 */
	_Metric.prototype.setMetric = function(metric){
		this.query.clearMetrics();
		this.query.addMetric(metric);
	};

	/*
	 * Draws metric result in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Metric.prototype.draw = function(container, fn){
		this.query.execute(function(response){

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			if(typeof response.rows[0][0] !== 'undefined'){
				element.innerHTML = response.rows[0][0].toString();
			}
			else {
				element.innerHTML = "0";	
			}
			
			if(typeof fn !== 'undefined'){
				fn();
			}
		});
	};
	
	/*------------------------------------------------------------
	Column
	-------------------------------------------------------------*/

	/*
	 * Column constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Column = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
		
		this.metricLabels = [];
		
		this.options = _defaultColumnOptions;
	};

	/*
	 * Override default options
	 * @param {Object} opts
	 */
	_Column.prototype.setOptions = function(opts){
		this.options = opts;
	};

	/*
	 * Adds a metric to Column
	 * @param {String} metric
	 * @param {String} label
	 */
	_Column.prototype.addMetric = function(metric, label){
		this.metricLabels.push(label);
		this.query.addMetric(metric);
	};
	
	/*
	 * Set dimension of Column
	 * @param {String} dimension
	 */
	_Column.prototype.setDimension = function(dimension){
		this.query.clearDimensions();
		this.query.dimensions.push(dimension);
		this.dimensionLabel = dimension;
	};

	/*
	 * Draws Column in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Column.prototype.draw = function(container, fn){
		var b = this;

		this.query.execute(function (response) {

			var data = response.rows;

			var dt = new google.visualization.DataTable();

			dt.addColumn('string', b.dimensionLabel);

			// Add data column labels
			for (var l = 0; l < b.metricLabels.length; l++) {
				dt.addColumn('number', b.metricLabels[l]);
			}

			// add data
			dt.addRows(data);

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			var chart = new google.visualization.ColumnChart(element);
			chart.draw(dt, b.options);

			if (typeof fn != 'undefined') {
				fn();
			}
		});
	};

	/*------------------------------------------------------------
	Timeline
	-------------------------------------------------------------*/

	/*
	 * Timeline constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Timeline = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
		this.query.addDimension('ga:date');
	
		this.labels = [];
	
		this.options = _defaultTimelineOptions;
	};

	/*
	 * Override default options
	 * @param {Object} opts
	 */
	_Timeline.prototype.setOptions = function(opts){
		this.options = opts;
	};

	/*
	 * Adds a metric to Timeline
	 * @param {String} metric
	 * @param {String} label
	 */
	_Timeline.prototype.addMetric = function(metric, label){
		this.labels.push(label);
		this.query.addMetric(metric);
	};

	/*
	 * Draws timeline in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Timeline.prototype.draw = function(container, fn){
		var t = this;

		this.query.execute(function (response) {

			var data = response.rows;

			//Turn analytics date strings into date
			for (var r = 0; r < data.length; r++) {
				data[r][0] =_parseDate(data[r][0]);
			}

			var dt = new google.visualization.DataTable();

			dt.addColumn('date', 'Date');

			// Add data column labels
			for (var l = 0; l < t.labels.length; l++) {
				dt.addColumn('number', t.labels[l]);
			}

			// add data
			dt.addRows(data);

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			var chart = new google.visualization.LineChart(element);
			chart.draw(dt, t.options);

			if (typeof fn != 'undefined') {
				fn();
			}
		});
	};
	
	/*------------------------------------------------------------
	Bar
	-------------------------------------------------------------*/

	/*
	 * Bar constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Bar = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
		
		this.metricLabels = [];
		
		this.options = _defaultBarOptions;
	};

	/*
	 * Override default options
	 * @param {Object} opts
	 */
	_Bar.prototype.setOptions = function(opts){
		this.options = opts;
	};

	/*
	 * Adds a metric to Bar
	 * @param {String} metric
	 * @param {String} label
	 */
	_Bar.prototype.addMetric = function(metric, label){
		this.metricLabels.push(label);
		this.query.addMetric(metric);
	};
	
	/*
	 * Set dimension of Bar
	 * @param {String} dimension
	 */
	_Bar.prototype.setDimension = function(dimension){
		this.query.clearDimensions();
		this.query.dimensions.push(dimension);
		this.dimensionLabel = dimension;
	};

	/*
	 * Draws Bar in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Bar.prototype.draw = function(container, fn){
		var b = this;

		this.query.execute(function (response) {

			var data = response.rows;

			var dt = new google.visualization.DataTable();

			dt.addColumn('string', b.dimensionLabel);

			// Add data column labels
			for (var l = 0; l < b.metricLabels.length; l++) {
				dt.addColumn('number', b.metricLabels[l]);
			}

			// add data
			dt.addRows(data);

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			var chart = new google.visualization.BarChart(element);
			chart.draw(dt, b.options);

			if (typeof fn != 'undefined') {
				fn();
			}
		});
	};

	/*------------------------------------------------------------
	Pie
	-------------------------------------------------------------*/

	/*
	 * Pie constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Pie = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);
		this.options = _defaultPieOptions;
	};

	/*
	 * Set metric for Pie
	 * @param {String} metric
	 * @param {String} label
	 */
	_Pie.prototype.setMetric = function(metric, label){
		this.metricLabel = label;
		this.query.clearMetrics();
		this.query.addMetric(metric);
	};

	/*
	 * Set dimension for Pie
	 * @param {String} dimension
	 */
	_Pie.prototype.setDimension = function(dimension){
		this.query.clearDimensions();
		this.query.dimensionLabel = dimension;
		this.query.addDimension(dimension);
	};

	/*
	 * Override default pie options
	 * @param {Object} opts
	 */
	_Pie.prototype.setOptions = function(opts){
		this.options = opts;
	};

	/*
	 * Draws pie in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Pie.prototype.draw = function(container, fn){

		var p = this;

		this.query.execute(function(response){

			var data = response.rows;

			var dt = new google.visualization.DataTable();

			dt.addColumn('string', p.dimensionLabel);
			dt.addColumn('number', p.metricLabel);
			dt.addRows(data);

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			var chart = new google.visualization.PieChart(element);
			chart.draw(dt, p.options);

			if (typeof fn != 'undefined') {
				fn();
			}

		});

	};

	/*------------------------------------------------------------
	Table
	-------------------------------------------------------------*/

	/*
	 * Table constructor
	 * @param {String} profile
	 * @param {Date or String} startDate
	 * @param {Date or String} endDate
	 */
	var _Table = function(profile, startDate, endDate){
		this.query = new _Query(profile, startDate, endDate);

		this.metricLabels = [];
		this.dimensionLabels = [];

		this.options = _defaultTableOptions;
	};

	/*
	 * Adds a metric to table
	 * @param {String} metric
	 * @param {String} label
	 */
	_Table.prototype.addMetric = function(metric, label){
		this.query.addMetric(metric);
		this.metricLabels.push(label);
	};

	/*
	 * Adds a dimension to table
	 * @param {String} dimension
	 * @param {String} label
	 */
	_Table.prototype.addDimension = function(dimension, label){
		this.query.addDimension(dimension);
		this.dimensionLabels.push(label);
	};

	/*
	 * Override default table options
	 * @param {Object} opts
	 */
	_Table.prototype.setOptions = function(opts){
		this.options = opts;
	};

	/*
	 * Draws table in container element
	 * @param {Element or String} container (or id of container element)
	 * @param {Function} fn
	 */
	_Table.prototype.draw = function(container, fn){
		var t = this;

		this.query.execute(function (result) {

			var data = result.rows;

			var labelRow = [];

			for (var d = 0; d < t.dimensionLabels.length; d++) {
				labelRow.push(t.dimensionLabels[d]);
			}

			for (var m = 0; m < t.metricLabels.length; m++) {
				labelRow.push(t.metricLabels[m]);
			}

			data.splice(0, 0, labelRow);

			var dt = google.visualization.arrayToDataTable(data);

			var element;

			if(typeof container === 'string'){
				element = document.getElementById(container);
			} else {
				element = container;
			}

			var chart = new google.visualization.Table(element);
			chart.draw(dt, t.options);

			if (typeof fn != 'undefined') {
				fn();
			}
		});
	};

	/*------------------------------------------------------------
	Exports
	-------------------------------------------------------------*/

	return {
		Query : _Query,
		Timeline : _Timeline,
		Column : _Column,
		Bar : _Bar,
		Metric : _Metric,
		Pie : _Pie,
		Table : _Table,
		load : _load,
		formatDate : _formatDate,
		parseDate : _parseDate,
		setAPIKey : _setAPIKey,
		setBarDefaults : _setBarDefaults,
		setColumnDefaults : _setColumnDefaults,
		setTimelineDefaults : _setTimelineDefaults,
		setPieDefaults : _setPieDefaults,
		setTableDefaults : _setTableDefaults
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
}(document));

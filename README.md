#Getting Started#

OOcharts is an awesome little project that makes it easy to embed and share Google Analytics data through charts. It was started in the Summer of 2012 by [Tin Bin](http://tinb.in) and continues to grow. There are a few basics you need to know in order to get started:

###API Keys###
API Keys are created to give access to certain Google Analytics profiles. For every request to OOcharts, you will need a valid API Key. These keys can be created in [Mission Control](https://app.oocharts.com/mc/key/list).

###Queries###
Queries are packaged requests that are prebuilt on [Mission Control](https://app.oocharts.com/mc/query/list). Altough the API supports dynamic requests, Queries are useful for security. Queries restrict the parameters sent to Google Analytics and hide the Analytics profile ID. Users who want to display certain data on their site while also ensuring other parameters can not be retrieved should use Queries instead of the dynamic API.

#OOcharts JS#

OOcharts got its original footing providing an easy to use Charting library along with the API. Guess what, it's back!

####What's new in OOcharts JS####

Other than the super fast and reliable API that sits behind it, the OOcharts JS script has had a number of improvements. One of the most notable is the ability to use HTML attributes to build charts:

```html
<div data-oochart='timeline' data-oochart-start-date='30d' data-oochart-profile='some analytics profile id' data-oochart-metrics='ga:visits,Visits,ga:newVisits,New Visits'></div>
```

The above code would draw a timeline which goes back 30 days (another feature is relative dates) to show all the visits and new visits on a line chart. Don't worry, we will get to the details.

###Including the Script###

The OOcharts JS script is a single file. It can be downloaded from the GitHub repository (which also contains a number of examples). Simply place the `oocharts.js` file into your page:

```html
	<script src='oocharts.js'></script>
```

Once the script has loaded, you will have access to the `oo` object which houses all the goodies to create OOcharts.

###Basics###
All OOcharts JS objects work with a few basic principals:

####API Key####
You will need to have already created an API Key with access to the Google Profile you are trying to display.

####Profile ID####
You will also need the Google Analytics Profile ID. You can find this in Mission Control next to wherever the profile name is displayed in brackets, or on your Google Analytics Dashboard.

####Relative Dates####
Dates can either be `Date` objects, Relative dates, or null (in which case the date will default to the current date). Relative Dates provide an easy way to get a range of data by using a number and a metric, such as "30d" for 30 days:

- 'd': Days
- 'w': Weeks
- 'm': Months
- 'y': Years

It is important to note that only one of the two dates (start and end) can be relative. If the start date is relative, then it will include the dates **before** the end date (i.e. "30d" would make the start date 30 days from the end date). If the end date is relative, then it will include the dates **after** the start date.

####Setting the API Key and Loading the Dependencies####
OOcharts uses the [Google Visualization Library](https://developers.google.com/chart/interactive/docs/reference) to chart data. To get started, you will need to call the `load()` function after setting your API Key. This is all a bunch of gibberish, so here is a code example:

```html

<!--Include OOcharts script-->
<script src='oocharts.js'></script>
<script type='text/javascript'>
	window.onload = function(){
		oo.setAPIKey("{{ YOUR API KEY }}");

		oo.load(function(){

			//Do charts here

		});
	};
</script>

```

Once the load callback has fired, you are ready to begin using OOcharts. The load function will also bind the OOcharts using HTML attributes once finished, but we will get to that later.

####Working with the Examples####
The OOcharts JS library comes with a few examples. These examples have all the basics you will need to get started. Just make sure to replace `{{YOUR PROFILE ID}}` with your Google Analytics Profile ID and `{{YOUR API KEY}}` with your OOcharts API Key.

####Issues####
If you run in to any trouble with the OOcharts, you can email [support@oocharts.com](mailto:support@oocharts.com) or [create an issue](https://github.com/OOcharts/js/issues) on GitHub.

##Metric##
Metrics are the simplest charting object which replace the inner HTML content of an element with the result of a query.

####Using JS####
Metrics can easily be created through the JSAPI under the `oo` object.

- `constructor(profile, startDate, endDate)` - The Metric constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `setMetric(metric)` - Just as the method name states, this sets the metric to load. This should be a valid Google Analytics metric name, such as `"ga:visits"`; 
- `draw(container, callback)` - Calling draw will draw the metric into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

Here is a quick example of using a metric to show visits through the JS API. Normally, you would replace the `{{}}` content with your information.

```html
<html>
	<head>
	</head>
	<body>
		
		Visits : <span id='metric'></span>
		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var metric = new oo.Metric("{{ YOUR PROFILE ID }}", "30d");

					metric.setMetric("ga:visits");

					metric.draw('metric');

				});
			};

		</script>
	</body>
</html>
```

####Using HTML Attributes####
You can also easily create Metrics through the HTML Attribute API.

- `data-oochart` - For a metric, this should always have a value of `metric`.
- `data-oochart-metric` - Value of the metric to query.
- `data-oochart-profile` - The Google Analytics profile ID.
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).

Once `oo.load` is called successfully, the HTML element content will be replaced with the query results.

```html
<html>
	<head>
	</head>
	<body>
		New Visits : <span data-oochart='metric' data-oochart-metric='ga:newVisits' data-oochart-start-date='30d' data-oochart-profile='{{ YOUR PROFILE ID }}'></span>
		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load();
			};

		</script>
	</body>
</html>
```

##Timeline##
A timeline is a Google Visualization [line chart](https://developers.google.com/chart/interactive/docs/gallery/linechart) which shows metric values over a date range.

####Using JS####

- `constructor(profile, startDate, endDate)` - The Timeline constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `addMetric(metric, label)` - Adds the `metric` to the timeline with the name `label`.
- `setOptions(opts)` -  Overwrites any default options for the timeline. See line chart options [here](https://developers.google.com/chart/interactive/docs/gallery/linechart#Configuration_Options). `opts` is a simple object, for example: `{ colors : ['#000', '#111', '#222'] }` would assign colors to the timeline.
- `draw(container, callback)` - Calling draw will draw the Timeline into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

```html
<html>
	<head>
	</head>
	<body>
		<div id='chart'></div>		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var timeline = new oo.Timeline("{{ YOUR PROFILE ID }}", "30d");

					timeline.addMetric("ga:visits", "Visits");

					timeline.addMetric("ga:newVisits", "New Visits");

					timeline.draw('chart');

				});
			};

		</script>
	</body>
</html>
```

####Using HTML Attributes####
You can also easily create Timelines through the HTML Attribute API as well.

- `data-oochart` - Should always have value of `timeline` for timelines.
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-profile` - The Google Analytics profile ID.
- `data-oochart-metrics` - A list of comma-deliminated metrics in the format: `metric,label,metric,label`. Check out the example below.


```html
<html>
	<head>
	</head>
	<body>
		<div data-oochart='timeline' data-oochart-start-date='30d' data-oochart-metrics='ga:visits,Visits,ga:newVisits,New Visits' data-oochart-profile='{{ YOUR PROFILE ID }}'></div>
		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load();
			};

		</script>
	</body>
</html>
```

##Bar##
A Bar is a Google Visualization [bar chart](https://developers.google.com/chart/interactive/docs/gallery/barchart) which shows metric values over a dimension.

####Using JS####

- `constructor(profile, startDate, endDate)` - The Bar constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `addMetric(metric, label)` - Adds the `metric` to the bar with the name `label`.
- `setDimension(dimension)` - Sets the dimension for the bar chart.
- `setOptions(opts)` -  Overwrites any default options for the bar chart. See bar chart options [here](https://developers.google.com/chart/interactive/docs/gallery/barchart#Configuration_Options). `opts` is a simple object, for example: `{ colors : ['#000', '#111', '#222'] }` would assign colors to the timeline.
- `draw(container, callback)` - Calling draw will draw the Bar into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

```html
<html>
	<head>
	</head>
	<body>
		<div id='chart'></div>		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var bar = new oo.Bar("{{ YOUR PROFILE ID }}", "30d");

					bar.addMetric("ga:visits", "Visits");

					bar.addMetric("ga:newVisits", "New Visits");

					bar.setDimension("ga:continent");

					bar.draw('chart');

				});
			};

		</script>
	</body>
</html>
```

####Using HTML Attributes####
You can also easily create Bar Charts through the HTML Attribute API as well.

- `data-oochart` - Should always have value of `bar` for bar charts.
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-profile` - The Google Analytics profile ID.
- `data-oochart-metrics` - A list of comma-deliminated metrics in the format: `metric,label,metric,label`. Check out the example below.
- `data-oochart-dimension` - The dimension to group metric values by.

```html
<html>
	<head>
	</head>
	<body>
		<div data-oochart='bar' data-oochart-start-date='30d' data-oochart-dimension='ga:continent' data-oochart-metrics='ga:visits,Visits,ga:newVisits,New Visits' data-oochart-profile='{{ YOUR PROFILE ID }}'></div>
		
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load();
			};

		</script>
	</body>
</html>
```

##Pie##
A Pie chart is really just what it sounds like: A Pie chart. This chart uses the Google Visualization [Pie Chart](https://developers.google.com/chart/interactive/docs/gallery/piechart) to display a metric over a dimension (such as visits by browser type).

####Using JS####

- `constructor(profile, startDate, endDate)` - The Pie constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `setMetric(metric, label)` - Sets the `metric` of the Pie with the name `label`.
- `setDimension(dimension, label)` - Sets the `dimension` of the Pie.
- `setOptions(opts)` -  Overwrites any default options for the Pie. See Pie chart options [here](https://developers.google.com/chart/interactive/docs/gallery/piechart#Configuration_Options). `opts` is a simple object, for example: `{ colors : ['#000', '#111', '#222'] }` would assign colors to the Pie.
- `draw(container, callback)` - Calling draw will draw the Pie into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

```html
<html>
	<head>
	</head>
	<body>
		<div id='pie'></div>
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var pie = new oo.Pie("{{ YOUR PROFILE ID }}", "30d");

					pie.setMetric("ga:visits", "Visits");
					pie.setDimension("ga:browser");

					pie.draw('pie');

				});
			};

		</script>
	</body>
</html>
```

####Using HTML Attributes####
Pie charts are available throught the new HTML API.

- `data-oochart` - Should always have value of `timeline` for timelines.
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-profile` - The Google Analytics profile ID.
- `data-oochart-metric` - Should contain the metric for the Pie and the label, seperated by a `,`. (i.e. `"ga:visits,Visits"`)
- `data-oochart-dimension` - Should contain the dimension for the Pie and the label, seperated by a `,`. (i.e. `"ga:browser,Browser"`)


```html
<html>
	<head>
	</head>
	<body>
		<div data-oochart='pie' data-oochart-start-date='30d' data-oochart-metric='ga:visits,Visits' data-oochart-dimension='ga:browser' data-oochart-profile='{{ YOUR PROFILE ID }}'></div>

		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load();
			};

		</script>
	</body>
</html>
```

##Table##
A Table can show a multiple dimensions by multiple metrics. This chart uses the Google Visualization [Table](https://developers.google.com/chart/interactive/docs/gallery/table).

####Using JS####

- `constructor(profile, startDate, endDate)` - The Table constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `addMetric(metric, label)` - Adds the `metric` to the Table with the name `label`.
- `addDimension(dimension, label)` - Adds the `dimension` to the Table with the name `label`.
- `setOptions(opts)` -  Overwrites any default options for the Table. See Table chart options [here](https://developers.google.com/chart/interactive/docs/gallery/table#Configuration_Options).
- `draw(container, callback)` - Calling draw will draw the Table into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

```html
<html>
	<head>
	</head>
	<body>
		<div id='table'></div>
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var table = new oo.Table("{{ YOUR PROFILE ID }}", "30d");

					table.addMetric("ga:visits", "Visits");

					table.addDimension("ga:city", "City");

					table.draw('table');

				});
			};

		</script>
	</body>
</html>
```

####Using HTML Attributes####
You may have guessed it: You can create Tables through the HTML API as well.

- `data-oochart` - Should always have value of `timeline` for timelines.
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
- `data-oochart-profile` - The Google Analytics profile ID.
- `data-oochart-metrics` - A list of comma-deliminated metrics and labels in the format: `metric,label,metric,label`. Check out the example below.
- `data-oochart-dimensions` - A list of comma-deliminated dimensions and labels in the format: `dimension,label,dimension,label`. Check out the example below.

```html
<html>
	<head>
	</head>
	<body>
		<div data-oochart='table' data-oochart-start-date='30d' data-oochart-metrics='ga:visits,Visits' data-oochart-dimensions='ga:city,City' data-oochart-profile='{{ YOUR PROFILE ID }}'></div>

		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load();
			};

		</script>
	</body>
</html>
```

##Query##
The Query object is the core object of the OOcharts JS. The query object maintains the metrics and dimensions under the charts and executes the API query when `draw()` is called. The Query can also be used by itself to fetch data from the OOcharts API, allowing you to use any charting library you want.

- `constructor(profile, startDate, endDate)` - The Query constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
- `addMetric(metric)` - Adds a `metric` to the Query.
- `addDimension(dimension)` - Adds a `dimension` to the Query.
- `clearMetrics()` - Clears all metrics on the Query.
- `clearDimensions()` - Clears all dimensions on the Query.
- `setFilter(filters)` - Sets the `filters` string for the Query.
- `setSort(sort)` - Sets the `sort` string for the Query.
- `setSegment(segment)` - Sets the `segment` string for the Query.
- `setIndex(index)` - Sets the starting `index` for Query results (default: 0).
- `setMaxResults(maxResults)` - Sets the `maxResults` for the Query.
- `execute(callback)` - Executes the Query, and returns `data` as the sole parameter in the passed `callback` function.

```html
<html>
	<head>
	</head>
	<body>
		<script src='oocharts.js'></script>
		<script type="text/javascript">

			window.onload = function(){

				oo.setAPIKey("{{ YOUR API KEY }}");

				oo.load(function(){

					var query = new oo.Query('{{ YOUR PROFILE ID}}', '30d');
					query.addMetric('ga:visits');
					query.addDimension('ga:date');
					query.addSort('-ga:visits');;
					query.execute(function(data){
						alert(data);
					});

				});
			};

		</script>
	</body>
</html>
```

##Advanced Chart/Query Options##
You may want to add more complex behaviour to your charts (such as adding a filter to your Timeline). This is actually really easy. Under each charting object is a Query (above). You can set the properties on the query under the chart before drawing it to achieve more complex charts:

```js
var timeline = new oo.Timeline(profile, startDate, endDate);

timeline.addMetric('ga:visits', 'Visits');
timeline.query.setFilter('ga:visits>100'); //access query object

timeline.draw(container);
```

##Helper Methods##
There are a couple public facing methods on the `oo` object which we've included to make your quest for chart greatness easier.

- `oo.formatDate(date)` - Formats `date` into the acceptable GA format (YYYY-MM-DD);
- `oo.parseDate(val)` - Parses a GA date string into a Javascript date object.

##Theming##
You probably want to throw your own styles on the charts, right? You can do this through the `setOptions()` method that all of the charts have, but this would be cumbersome. Thank goodness there are some default options to set!

- `oo.setTimelineDefaults(opts)` - Sets the default options of all new Timelines to `opts`.
- `oo.setTableDefaults(opts)` - Sets the default options of all new Tables to `opts`.
- `oo.setPieDefaults(opts)` - Sets the default options of all new Pies to `opts`.
- `oo.setBarDefaults(opts)` - Sets the default options of all new Bar charts to `opts`.

This is especially helpful if you want to stick to the HTML API. Set your defaults before the load call, and all HTML Attribute charts will pick up those defaults.

#OOcharts API#

Ah, so you want to drive stick huh? The OOcharts API is powerful all on its own, despite the cool looking chart library we include. This section will describe the two API endpoints and how to take advantage of them from Javascript in the browser or application code running on your server (cool, right?).

##General##

All OOcharts API endpoints have the general format: `/{{version}}/{{action}}.{{type}}`. The `version` dictates the API version (current `v1`), the action describes the action `query` or `dynamic`, and finally the `type` dictates a response of `json` or `jsonp`.

An example query call with a JSON response: `/v1/query.json`

An example dynamic call with a JSONP response: `/v1/dynamic.jsonp`

It should be noted that all `jsonp` response types will use the `callback` query string parameter.

####Responses####
Responses from either endpoint follow the format:

```js
// successful response
{
    "column_headers":[
        {
            "name":"ga:date",
            "columnType":"DIMENSION",
            "dataType":"STRING"
        },
        {
            "name":"ga:visits",
            "columnType":"METRIC",
            "dataType":"NUMBER"
        }
    ]
    , "rows":[] //Data rows in here
    , "total_results": 32
}

// error response
{
    "error":"Invalid param {key}: API Key is invalid"
}

```

## Query ##

`GET /v1/query.json` or `GET /v1/query.jsonp`

This endpoint is used to interact with the `Query` object in Mission Control.

#### Query Strings ####

- `key` - *(required)* Your API Key. This must have access to the Google Analytics profile used by the query.
- `start` - *(required)* Start date of query. Should be in format `YYYY-MM-DD` or in relative date format described in *Basics*.
- `end` - *(optional)* End date of query. Should be in format `YYYY-MM-DD` or in relative date format described in *Basics*. If no date is given, the current date of the Google Analytics profile's timezone (pretty snazzy huh?) will be used.
- `query` - *(required)* The query slug of the Mission Control Query.
- `page` - *(optional)* The page number of the results. Useful when using the Page Size setting of a Mission Control Query.
- `filters` - *(optional)* A qualified Google Analytics filter string.
- `callback` - *(optional)* Only necessary when using JSONP response type.

## Dynamic ##

`GET /v1/dynamic.json` or `GET /v1/dynamic.jsonp`

This endpoint is used for dynamic access to your GA profiles. This is also the endpoint used by the charting library.

#### Query Strings ####

- `key` - *(required)* Your API Key. This must have access to the Google Analytics profile used by the query.
- `profile` - *(required)* The Google Analytics profile ID.
- `start` - *(required)* Start date of query. Should be in format `YYYY-MM-DD` or in relative date format described in *Basics*.
- `end` - *(optional)* End date of query. Should be in format `YYYY-MM-DD` or in relative date format described in *Basics*. If no date is given, the current date of the Google Analytics profile's timezone (pretty snazzy huh?) will be used.
- `metrics` - *(required)* A list of valid Google Analytics metrics deliminated by `,`.
- `dimensions` - *(optional)* A list of valid Google Analytics dimensions deliminated by `,`.
- `sort` - *(optional)* A list of valid Google Analytics sort parameters deliminated by `,`.
- `segment` - *(optional)* A valid Google Analytics segment string.
- `filters` - *(optional)* A qualified Google Analytics filter string.
- `index` - *(optional)* The starting index of the query results.
- `maxResults` - *(optional)* The max results for the query.
- `callback` - *(optional)* Only necessary when using JSONP response type.

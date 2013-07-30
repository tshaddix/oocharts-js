#Getting Started#

OOcharts is an awesome little project that makes it easy to embed and share Google Analytics data through charts. It was started in the Summer of 2012 by [Tin Bin](http://tinb.in) and continues to grow. There are a few basics you need to know in order to get started:

###API Keys###
API Keys are created to give access to certain Google Analytics profiles. For every request to OOcharts, you will need a valid API Key. These keys can be created in [Mission Control](https://app.oocharts.com/key/list).

###Queries###
Queries are packaged requests that are prebuilt on [Mission Control](https://app.oocharts.com/query/list). Altough the API supports dynamic requests, Queries are useful for security. Queries restrict the parameters sent to Google Analytics and hide the Analytics profile ID. Users who want to display certain data on their site while also ensuring other parameters can not be retrieved should use Queries instead of the dynamic API.

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

Once the script has loaded, you will have access to the `oo` object which houses all the Goodies to create OOcharts.

###Basics###
All OOcharts JS objects work with a few basic principals:

####API Key####
You will need to have already created an API Key with access to the Google Profile you are trying to display.

####Profile ID####
You will also need the Google Analytics Profile ID. You can find this in Mission Control next to wherever the profile name is display in brackets, or on your Google Analytics Dashboard.

####Relative Dates####
Dates can either be `Date` objects, Relative dates, or null (in which case the date will default to the current date). Relative Dates provide an easy way to get a range of data by using a number and a metric, such as "30d" for 30 days:

- 'd': Days
- 'w': Weeks
- 'm': Months
- 'y' Years

It is important to note that only one of the two dates (start and end) can be relative. If the start date is relative, then it will include the dates **before** the end date (i.e. "30d" would make the start date 30 days from the end date). If the end date is realtive, then it will include the dates **after** the start date.

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

###Metric###
Metrics are the simplest charting object which replace the inner HTML content of an element with the result of a query.

####Using JS####
Metrics can easily be created through the JSAPI under the `oo` object.

-`constructor(profile, startDate, endDate)` - The Metric constructor takes in the Google Analytics profile, start date, and end date. All of these parameter options are discussed above in the *Basics* section.
-`setMetric(metric)` - Just as the method name states, this sets the metric to load. This should be a valid Google Analytics metric name, such as `"ga:visits"`; 
-`draw(container, callback)` - Calling draw will draw the metric into the `container` element. The `container` can either be a `String` of the target element's id, or the DOM element object itself.

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
- `data-oochart-start-date` - The beginning date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).
-`data-oochart-end-date` - The ending date of the data. Can be relative, formatted `YYYY-MM-DD`, or null (indicating current date).

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

###Timeline###

###Pie###

###Table###

###Query###

###Helper Methods###

There are a couple public facing methods on the `oo` object which we've included to make your quest for chart greatness easier.

#OOcharts API#

Ah, so you want to drive stick huh? The OOcharts API is powerful all on its own, despite the cool looking chart library we include. This section will describe the two API endpoints and how to take advantage of them from Javascript in the browser or application code running on your server (cool, right?).
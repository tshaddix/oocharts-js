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

Once the load callback has fired, you are ready to begin using OOcharts. The load function will also bind the OOcharts using HTML attributes once finished, but we will get to that later.

```

###Metric###

###Timeline###

###Pie###

###Table###

###Query###

#OOcharts API#
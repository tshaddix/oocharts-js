#Getting Started#

OOcharts is an awesome little project that makes it easy to embed and share Google Analytics data through charts. It was started in the Summer of 2012 by [Tin Bin](http://tinb.in) and continues to grow. There are a few basics you need to know in order to get started:

##API Keys##
API Keys are created to give access to certain Google Analytics profiles. For every request to OOcharts, you will need a valid API Key. These keys can be created in [Mission Control](https://app.oocharts.com/key/list).

##Queries##
Queries are packaged requests that are prebuilt on [Mission Control](https://app.oocharts.com/query/list). Altough the API supports dynamic requests, Queries are useful for security. Queries restrict the parameters sent to Google Analytics and hide the Analytics profile ID. Users who want to display certain data on their site while also ensuring other parameters can not be retrieved should use Queries instead of the dynamic API.

#Charts#

OOcharts got its original footing providing an easy to use Charting library along with the API. Guess what, it's back!

##Including the Script##

The OOcharts JS script is a single file. It can be downloaded from the GitHub repository (which also contains a number of examples). Simply place the `oocharts.js` file into your page:

```html
	<script src='oocharts.js'></script>
```

##Basics##

##Metric##

##Timeline##

##Pie##

##Table##

#OOcharts API#
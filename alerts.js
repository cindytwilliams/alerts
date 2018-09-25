/*
 * VS Emergency Alerts
 */
;
(function ($) {
  $(document).ready(function() {
  	
  	// add a div after the body tag
    $('body').prepend("<div class='row' id='vsAlerts'><div class='col-xs-12 col-sm-12 col-md-12'><div class='marquee'></div></div></div>");
  	$("#vsAlerts").hide();
  	
    // get the current date and time
    var today = new Date();
    var date = (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var currentDate = date + ' ' + time;
    
    // Set variables for the YQL string
    var yql_xmlfeed = 'https://www.myschoolcast.com/rss/default.aspx?cid=3067';
    var yql_query = encodeURIComponent('select * from xml where url="' + yql_xmlfeed + '"');
    var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + yql_query + '&format=xml&callback=?';
    
    // Request that YSQL string, and run a callback function. Pass a defined function to prevent cache-busting.
    $.getJSON(yql, function (data) {
        xml = data.results[0];
      
        // loop through each item in the RSS feed
        $.each($("item", xml), function(i, e) {
            
            var title = $(this).find('title').text();
            var description = $(this).find('description').text();
            var pubDate = $(this).find('pubDate').text();
            
            // get difference in hours between the item's pubDate and the currentDate    
            var d1 = new Date(pubDate);
            var d2 = new Date(currentDate);
            var hours = Math.round(Math.abs(d1 - d2) / 36e5);
            
            // display alert if it was posted within the past 24 hours
            if (hours <= 24) {
              var output = "<span id='txt" + i + "'>" + pubDate + ": " + title + " - " + description + "</span>";
              $(".marquee").append(output);   // add item to the marquee
              $("#vsAlerts").show();        // display the alert div
            }
  
        });
        
        // start the scrolling marquee
				$('.marquee').marquee({
			    duration: 12000,
			    startVisible: true,
			    duplicated: false,
			    allowCss3Support: true,
			    css3easing: 'linear',
			    delayBeforeStart: 1200
		  	});

    });
    
  });
})(jQuery);
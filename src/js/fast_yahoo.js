var timerLoopTimes = 10

var timerForYahooSearch;
var timerForYahooSearchLoopTimes = 0
var timerForYahooSearchInterval = 500

CURRENT_URL = window.location.href;
timerForYahooSearch = self.setInterval("rmYahooRedirect()",timerForYahooSearchInterval)

function rmYahooRedirect() {
	links = document.querySelectorAll('div.res a')
	console.log("Yahoo:" + links.length)
	if(links.length > 0) {
		for(var i = 0; i < links.length; i++) {
			var tmpLink = links[i]
			tmpLink.setAttribute("dirtyhref", tmpLink.getAttribute("href"))
		}
		clearLoopTimer(timerForYahooSearch)
		
	} else {
		timerForYahooSearchLoopTimes = timerForYahooSearchLoopTimes + 1
		if(timerForYahooSearchLoopTimes > timerLoopTimes) {
			clearLoopTimer(timerForYahooSearch)
		}
	}
		
}

function clearLoopTimer(timer) {
	if(timer != null) {
		clearInterval(timer)
		timer = null
	}
}
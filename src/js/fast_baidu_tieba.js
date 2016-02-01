var timerLoopTimes = 10

var timerForBaiduSearch;
var timerForBaiduSearchInterval = 500

CURRENT_URL = window.location.href;
timerForBaiduSearch = self.setInterval("rmRedirect()",timerForBaiduSearchInterval)

console.log("Enter baidu tieba...")

lastUrl = ""

function rmRedirect() {
	cur_page = window.location.href

	links = document.querySelectorAll("a[href*='jump.bdimg']")

	// if(links.length > 0 && cur_page != lastUrl) {
	if (links.length > 0) {
		console.log("length =" + links.length)
		lastUrl = cur_page
		replaceLink(links)
	} 		
}


function replaceLink(links) {

	for(var i = 0; i < links.length; i++) {

		link = links[i]
		curHref = link.href
		curText = link.textContent

		if(curText != undefined && curText.length > 0 && 
			curHref.startsWith("http://jump.bdimg.com/safecheck/index?url=") ) {
			link.href = link.text
		}

	}

}

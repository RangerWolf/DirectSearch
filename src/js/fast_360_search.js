var timerLoopTimes = 10

var timerFor360Search;
var timerFor360SearchLoopTimes = 0
var timerFor360SearchInterval = 500

CURRENT_URL = window.location.href;
timerFor360Search = self.setInterval("rmRedirect()",timerFor360SearchInterval)

lastUrl = ""

function rmRedirect() {
	links = document.querySelectorAll('.res-title a')
	cur_page = window.location.href

	if(links.length > 0 && cur_page != lastUrl) {

		lastUrl = cur_page

		for(var i = 0; i < links.length; i++) {
			var tmpLink = links[i]
			curHref = tmpLink.href
			newHref = extractRealUrl(curHref)

			tmpLink.href = newHref
		}

		insertLabel()
		
	} 		
}


function extractRealUrl(redirectUrl) {

	if(redirectUrl.indexOf("www.haosou.com/link?") > 0 &&
		redirectUrl.indexOf("url=") > 0) {

		var paramPart = redirectUrl.split("?")[1]
		var params = paramPart.split("&")
		for(var i =0; i < params.length; i++) {
			param = params[i]
			if(param.startsWith("url=")) {

				realUrl = param.replace("url=", "")
				realUrl = decodeURIComponent(realUrl)
				return realUrl
			}

		}

	}

	return redirectUrl;

}


function insertLabel() {
	newLabel = $("<div class='doneLabel' style='color:green'>重定向已去除 </div>")
    if($(".doneLabel").length == 0 ) {
        target = $("#head")
        target.append(newLabel)
    }	
}
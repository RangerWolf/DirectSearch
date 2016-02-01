var timerLoopTimes = 10

var timerForSNS;
var timerForSNSLoopTimes = 0
var timerForSNSInterval = 1000

CURRENT_URL = window.location.href;

setTimeout(rmSNSRedirect,800)
setTimeout(rmSNSRedirect,1200)
setTimeout(rmSNSRedirect,1600)
timerForSNS = self.setInterval("rmSNSRedirect()",timerForSNSInterval)

function rmSNSRedirect() {
	links = document.querySelectorAll('div.content a[href^="http://t.co"]')
	if(links.length > 0) {
		for(var i = 0; i < links.length; i++) {
			var tmpLink = links[i]
			tmpLink.href = tmpLink.title;
			if(tmpLink.removeAttribute){
				tmpLink.removeAttribute("onmousedown")
				newLink = tmpLink.cloneNode(true)
				tmpLink.parentNode.replaceChild(newLink, tmpLink)
			}
		}

		if($("#tipsLabel").length <= 0) {
			tipsLabel = $("#content-main-heading")
			tipsLabel.append('<span id="tipsLabel" style="float:right;font-size: 14px;color: green">' + chrome.i18n.getMessage("w_rd_removed") + '</span>')	
		}
		

	} 
}

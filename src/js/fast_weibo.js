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
	links = document.querySelectorAll('a[href^="http://t.cn"]')
	if(links.length > 0) {
		console.log("direct search")
		for(var i = 0; i < links.length; i++) {
			var tmpLink = links[i]
			if( tmpLink.title != null && 
				tmpLink.title != undefined && 
				tmpLink.title.indexOf("http") == 0 && 
				tmpLink.title.indexOf("http://t.cn") != 0) {
				
				tmpLink.href = tmpLink.title;
				if(tmpLink.removeAttribute){
					tmpLink.removeAttribute("onmousedown")
					tmpLink.removeAttribute("mt")
					tmpLink.removeAttribute("action-type")
					tmpLink.style.color = "green"
					newLink = tmpLink.cloneNode(true)
					tmpLink.parentNode.replaceChild(newLink, tmpLink)
				}	
			}
		}

		if($("#tipsLabel").length <= 0) {
			tipsLabel = $("div.group_read .clearfix:first")
			tipsLabel.prepend('<span id="tipsLabel" style="float:right;font-size: 12px;color: green">部分转向已去除</span>')	
		}
	} 
}


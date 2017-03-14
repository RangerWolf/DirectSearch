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
	links = document.querySelectorAll('a[href*="//link.zhihu.com/?target="]')
	if(links.length > 0) {
		for(var i = 0; i < links.length; i++) {
			var tmpLink = $(links[i])
      var curLink = tmpLink.attr('href')
      if (/link\.zhihu\.com\/\?target=(.*)$/.test(curLink)) {
        var rawLink = decodeURIComponent(/link\.zhihu\.com\/\?target=(.*)$/.exec(curLink)[1])
        tmpLink.attr('href', rawLink)
      }
		}
	}
}

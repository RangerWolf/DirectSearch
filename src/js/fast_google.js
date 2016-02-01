var timerLoopTimes = 10

var timerForGoogleSearch;
var timerForGoogleSearchLoopTimes = 0
var timerForGoogleSearchInterval = 2000

CURRENT_URL = window.location.href;

setTimeout(rmGoogleRedirect,800)
setTimeout(rmGoogleRedirect,1200)
setTimeout(rmGoogleRedirect,1600)
timerForGoogleSearch = self.setInterval("rmGoogleRedirect()",timerForGoogleSearchInterval)

function rmGoogleRedirect() {
	links_web = 		document.querySelectorAll('h3.r a[href][onmousedown]')
	links_news_in_web = document.querySelectorAll("#rso a[href][onmousedown]")
	links_img_title = 	document.querySelectorAll("._LAd a[href^='http']")
	links_img_btns  =	document.querySelectorAll(".irc_butc a")
	links = []

	$.each(links_news_in_web, function(index, item){
	    links.push(item);
	})
	$.each(links_web, function(index, item){
	    links.push(item);
	})
	$.each(links_img_title, function(index, item){
	    links.push(item);
	})
	$.each(links_img_btns, function(index, item){
	    links.push(item);
	})


	if(links.length > 0) {
		for(var i = 0; i < links.length; i++) {
			var tmpLink = links[i]
			tmpLink.target = "_blank"
			if(tmpLink.removeAttribute){
				tmpLink.removeAttribute("onmousedown")
				// tmpLink.style.color = "red";
				newLink = tmpLink.cloneNode(true)
				if(tmpLink.parentNode != null) {
					tmpLink.parentNode.replaceChild(newLink, tmpLink)	
				}
				
			}
		}
	} 

	//web+news
	tipsDiv = document.querySelector("#resultStats")
	
	if(tipsDiv != null && $(".tipsLabel").length == 0) {
		console.log("LLL")
		var tipsLabel = document.createElement('label'); 
		tipsLabel.setAttribute("style", "color:green")
		tipsLabel.setAttribute("class", "tipsLabel")
		tipsLabel.textContent = chrome.i18n.getMessage("w_rd_removed")
		tipsDiv.appendChild(tipsLabel);
	} 
	

	// img
	if(links_img_title.length > 0) {
		tipsTr = document.querySelectorAll(".irc_butc tr")
		for(i =0; i < tipsTr.length; i++) {
			if ($(tipsTr[i]).find(".tipsLabel").length > 0) {continue};
			var tipsLabel = document.createElement('td'); 
			tipsLabel.setAttribute("style", "color:#6E6E6E")
			tipsLabel.setAttribute("class", "tipsLabel")
			tipsLabel.textContent = chrome.i18n.getMessage("w_rd_removed")
			tipsTr[i].appendChild(tipsLabel);	
		}
	} 
}


var timerLoopTimes = 10

var timerForBaiduSearch;
var timerForBaiduSearchInterval = 500

CURRENT_URL = window.location.href;
timerForBaiduSearch = self.setInterval("rmRedirect()",timerForBaiduSearchInterval)

console.log("Enter baidu search...")

lastUrl = ""

function rmRedirect() {
	cur_page = window.location.href

	links = document.querySelectorAll('#content_left div.result h3 a')

	if(links.length > 0 && cur_page != lastUrl) {
		lastUrl = cur_page
		replaceLink()
	} 		
}

function clearLoopTimer(timer) {
	if(timer != null) {
		clearInterval(timer)
		timer = null
	}
}

function replaceLink() {

	page_link = window.location.href;


	page_host = page_link.split("?", 2)[0]
	page_param = page_link.split("?", 2)[1]

	arr = page_param.split("&")

	containsTn = false
	needReplaceWd = false
	newSearchWd = ""
	hit_top_new = document.querySelectorAll("div.hit_top_new")
	if(hit_top_new.length == 1 && $(hit_top_new).find("strong").length == 3) {
		newSearchWd = $(hit_top_new).find("strong")[1].textContent
		needReplaceWd = true
	}


	for(var i = 0; i < arr.length; i++) {
		tmp = arr[i]
		if(tmp.startsWith("tn=")) {
			containsTn = true
			arr[i] = "tn=baidulocal"
		}

		if(tmp.startsWith("wd=") && needReplaceWd == true) {
			arr[i] = "wd=" + encodeURIComponent(newSearchWd)
		}
	}
	ajax_page_link = page_host + "?" + arr.join("&")

	if(containsTn == false)
		ajax_page_link = ajax_page_link + "&tn=baidulocal"

	console.log("source page:" + ajax_page_link)
	$.ajax({
  		url: ajax_page_link,
  		context: document.body
	}).done(function(data) {

	  	direct_links = $(data).find("td.f a[href]")

	  	directResultArr = new Array(direct_links.length / 2);

	  	for(var i = 0; i < direct_links.length; i+=2) {

	  		tmpHref = direct_links[i].href
	  		tmpText = direct_links[i].text
	  		tmpText = $.trim(tmpText)
	  		directResultArr[tmpText] = tmpHref
	  		
	  	}




	  	normal_links = document.querySelectorAll('#content_left div.result h3 a')
	  	console.log("normal links count:" + normal_links.length)
	  	var directLinksCnt = 0
	  	for(var i = 0; i < normal_links.length; i++) {
	  		// normal_links[i].href = direct_links[2 * i].href

	  		tmpHref = normal_links[i].href
	  		tmpText = normal_links[i].textContent
	  		tmpText = $.trim(tmpText)

	  		if(tmpText in directResultArr) {
	  			normal_links[i].href = directResultArr[tmpText]
	  			console.log(tmpText + "\t" + tmpHref)
	  			directLinksCnt++
	  		}
	  	}

	  	console.log("direct links count:" + directLinksCnt)
	  	$("div.nums").append($("<label style='color:green'>重定向已去除</label>"))
	});

}

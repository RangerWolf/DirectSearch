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
			
			console.log(tmpText + ":\t" + tmpHref)
			
			// 此处将搜索结果的标题以及最终url都放在key之中，
			// 这样在使用的时候就可以根据域名进行简单过滤，
			// 避免因为标题相同而造成错乱
			// 但是还是无法避免如果同一个域名下的搜索结果标题也相同的情况
			keyHref = ""
			if(tmpHref.startsWith("http://"))
				keyHref = tmpHref.replace("http://", "")
			else if(tmpHref.startsWith("https://"))
				keyHref = tmpHref.replace("https://", "")
			key = tmpText + "_" + keyHref

	  		directResultArr[key] = tmpHref
	  		
	  	}

		result_div = document.querySelectorAll('#content_left div.result')
		
	  	var directLinksCnt = 0
	  	for(var i = 0; i < result_div.length; i++) {
			
			originLink = result_div[i].querySelector("h3 a")
			showUrl    = result_div[i].querySelector(".c-showurl")
			showUrlTxt = ""
			// 暂时没有去解析内部的div.g里面的showurl
			if(showUrl != null && showUrl != undefined) {
				showUrlTxt = showUrl.text
			} 
			
			showUrlTxt = showUrlTxt.replace("...", "")
			showUrlTxt = $.trim(showUrlTxt)
			
			tmpHref = originLink.href
	  		tmpText = originLink.textContent
	  		tmpText = $.trim(tmpText)
			
			tmpKey = tmpText + "_" + showUrlTxt
			
			// 这里采用了一个不太高效的循环遍历，但是好在数据量很小
			for(var resultKey in directResultArr) {
				console.log("result key:" + resultKey)
				console.log("target key:" + tmpKey)

				if(resultKey.startsWith(tmpKey)) {					
					originLink.href = directResultArr[resultKey]
					console.log(tmpText + "\t" + tmpHref)
					directLinksCnt++
					break;
				}
			}
	  	}

	  	console.log("direct links count:" + directLinksCnt)
	  	$("div.nums").append($("<label style='color:green'>重定向已去除</label>"))
	});

}

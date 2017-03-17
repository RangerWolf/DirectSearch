var timerLoopTimes = 10

var timerForBaiduSearch;
var timerForBaiduSearchInterval = 500

CURRENT_URL = window.location.href;
timerForBaiduSearch = self.setInterval("rmRedirect()",timerForBaiduSearchInterval)

console.log("Enter baidu search...")

lastUrl = ""
title = ""

function rmRedirect() {
	cur_page = window.location.href
	cur_title = document.title
	
	links = document.querySelectorAll('#content_left div.result h3 a')
	
	
	if(links.length > 0 && (cur_title != title || cur_page != lastUrl) ) {
		lastUrl = cur_page
		console.log("!!! new title:" + cur_title)
		title = cur_title
		clean_title = title.replace("_百度搜索", "")
		console.log("!!! search wd:" + clean_title)
		replaceLink(clean_title)
	} 		
}

function clearLoopTimer(timer) {
	if(timer != null) {
		clearInterval(timer)
		timer = null
	}
}

function replaceLink(title) {

	page_link = window.location.href;


	page_host = page_link.split("?", 2)[0]
	page_param = page_link.split("?", 2)[1]

	arr = page_param.split("&")

	containsTn = false
	containsRn = false
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

		// 如果需要更换搜索词 （比如输入有错误的时候) 就使用系统自动提示的词
		if(tmp.startsWith("wd=") && needReplaceWd == true) {
			arr[i] = "wd=" + encodeURIComponent(newSearchWd)
		} 
		// 否则使用title
		if(tmp.startsWith("wd=") && needReplaceWd == false) {
			arr[i] = "wd=" + encodeURIComponent(title)
		}

		// 设置rn=50 加大获取到真实链接的概率
		if(tmp.startsWith("rn=")) {
			containsRn = true
			arr[i] = "rn=50"
		}

		if(tmp.startsWith("pn=")) {
			pnStr = tmp.replace("pn=", "")
			pnVal = parseInt(pnStr) - 10
			if(pnVal < 0)
				pnVal = 0
			arr[i] = "pn=" + pnVal
		}
	}
	ajax_page_link = page_host + "?" + arr.join("&")

	if(containsTn == false)
		ajax_page_link = ajax_page_link + "&tn=baidulocal"

	if(containsRn == false)
		ajax_page_link = ajax_page_link + "&rn=50"

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
			
			// 此处将搜索结果的标题以及最终url都放在key之中，
			// 这样在使用的时候就可以根据域名进行简单过滤，
			// 避免因为标题相同而造成错乱
			// 但是还是无法避免如果同一个域名下的搜索结果标题也相同的情况
			keyHref = ""
			if(tmpHref.startsWith("http://"))
				keyHref = tmpHref.replace("http://", "")
			else if(tmpHref.startsWith("https://"))
				keyHref = tmpHref.replace("https://", "")
			key = tmpText + "_" + decodeURI(keyHref)
	  		directResultArr[key] = tmpHref
	  		
	  	}

		result_div = document.querySelectorAll('#content_left div.c-container')

		
	  	var directLinksCnt = 0
	  	for(var i = 0; i < result_div.length; i++) {
			
			// 头部特殊标注的新闻 暂时无法处理 会误操作
	  		if($(result_div[i]).hasClass("xpath-log"))
	  			continue

			originLink = result_div[i].querySelector("h3 a")			
			showUrl    = result_div[i].querySelector(".c-showurl")
			showUrl_g  = result_div[i].querySelector(".g")

			showUrlTxt = ""
			// 暂时没有去解析内部的div.g里面的showurl
			if(showUrl != null && showUrl != undefined) {
				showUrlTxt = showUrl.text
				if(showUrlTxt == undefined || showUrlTxt == null) {
					showUrlTxt = showUrl.innerHTML
				}
			} else if(showUrl_g != null && showUrl_g != undefined) {
				showUrlTxt = showUrl_g.textContent
				if(showUrlTxt != null) {
					// Sample: www.iqiyi.com/yinyue/201...  - 百度快照
					showUrlTxt = showUrlTxt.replace("  - 百度快照", "")
				}
			}
			
			showUrlTxt = $.trim(showUrlTxt)
			if(showUrlTxt == null || showUrlTxt == undefined || showUrlTxt.length == 0) 
				continue
			
			if( showUrlTxt.indexOf("...") == -1 && showUrlTxt.indexOf("baidu.com") == -1 && showUrlTxt.indexOf(" ") == -1) {
				// 如果url没有被截断并且非百度自有域名
				// 2017-02-07 有的URL并不是真实的URL，比如：“www.xcar.com.cn 2017-02-07” 这种格式的就不能替换。 
				// 直接使用完整的url来替换
				//console.log("%%" + showUrlTxt)
				if(showUrlTxt.indexOf("https://") == -1 && showUrlTxt.indexOf("http://") == -1)
					originLink.href = "http://" + showUrlTxt
				else {
					originLink.href = showUrlTxt
				}
				// originLink.style.color = 'orange'
			} 
			else {
				// 其他url 还是使用ajax result 替换，去除部分链接中https前缀，避免替换失败
				showUrlTxt = showUrlTxt.replace(/\.\.\..*/, "").replace("https://","")
				showUrlTxt = $.trim(showUrlTxt)
				baiduDotComIndex = showUrlTxt.indexOf("baidu.com")
				if(baiduDotComIndex > 0 ) {
					showUrlTxt = showUrlTxt.substring(0, baiduDotComIndex + "baidu.com".length)
				}

				// console.log("originLink == null:" + (originLink == null))
				if(originLink == null) {
					console.log("i=" + i)
					continue;
				}
				tmpHref = originLink.href
				tmpText = originLink.textContent
				tmpText = $.trim(tmpText)
				
				tmpKey = tmpText + "_" + showUrlTxt
				console.log("tmpKey=" + tmpKey)
				
				// 这里采用了一个不太高效的循环遍历，但是好在数据量很小
				for(var resultKey in directResultArr) {
					// console.log("result key:" + resultKey)
					// console.log("target key:" + tmpKey)

					if(resultKey.startsWith(tmpKey)) {					
						originLink.href = directResultArr[resultKey]
						// originLink.style.color = 'red'
						directLinksCnt++
						break;
					}
				}
			}
			
			// 如果存在缩略图，则把缩略图里面的链接也替换掉
			thumbnail_link = result_div[i].querySelector("a.c-img6")
			if(thumbnail_link != null && thumbnail_link != undefined) {
				console.log("图片链接替换..." + originLink.href)
				thumbnail_link.href = originLink.href
			}
			
	  	}

	  	console.log("direct links count:" + directLinksCnt)
	  	$("div.nums").append($("<label style='color:green'>重定向已去除</label>"))
	});

}

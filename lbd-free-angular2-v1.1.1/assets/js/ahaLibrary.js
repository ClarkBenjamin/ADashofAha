// JavaScript Document

function addNextURL(responseJSON, requestURL){
	if(typeof responseJSON.pagination !== 'undefined'){
		console.log(JSON.stringify(responseJSON.pagination));	
		var currentPage = responseJSON.pagination.current_page;
		var totalPages = responseJSON.pagination.total_pages;
		if(currentPage != totalPages){
			currentPage ++;				
			if(requestURL.includes('page='))requestURL = requestURL.replace(/page=\d+/, "page="+currentPage);
			else requestURL+="&page="+currentPage;			
			responseJSON.pagination.next_page = requestURL;
		}
	}return responseJSON;
}
		
function aha(){
	
	this.accessToken = null;
	this.api_baseURL = "https://optum.aha.io";
	this.api_version = "v1";
	this.api_dataURL = this.api_baseURL + "/" + "api" + "/" + this.api_version;
	
	this.nextPage = function searchByURL(mURL){
		var mPromise = new Promise(function(resolve, reject) {
			if(mURL==null) reject({"Response Error" : "Malformed URL"});
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", mURL, true);		
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var responseJSON = JSON.parse(this.responseText);
					responseJSON = addNextURL(responseJSON, mURL);
					resolve(responseJSON);
				}else if(this.readyState == 4 && this.status != 200){
					reject({"Response Error" : this.status });
				}
			};xhttp.send();
			
		});	
		return mPromise;	
	};
	
	this.search = function searchByType(bundle){
		
		var accessToken = this.accessToken;
		var api_dataURL = this.api_dataURL;
		
		var mPromise = new Promise(function(resolve, reject) {
			if(accessToken==null) reject({"Response Error" : "Access token is undefined"});
			if(typeof bundle.type === "undefined")reject({"Response Error" : "Type is undefined"});
			
			var requestURL = api_dataURL + "/" + bundle.type;
			if(typeof bundle.id !== 'undefined')requestURL += "/" + bundle.id;
			requestURL += "?access_token="+accessToken;
			
			if(typeof bundle.query !== 'undefined'){
				bundle.query.forEach(function(param){
					for(key in param){
						requestURL += "&"+key+"="+param[key];
					}
				});								
			}
			
			//console.log("FINAL REQUEST: "+requestURL);

			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", requestURL, true);		
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var responseJSON = JSON.parse(this.responseText);
					responseJSON = addNextURL(responseJSON, requestURL);
					resolve(responseJSON);
				}else if(this.readyState == 4 && this.status != 200){
					reject({"Response Error" : this.status });
				}
			};xhttp.send();
		});
		
		return mPromise;	
	};
	
	this.setAccessToken = function setAccessTokenFunction(){
		var currentURL = window.location.href;
		if(currentURL.includes("#")){
			console.log(currentURL);
			var queryParams = (currentURL.split('#'))[1];
			queryParams = queryParams.split('+').join(' ');
			var mDecodedParams = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
			while (tokens = re.exec(queryParams)) {mDecodedParams[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);}
			
			if(typeof (mDecodedParams['access_token']) !== 'undefined'){
				console.log(mDecodedParams['access_token']); 
				this.accessToken = mDecodedParams['access_token'];	
			}
		}
	};
	
	this.setAccessToken();
}
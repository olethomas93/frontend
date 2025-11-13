/* eslint-disable */
// var docDomain = true;
// 	var displaytype = "xhtml";
// 	if ("webMIConfig" in window) {
// 		var config = window["webMIConfig"];
// 		if ("frame.documentdomain" in config)
// 			docDomain = config["frame.documentdomain"];
// 		if ("frame.displaytype" in config)
// 			displaytype = config["frame.displaytype"];
// 	}
// 	if (displaytype != "xhtml" && displaytype != "svg") {
// 		displaytype = "xhtml"
// 	}
// 	if (docDomain == true) {
// 		try {
// 			if (displaytype == "svg" && navigator.userAgent.indexOf("Firefox") > -1)
// 				throw false;

// 			var domain = location["hostname"]
// 				.split(".")
// 				.slice(-2);

// 			document.domain = domain.join(".");
// 		} catch (e) {
// 		}
// 	}


var docDomain=true;
var displaytype="xhtml";
if ("webMIConfig" in window) {
	var config = window["webMIConfig"];
	if("frame.documentdomain" in config)
		docDomain=config["frame.documentdomain"];
	if("frame.displaytype" in config)
		displaytype=config["frame.displaytype"];
}
if(displaytype != "xhtml" && displaytype != "svg") {
	displaytype="xhtml"
}
if(docDomain == true) {
	try {
		if (displaytype == "svg" && navigator.userAgent.indexOf("Firefox") > -1)
			throw false;

		var domain = location["hostname"]
				.split(".")
				.slice(-2);

		document.domain = domain.join(".");
	} catch (e) {}
}
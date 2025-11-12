/* eslint-disable */

// var root;
// 	var autofit = webMI.query.autofit;
// 	var scaleType = webMI.getConfig("frame.scaletype");
// 	var deviceType = webMI.query.forceDevice;
// 	var forceTouch = webMI.query.forceTouch;
// 	var ignoreTouch = webMI.query.ignoreTouch;
// 	var defaultdisplay = webMI.query.defaultdisplay;
// 	var defaulturl = webMI.query.defaulturl;
// 	var language = webMI.query.language;
// 	var isRootDisplay = webMI.display.isRoot();
// 	var isMobileTouchDevice = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(navigator.userAgent); // https://gist.github.com/dalethedeveloper/1503252
// 	var responsiveHandler = null;

// 	if (typeof autofit === "undefined")
// 		autofit = !isMobileTouchDevice;
// 	else
// 		autofit = autofit != "false" && autofit != "0";

// 	if (typeof deviceType != "undefined")
// 		webMI.setConfig("responsiveLite", {"config": {"forceDevice": deviceType}});

// 	if (forceTouch == "true")
// 		webMI.setConfig("responsiveLite", {"config": {"forceTouch": true}});
// 	else if (ignoreTouch == "true")
// 		webMI.setConfig("responsiveLite", {"config": {"ignoreTouch": true}});

// 	if (isRootDisplay) {
// 		setExtensions();
// 		webMI.setConfig("frame.enableautofit", autofit);
// 	}

// 	function setExtensions(callback) {
// 		if (isRootDisplay) {
// 			var bestIndexExtension = "";
// 			for (var i in project.extensions) {
// 				if (webMI.getRootExtensions().indexOf(i) > -1)
// 					break;

// 				var arr = project.extensions[i];
// 				webMI.setExtension(i, arr[0], arr[1]);
	
// 				if (bestIndexExtension != "index" && /(^|\.)index$/.test(i))
// 					bestIndexExtension = i;
// 			}
	
// 			if (bestIndexExtension != "" && webMI.getRootExtensions().indexOf("index") == -1) {
// 				var arr = project.extensions[bestIndexExtension];
// 				webMI.setExtension("index", arr[0], arr[1]);
// 			}
// 		}

// 		if (callback)
// 			callback();
// 	}

// 	function nodeNameIs(node, value) {
// 		if (!node)
// 			return false;

// 		return String(node.nodeName).toLowerCase() == value;
// 	}

// 	function ForeignObject(frameHandler, element) {
// 		this.frameHandler_ = frameHandler;
// 		this.element_ = element;
// 	}

// 	ForeignObject.prototype.isResponsible = function (element) {
// 		return this.element_ == element;
// 	}

// 	ForeignObject.prototype.setAttributes = function () {
// 		this.element_.style.left = this.left_ + "px";
// 		this.element_.style.top = this.top_ + "px";
// 		this.element_.style.width = this.width_ + "px";
// 		this.element_.style.height = this.height_ + "px";
// 		if (scaleType == "native")
// 			this.element_.style.fontSize = this.fontFactor_ + "em";
// 	}

// 	ForeignObject.prototype.setPosition = function (element, left, top, width, height, fontFactor) {
// 		if (!this.isResponsible(element))
// 			return;

// 		this.left_ = Math.round(left * 10) / 10;
// 		this.top_ = Math.round(top * 10) / 10;
// 		this.width_ = Math.round(width * 10) / 10;
// 		this.height_ = Math.round(height * 10) / 10;
// 		this.fontFactor_ = fontFactor;

// 		var parentFrameHandler = this.frameHandler_.parentFrameHandler_;
// 		if (parentFrameHandler)
// 			this.fontFactor_ /= parentFrameHandler.fontFactor_;

// 		this.setAttributes();
// 	}

// 	function FrameHandler(element, foreignObjectContainer, parentFrameHandler, parentForeignObject) {
// 		var self = this;
// 		this.element_ = element;
// 		this.foreignObjectContainer_ = foreignObjectContainer;
// 		this.parentFrameHandler_ = parentFrameHandler;
// 		this.foreignObjects_ = [];
// 		this.fontFactor_ = 1;
// 		this.subFrames_ = [];
// 		this.parentForeignObject_ = parentForeignObject;

// 		webMI.display.setForeignObjectHandler(element, {
// 			create: function (childElements) {
// 				var ret = document.createElement("div");
// 				ret.style.position = "absolute";
// 				ret.style.overflow = "hidden";

// 				self.foreignObjects_.push(new ForeignObject(self, ret));
// 				for (var i = 0; i < childElements.length; ++i)
// 					ret.appendChild(childElements[i]);

// 				return ret;
// 			}, destroy: function (element) {

// 				for (var i = 0; i < self.foreignObjects_.length; ++i) {
// 					if (self.foreignObjects_[i].isResponsible(element)) {
// 						self.foreignObjects_.splice(i, 1);
// 						break;
// 					}
// 				}

// 				for (var i = 0; i < self.subFrames_.length; ++i) {
// 					var subFrame = self.subFrames_[i];
// 					if (subFrame.parentForeignObject_ == element) {
// 						$FrameHandler(subFrame);
// 						self.subFrames_.splice(i--, 1);
// 					}
// 				}

// 				if (self.element_.parentElement.id == "popupcontent") {
// 					for (var i = 0; i < self.parentFrameHandler_.subFrames_.length; i++) {
// 						if (self.parentFrameHandler_.subFrames_[i] == self) {
// 							self.parentFrameHandler_.subFrames_.splice(i--, 1);
// 							$FrameHandler(self);
// 						}
// 					}
// 				}

// 			}, set: function (element, left, top, width, height, fontFactor) {
// 				self.fontFactor_ = fontFactor;
// 				for (var i = 0; i < self.foreignObjects_.length; ++i)
// 					self.foreignObjects_[i].setPosition(element, left, top, width, height, fontFactor);
// 			}, add: function (element) {
// 				self.foreignObjectContainer_.appendChild(element);
// 				handler("addedforeignobject", element);
// 			}, remove: function (element) {
// 				if (element.parentNode == self.foreignObjectContainer_) {
// 					self.foreignObjectContainer_.removeChild(element);
// 					handler("removedforeignobject", element);
// 				}
// 			}, register: function (element, childElements) {
// 				for (var i = 0; i < childElements.length; ++i) {
// 					var child = childElements[i];
// 					if (nodeNameIs(child, "iframe")) {
// 						var container = element.ownerDocument.createElement("div");
// 						container.style.position = "absolute";
// 						element.insertBefore(container, child);
// 						self.subFrames_.push(new FrameHandler(child, container, self, element));
// 					}
// 				}
// 			}, applyOffsetsToMatrix: function (matrix) {
// 				matrix.e += self.offsetLeft(true);
// 				matrix.f += self.offsetTop(true);
// 				return matrix;
// 			}
// 		});

// 		webMI.display.setOpenWindowHandler(element, function (value) {
// 			var scaleFactor = self.element_.contentWindow.webMI.gfx.getAbsoluteScaleFactor();
// 			var ret = handler("openwindow", value, self.offsetLeft(), self.offsetTop(), self.element_.clientWidth * scaleFactor, self.element_.clientHeight * scaleFactor);
// 			var foreignObjectContainer = self.foreignObjectContainer_;
// 			if ("getForeignObjectContainer" in ret)
// 				foreignObjectContainer = ret.getForeignObjectContainer();
// 			if ("getFrame" in ret)
// 				self.subFrames_.push(new FrameHandler(ret.getFrame(), foreignObjectContainer, self));
// 			return ret;
// 		});

// 		webMI.display.setShowPopupHandler(element, function (x, y, value) {
// 			return handler("showpopup", x + self.offsetLeft(), y + self.offsetTop(), value);
// 		});

// 	}

// 	function $FrameHandler(self) {
// 		if (webMI) {
// 			webMI.display.setForeignObjectHandler(self.element_, null);
// 			webMI.display.setOpenWindowHandler(self.element_, null);
// 			webMI.display.setShowPopupHandler(self.element_, null);
// 		}
// 	}

// 	FrameHandler.prototype.setSize = function (width, height) {
// 		this.width_ = width;
// 		this.height_ = height;

// 		this.element_.style.width = width + "px";
// 		this.element_.style.height = height + "px";
// 	}


// 	FrameHandler.prototype.offsetLeft = function (untilBody) {
// 		return webMI.gfx.getAbsoluteOffset("left", untilBody, this.element_);
// 	}

// 	FrameHandler.prototype.offsetTop = function (untilBody) {
// 		return webMI.gfx.getAbsoluteOffset("top", untilBody, this.element_);
// 	}

// 	var displaysJs;
// 	var mainFrameHandler;
// 	var remainingLoadEvents = 2;
// 	var loadEventLanguage = null;
// 	var handler = webMI.callExtension("index");

// 	function getDisplayCode(displayName, tree) {
// 		tree == undefined ? tree = displaysJs.menu : tree = tree;
// 		var displayCode;
// 		for (var itm in tree) {
// 			if (tree[itm].identifier == displayName)
// 				return tree[itm].display;
// 			else if (tree[itm].sub) {
// 				displayCode = getDisplayCode(displayName, tree[itm].sub);
// 				if (displayCode != undefined)
// 					break;
// 			}
// 		}
// 		return displayCode;
// 	}

// 	function getDisplayName(displayCode, tree) {
// 		tree == undefined ? tree = displaysJs.menu : tree = tree
// 		var displayName;
// 		for (var itm in tree) {
// 			if (tree[itm].display == displayCode)
// 				return tree[itm].identifier;
// 			else if (tree[itm].sub) {
// 				displayName = getDisplayName(displayCode, tree[itm].sub);
// 				if (displayName != undefined)
// 					break;
// 			}
// 		}
// 		return displayName;
// 	}

// 	function loadEvent(lng) {
// 		var mainframe = document.getElementById("mainframe");
// 		var foreignobjects = document.getElementById("foreignobjects");

// 		responsiveHandler = new ResponsiveHandler();

// 		if (!mainFrameHandler && mainframe)
// 			mainFrameHandler = new FrameHandler(mainframe, foreignobjects);
// 		if (!loadEventLanguage)
// 			loadEventLanguage = lng;

// 		if (--remainingLoadEvents > 0)
// 			return;

// 		var absolutePrefix = location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1);
// 		webMI.display.setURLPrefix(absolutePrefix + displaysJs["prefix"]);
// 		webMI.display.setURLPostfix(displaysJs["postfix"]);

// 		if (!this.isRootDisplay) {
// 			var url = defaulturl;
// 			if (webMI.isExternalHost(url, location) && isMobileTouchDevice) {
// 				var mainContainer = document.getElementById("mainContainer");
// 				mainContainer.classList.remove("mainContainerDefaultStyle");
// 			}
// 		}

// 		if (typeof url === "undefined") {
// 			if (typeof defaultdisplay !== "undefined") {
// 				for (var i = 0; i < displaysJs.menu.length; ++i) {
// 					if (displaysJs.menu[i].name == defaultdisplay)
// 						url = webMI.display.createURL(displaysJs.menu[i].display, webMI.query);
// 				}
// 			}
// 			if (typeof url === "undefined") {
// 				if ("default" in displaysJs)
// 					url = webMI.display.createURL(displaysJs["default"], webMI.query);
// 				else
// 					url = loadEventLanguage + "/default.htm";
// 			}
// 		}

// 		handler("loaded");

// 		function ResponsiveHandler() {
// 			var responsiveConf = webMI.getConfig("responsiveLite");
// 			// add support for previous responsive Lite implementation
// 			if (webMIConfig.responsiveLite === true) {
// 				this.active = true;
// 			} else if (typeof responsiveConf === "object") {
// 				this.active = responsiveConf.active;
// 			}
// 			this.config = responsiveConf.config;
// 		}

// 		ResponsiveHandler.prototype.getSwapUrl = function (portraitMode, display) {
// 			var swapUrl = "";
// 			var orientationConf = {};
// 			var portraitOrientationConf = {};
// 			var landscapeOrientationConf = {};
// 			var config = this.config;
// 			var parameters = {};

// 			try {
// 				parameters = JSON.parse(JSON.stringify(webMI.query));
// 			} catch (ex) {
// 			}

// 			if (display) {
// 				parameters.display = display;
// 			}

// 			portraitOrientationConf = config.portrait;
// 			portraitOrientationConf.mobileUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Portrait.Default"), parameters);
// 			portraitOrientationConf.tabletUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Portrait.Default"), parameters);
// 			landscapeOrientationConf = config.landscape;
// 			landscapeOrientationConf.mobileUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Landscape.Default"), parameters);
// 			landscapeOrientationConf.tabletUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Landscape.Default"), parameters);

// 			if (portraitMode) {
// 				if (portraitOrientationConf.active) {
// 					orientationConf = portraitOrientationConf;
// 				} else if (landscapeOrientationConf.active) {
// 					orientationConf = landscapeOrientationConf;
// 				}
// 			} else {
// 				if (landscapeOrientationConf.active) {
// 					orientationConf = landscapeOrientationConf;
// 				} else if (portraitOrientationConf.active) {
// 					orientationConf = portraitOrientationConf;
// 				}
// 			}

// 			orientationConf.desktopUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), parameters);

// 			if (orientationConf.active) {
// 				if (config.mobile) {
// 					swapUrl = orientationConf.mobileUrl;
// 				} else if (config.tablet) {
// 					swapUrl = orientationConf.tabletUrl;
// 				} else if (config.desktop) {
// 					swapUrl = orientationConf.desktopUrl;
// 				}

// 				if (webMI.getClientInfo().isDesktop && config.desktop) {
// 					swapUrl = orientationConf.desktopUrl;
// 				} else if (webMI.getClientInfo().isMobile && config.mobile) {
// 					swapUrl = orientationConf.mobileUrl;
// 				} else if (config.tablet) {
// 					swapUrl = orientationConf.tabletUrl;
// 				}

// 				return swapUrl;
// 			}
// 		};

// 		ResponsiveHandler.prototype.handleOrientationChange = function (firstLoad) {
// 			var swapUrl = "";
// 			var currentODisplay = "";
// 			var swapCurrentODisplay = "";
// 			var activeFrames = webMI.frame.getActiveFrames();

// 			if (!firstLoad) {
// 				for (var frame in activeFrames) {
// 					if (activeFrames[frame].attributes.framename && activeFrames[frame].attributes.framename.value == "content") {
// 						var displayURL = activeFrames[frame].contentWindow.location.pathname;

// 						currentODisplay = displayURL.substring(displayURL.lastIndexOf('/') + 1, displayURL.length);
// 						currentODisplay = currentODisplay.replace(".svg", "");
// 						break;
// 					}
// 				}

// 				if (currentODisplay != "") {
// 					if (currentODisplay.indexOf(".") >= 0) {
// 						if (currentODisplay.indexOf("Landscape") > -1 && responsiveHandler.config.portrait.active) {
// 							currentODisplay = currentODisplay.replace("Landscape", "Portrait");
// 						} else if (currentODisplay.indexOf("Portrait") > -1 && responsiveHandler.config.landscape.active) {
// 							currentODisplay = currentODisplay.replace("Portrait", "Landscape");
// 						}
// 					} else {
// 						swapCurrentODisplay = getDisplayName(currentODisplay);

// 						if (typeof swapCurrentODisplay !== "undefined") {
// 							if (swapCurrentODisplay.indexOf("Landscape") > -1 && responsiveHandler.config.portrait.active) {
// 								swapCurrentODisplay = swapCurrentODisplay.replace("Landscape", "Portrait");
// 							} else if (swapCurrentODisplay.indexOf("Portrait") > -1 && responsiveHandler.config.landscape.active) {
// 								swapCurrentODisplay = swapCurrentODisplay.replace("Portrait", "Landscape");
// 							}
// 						}

// 						swapCurrentODisplay = getDisplayCode(swapCurrentODisplay);

// 						if (typeof swapCurrentODisplay === "undefined") {
// 							currentODisplay = swapCurrentODisplay;
// 						}
// 					}
// 				}
// 			}

// 			swapUrl = this.getSwapUrl(!webMI.getClientInfo().isLandscape, currentODisplay);

// 			if (swapUrl) {
// 				url = swapUrl;
// 				mainframe.src = swapUrl;
// 			} else {
// 				mainframe.src = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), webMI.query);
// 				console.warn("Wrong responsiveLite config detected. Check config...");
// 			}
// 		}

// 		if (isRootDisplay && responsiveHandler.active) {
// 			if (displaysJs.default.indexOf(".") >= 0) {
// 				root = displaysJs.default.split(".")[0];
// 			} else {
// 				root = getDisplayName(displaysJs.default).split(".")[0];
// 			}

// 			window.addEventListener("orientationchange", function () {
// 				if (responsiveHandler.active) {
// 					responsiveHandler.handleOrientationChange();
// 				}
// 			}, false);

// 			responsiveHandler.handleOrientationChange(true);
// 		} else {
// 			mainframe.src = url
// 		}
// 	}

// 	var currentHostName = "";
// 	webMI.addEvent(webMI.data, 'serverstatechange', function (e) {
// 		currentHostName = location.protocol + "//" + e.active.currentHostName + "/";
// 	});

// 	function switchLanguage(lng) {

// 		language = lng;

// 		if (!(language in project.languages)) {
// 			if (typeof language === "string")
// 				console.error("Invalid language '" + lng + "'");
// 			language = navigator.language ? navigator.language : navigator.browserLanguage;
// 			if (!(language in project.languages)) {
// 				var pos = language.indexOf("-");
// 				if (pos > 0)
// 					language = language.substr(0, pos);
// 				if (!(language in project.languages)) {
// 					for (var i in project.languages) {
// 						language = i;
// 						break;
// 					}
// 				}
// 			}
// 		}

// 		var pjsOld = webMI.rootWindow.document.getElementById("projectjs");
// 		var pjsNew = webMI.rootWindow.document.createElement("script");

// 		pjsNew.onload = loadNewProjectJS;
// 		pjsNew.setAttribute("id", "projectjs");
// 		pjsNew.setAttribute("type", "text/javascript");
// 		pjsNew.setAttribute("data", Date.now());
// 		pjsNew.setAttribute("src", "project.js?language=" + language + "&ts=" + Date.now());
// 		pjsNew.innerHTML = null;

// 		pjsOld.parentNode.replaceChild(pjsNew, pjsOld);

// 		function loadNewProjectJS() {
// 			setExtensions(function () {

// 				setTimeout(function handleSwitchLanguage() {
// 					handler("switchedlanguage", language);

// 					var xmlHttp = function () {
// 						if (!/MSIE/.test(navigator.userAgent))
// 							return new XMLHttpRequest();
	
// 						// Don't use the XMLHttpRequest object for IE since the
// 						// overwritten object by webMI.js won't work in window.open()
	
// 						var xhrs = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
	
// 						for (var i = 0; i < xhrs.length; ++i) {
// 							try {
// 								return new ActiveXObject(xhrs[i]);
// 							} catch (e) {
// 							}
// 						}
	
// 						throw "This browser does not support XMLHttpRequest.";
// 					}();
	
// 					xmlHttp.open("GET", currentHostName + language + "/" + displaytype + "/displays.js", true);
// 					xmlHttp.onreadystatechange = function () {
// 						if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
// 							displaysJs = JSON.parse(xmlHttp.responseText);
// 							handler("loadeddisplaysjs", displaysJs);
// 							loadEvent(language);
// 						}
// 					};
// 					xmlHttp.send(null);
// 				}, 500);
// 			});
// 		}
// 	}

// 	webMI.addEvent(webMI.data, "statechange", function (state) {
// 		document.getElementById("errorscreen").style.display = state < 0 ? "block" : "none";
// 	});


// 	webMI.addOnload(function () {
// 		var mainframe = document.getElementById("mainframe");

// 		webMI.trigger.fire("com.atvise.windowLoaded", this);

// 		document.addEventListener("visibilitychange", function() {
// 			webMI.trigger.fire("com.atvise.visiblityChange", document.visibilityState == "visible" ? true : false);
// 		});

// 		if (autofit) {
// 			document.body.style.overflow = "hidden";
// 		}

// 		webMI.addEvent(mainframe, "load", function () {
// 			try {
// 				if (displaytype == "xhtml") {
// 					mainframe.contentDocument.body.style["overflow"] = "hidden";
// 				}
// 				var rootSvg = mainframe.contentDocument.documentElement;
// 				if (displaytype == "xhtml") {
// 					rootSvg = rootSvg.getElementsByTagName("svg")[0];
// 				}
// 				var rootSvgViewBox = mainframe.contentWindow.webMI.display.getInitialViewBox();

// 				var viewportwidth = rootSvgViewBox[2];
// 				rootSvg.style.height = "100%";
// 				rootSvg.style.width = "100%";

// 				if (isMobileTouchDevice) {
// 					if (!autofit && isRootDisplay) {
// 						var viewportMeta = document.getElementById('viewport-meta');
// 						viewportMeta.setAttribute("content", "width=" + viewportwidth + ", user-scalable=yes");
// 					}
// 				}
// 			} catch (ex) {
// 			}

// 			document.getElementById("loadingscreen").style.display = "none";
// 			handler("loadedmainframe", mainframe);
// 		});

// 		loadEvent();
// 		switchLanguage(language);
// 	});


var currentODisplay = "";
var root
var autofit = webMI.query.autofit || webMI.getConfig("frame.enableautofit") ;
var scaleType = webMI.getConfig("frame.scaletype");
var defaultdisplay = webMI.query.defaultdisplay;
var defaulturl = webMI.query.defaulturl;
var language = webMI.query.language;
var isRootDisplay = webMI.display.isRoot();
var isMobileTouchDevice = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(navigator.userAgent); // https://gist.github.com/dalethedeveloper/1503252

if (typeof autofit === "undefined")
	autofit = !isMobileTouchDevice;
else
	autofit = autofit != "false" && autofit != "0";

if (isRootDisplay) {
	var bestIndexExtension = "";
	for (var i in project.extensions) {
		var arr = project.extensions[i];
		webMI.setExtension(i, arr[0], arr[1]);

		if (bestIndexExtension != "index" && /(^|\.)index$/.test(i))
			bestIndexExtension = i;
	}

	if (bestIndexExtension != "") {
		var arr = project.extensions[bestIndexExtension];
		webMI.setExtension("index", arr[0], arr[1]);
	}

	webMI.setConfig("frame.enableautofit", autofit);
}

function nodeNameIs(node, value) {
	if (!node)
		return false;

	return String(node.nodeName).toLowerCase() == value;
}

function ForeignObject(frameHandler, element) {
	this.frameHandler_ = frameHandler;
	this.element_ = element;
}

ForeignObject.prototype.isResponsible = function(element) {
	return this.element_ == element;
}

ForeignObject.prototype.setAttributes = function() {
	this.element_.style.left = this.left_ + "px";
	this.element_.style.top = this.top_ + "px";
	this.element_.style.width = this.width_ + "px";
	this.element_.style.height = this.height_ + "px";
	if(scaleType == "native")
		this.element_.style.fontSize = this.fontFactor_ + "em";
}

ForeignObject.prototype.setPosition = function(element, left, top, width, height, fontFactor) {
	if (!this.isResponsible(element))
		return;

	this.left_ = Math.round(left*10)/10;
	this.top_ = Math.round(top*10)/10;
	this.width_ = Math.round(width*10)/10;
	this.height_ = Math.round(height*10)/10;
	this.fontFactor_ = fontFactor;

	var parentFrameHandler = this.frameHandler_.parentFrameHandler_;
	if (parentFrameHandler)
		this.fontFactor_ /= parentFrameHandler.fontFactor_;

	this.setAttributes();
}

function FrameHandler(element, foreignObjectContainer, parentFrameHandler, parentForeignObject) {
	var self = this;
	this.element_ = element;
	this.foreignObjectContainer_ = foreignObjectContainer;
	this.parentFrameHandler_ = parentFrameHandler;
	this.foreignObjects_ = [];
	this.fontFactor_ = 1;
	this.subFrames_ = [];
	this.parentForeignObject_ = parentForeignObject;

	webMI.display.setForeignObjectHandler(element, { create: function(childElements) {
		var ret = document.createElement("div");
		ret.style.position = "absolute";
		ret.style.overflow = "hidden";

		self.foreignObjects_.push(new ForeignObject(self, ret));
		for (var i = 0; i < childElements.length; ++i)
			ret.appendChild(childElements[i]);

		return ret;
	}, destroy: function(element) {

		for (var i = 0; i < self.foreignObjects_.length; ++i) {
			if (self.foreignObjects_[i].isResponsible(element)) {
				self.foreignObjects_.splice(i, 1);
				break;
			}
		}

		for (var i = 0; i < self.subFrames_.length; ++i) {
			var subFrame = self.subFrames_[i];
			if (subFrame.parentForeignObject_ == element) {
				$FrameHandler(subFrame);
				self.subFrames_.splice(i--, 1);
			}
		}

		if(self.element_.parentElement.id == "popupcontent"){
			for (var i = 0; i < self.parentFrameHandler_.subFrames_.length;i++){
				if(self.parentFrameHandler_.subFrames_[i] == self){
					self.parentFrameHandler_.subFrames_.splice(i--, 1);
					$FrameHandler(self);
				}
			}
		}

	}, set: function(element, left, top, width, height, fontFactor) {
		self.fontFactor_ = fontFactor;
		for (var i = 0; i < self.foreignObjects_.length; ++i)
			self.foreignObjects_[i].setPosition(element, left, top, width, height, fontFactor);
	}, add: function(element) {
		self.foreignObjectContainer_.appendChild(element);
		handler("addedforeignobject", element);
	}, remove: function(element) {
		if (element.parentNode == self.foreignObjectContainer_) {
			self.foreignObjectContainer_.removeChild(element);
			handler("removedforeignobject", element);
		}
	}, register: function(element, childElements) {
		for (var i = 0; i < childElements.length; ++i) {
			var child = childElements[i];
			if (nodeNameIs(child, "iframe")) {
				var container = element.ownerDocument.createElement("div");
				container.style.position = "absolute";
				element.insertBefore(container, child);
				self.subFrames_.push(new FrameHandler(child, container, self, element));
			}
		}
	}, applyOffsetsToMatrix: function(matrix) {
		matrix.e += self.offsetLeft(true);
		matrix.f += self.offsetTop(true);
		return matrix;
	}});

	webMI.display.setOpenWindowHandler(element, function(value) {
		var scaleFactor = self.element_.contentWindow.webMI.gfx.getAbsoluteScaleFactor();
		var ret = handler("openwindow", value, self.offsetLeft(), self.offsetTop(), self.element_.clientWidth*scaleFactor, self.element_.clientHeight*scaleFactor);
		var foreignObjectContainer = self.foreignObjectContainer_;
		if ("getForeignObjectContainer" in ret)
			foreignObjectContainer = ret.getForeignObjectContainer();
		if ("getFrame" in ret)
			self.subFrames_.push(new FrameHandler(ret.getFrame(), foreignObjectContainer, self));
		return ret;
	});

	webMI.display.setShowPopupHandler(element, function(x, y, value) {
		return handler("showpopup", x + self.offsetLeft(), y + self.offsetTop(), value);
	});

}

function $FrameHandler(self) {
	if (webMI) {
		webMI.display.setForeignObjectHandler(self.element_, null);
		webMI.display.setOpenWindowHandler(self.element_, null);
		webMI.display.setShowPopupHandler(self.element_, null);
	}
}

FrameHandler.prototype.setSize = function(width, height) {
	this.width_ = width;
	this.height_ = height;

	this.element_.style.width = width + "px";
	this.element_.style.height = height + "px";
}


FrameHandler.prototype.offsetLeft = function(untilBody) {
	return webMI.gfx.getAbsoluteOffset("left", untilBody, this.element_);
}

FrameHandler.prototype.offsetTop = function(untilBody) {
	return webMI.gfx.getAbsoluteOffset("top", untilBody, this.element_);
}

var displaysJs;
var mainFrameHandler;
var remainingLoadEvents = 2;
var loadEventLanguage = null;
var handler = webMI.callExtension("index");

function getDisplayCode(displayName, tree){
	tree == undefined ? tree = displaysJs.menu : tree = tree;
	var displayCode;
	for(var itm in tree)
	{
		if(tree[itm].identifier == displayName)
			return tree[itm].display;
		else if(tree[itm].sub)
		{
			displayCode = getDisplayCode(displayName, tree[itm].sub);
			if(displayCode != undefined)
				 break;
		}
	}
	return displayCode;
}

function getDisplayName(displayCode, tree){
	tree == undefined ? tree = displaysJs.menu : tree = tree
	var displayName;
	for(var itm in tree)
	{
		if(tree[itm].display == displayCode)
			return tree[itm].identifier;
		else if(tree[itm].sub)
		{
			displayName = getDisplayName(displayCode, tree[itm].sub);
			if(displayName != undefined)
				 break;
		}
	}
	return displayName;
}

function loadEvent(lng) {
	var mainframe = document.getElementById("mainframe");
	var foreignobjects = document.getElementById("foreignobjects");
	if (!mainFrameHandler && mainframe)
		mainFrameHandler = new FrameHandler(mainframe, foreignobjects);
	if (!loadEventLanguage)
		loadEventLanguage = lng;

	if (--remainingLoadEvents > 0)
		return;

	var absolutePrefix = location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1);
	webMI.display.setURLPrefix(absolutePrefix + displaysJs["prefix"]);
	webMI.display.setURLPostfix(displaysJs["postfix"]);

	if (!this.isRootDisplay){
		var url = defaulturl;
		if(webMI.isExternalHost(url, location) && isMobileTouchDevice){
			var mainContainer = document.getElementById("mainContainer");
			mainContainer.classList.remove("mainContainerDefaultStyle");
		}
	}

	if (typeof url === "undefined") {
		if (typeof defaultdisplay !== "undefined") {
			for (var i = 0; i < displaysJs.menu.length; ++i) {
				if (displaysJs.menu[i].name == defaultdisplay)
					url = webMI.display.createURL(displaysJs.menu[i].display, webMI.query);
			}
		}
		if (typeof url === "undefined") {
			if ("default" in displaysJs)
				url = webMI.display.createURL(displaysJs["default"], webMI.query);
			else
				url = loadEventLanguage + "/default.htm";
		}
	}
	
	if(isMobileTouchDevice){
		url += "_mobile";
	}

	console.log("URL:",url);



	handler("loaded");
	function responsiveHandler(){
		var swapUrl
		try {
			if (screen.orientation.angle == 0) {
				if (screen.width > 1200) {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), webMI.query);
				} else if (screen.width < 500) {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Portrait.Default"), webMI.query);
				} else {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Portrait.Default"), webMI.query);
				}
			} else if (screen.orientation.angle == 90 || screen.orientation.angle == 270) {
				if (screen.width > 1400) {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), webMI.query);
				} else if (screen.width < 850) {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Portrait.Default"), webMI.query);
				} else {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Landscape.Default"), webMI.query);
				}
			}
		}catch(ex){
			if(window.matchMedia("(orientation: portrait)").matches){
				if(screen.width > 1200){
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), webMI.query);
				} else if(screen.width < 500){
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Portrait.Default"), webMI.query);
				} else {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Portrait.Default"), webMI.query);
				}
			} else if(window.matchMedia("(orientation: landscape)").matches){
				if(screen.width > 1400){
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.Default"), webMI.query);
				} else if(screen.width < 700){
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.MOBILE.Portrait.Default"), webMI.query);
				} else {
					swapUrl = webMI.display.createURL(getDisplayCode(root + ".DISPLAYS.TABLET.Landscape.Default"), webMI.query);
				}
			}
		}
		
		if (typeof swapUrl !== "undefined")
			url = swapUrl;

		mainframe.src = url;
	}

	if(webMIConfig.responsiveLite){
		if(displaysJs.default.indexOf(".") >= 0){
			root = displaysJs.default.split(".")[0];
		} else
			root = getDisplayName(displaysJs.default).split(".")[0];

		window.addEventListener("orientationchange", function() {
			responsiveHandler();
			var activeFrames = webMI.frame.getActiveFrames();
			for(frame in activeFrames) {
				if (activeFrames[frame].attributes.framename && activeFrames[frame].attributes.framename.value == "content") {
					var displayURL = activeFrames[frame].contentWindow.location.pathname;
					currentODisplay = displayURL.substring(displayURL.lastIndexOf('/')+1,displayURL.length);
					currentODisplay = currentODisplay.replace(".svg", "");
					break;
				}
			}

			if(currentODisplay != "") {
				if(currentODisplay.indexOf(".") >= 0)
					currentODisplay = currentODisplay.indexOf("Landscape") > 0 ? currentODisplay.replace("Landscape", "Portrait") : currentODisplay.replace("Portrait", "Landscape");
				else {
					swapCurrentODisplay = getDisplayName(currentODisplay);
					if(typeof swapCurrentODisplay === "undefined")
						return;

					swapCurrentODisplay = swapCurrentODisplay.indexOf("Landscape") > 0 ? swapCurrentODisplay.replace("Landscape", "Portrait") : swapCurrentODisplay.replace("Portrait", "Landscape");
					swapCurrentODisplay = getDisplayCode(swapCurrentODisplay);

					if(typeof swapCurrentODisplay === "undefined")
						return;

					currentODisplay = swapCurrentODisplay;
				}	
			}
		}, false);
		responsiveHandler();
	} else {
		// mainframe.src = url
	}
}

var currentHostName = "";
webMI.addEvent(webMI.data, 'serverstatechange', function(e) {
	currentHostName = location.protocol + "//" + e.active.currentHostName + "/";
});

function switchLanguage(lng) {
	language = lng;
	if (!(language in project.languages)) {
		if (typeof language === "string")
			console.error("Invalid language '" + lng + "'");
		language = navigator.language ? navigator.language : navigator.browserLanguage;
		if (!(language in project.languages)) {
			var pos = language.indexOf("-");
			if (pos > 0)
				language = language.substr(0, pos);
			if (!(language in project.languages)) {
				for (var i in project.languages) {
					language = i;
					break;
				}
			}
		}
	}

	handler("switchedlanguage", language);

	var xmlHttp = function() {
		if (!/MSIE/.test(navigator.userAgent))
			return new XMLHttpRequest();

		// Don't use the XMLHttpRequest object for IE since the
		// overwritten object by webMI.js won't work in window.open()

		var xhrs = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];

		for (var i = 0; i < xhrs.length; ++i) {
			try {
				return new ActiveXObject(xhrs[i]);
			} catch (e) {
			}
		}

		throw "This browser does not support XMLHttpRequest.";
	}();

	xmlHttp.open("GET", currentHostName + language + "/" + displaytype + "/displays.js", true);
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			displaysJs = JSON.parse(xmlHttp.responseText);
			handler("loadeddisplaysjs", displaysJs);
			loadEvent(language);
		}
	};
	xmlHttp.send(null);
}

webMI.addEvent(webMI.data, "statechange", function(state) {
	document.getElementById("errorscreen").style.display = state < 0 ? "block" : "none";
});


webMI.addOnload(function() {
	var mainframe = document.getElementById("mainframe");

	if (!this.isRootDisplay) {
		webMI.trigger.fire("com.atvise.subWindowLoaded", this);
	}

	//if(autofit){
		document.body.style.overflow = "auto";
	//}

	webMI.addEvent(mainframe, "load", function() {

		try {
			if(displaytype == "xhtml"){
				mainframe.contentDocument.body.style["overflow"] = "hidden";
			}
			var rootSvg = mainframe.contentDocument.documentElement;
			if(displaytype=="xhtml"){
				rootSvg = rootSvg.getElementsByTagName("svg")[0];
			}
			var rootSvgViewBox = mainframe.contentWindow.webMI.display.getInitialViewBox();

			var viewportwidth = rootSvgViewBox[2];
			rootSvg.style.height = "100%";
			rootSvg.style.width = "100%";

			if (isMobileTouchDevice) {
				if (!autofit && isRootDisplay){
					var viewportMeta = document.getElementById('viewport-meta');
					viewportMeta.setAttribute("content", "width=" + viewportwidth + ", user-scalable=yes");
				}
			}
			if(typeof currentODisplay != "undefined" && currentODisplay != "")
				webMI.display.openDisplay(currentODisplay);
		}catch(ex){}
		document.getElementById("loadingscreen").style.display = "none";
		handler("loadedmainframe", mainframe);
	});

	loadEvent();
	switchLanguage(language);
});
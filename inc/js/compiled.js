/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (typeof define === 'function' && define.amd) { 
 // AMD. Register as an anonymous module. 
 define(['jquery'], factory); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this._handlers={},this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._widths=[],this._invalidated={},this._pipe=[],this._drag={time:null,target:null,pointer:null,stage:{start:null,current:null},direction:null},this._states={current:{},tags:{initializing:["busy"],animating:["busy"],dragging:["interacting"]}},a.each(["onResize","onThrottledResize"],a.proxy(function(b,c){this._handlers[c]=a.proxy(this[c],this)},this)),a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a.charAt(0).toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Workers,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}e.Defaults={items:3,loop:!1,center:!1,rewind:!1,checkVisibility:!0,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,fallbackEasing:"swing",slideTransition:"",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",refreshClass:"owl-refresh",loadedClass:"owl-loaded",loadingClass:"owl-loading",rtlClass:"owl-rtl",responsiveClass:"owl-responsive",dragClass:"owl-drag",itemClass:"owl-item",stageClass:"owl-stage",stageOuterClass:"owl-stage-outer",grabClass:"owl-grab"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Type={Event:"event",State:"state"},e.Plugins={},e.Workers=[{filter:["width","settings"],run:function(){this._width=this.$element.width()}},{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){this.$stage.children(".cloned").remove()}},{filter:["width","items","settings"],run:function(a){var b=this.settings.margin||"",c=!this.settings.autoWidth,d=this.settings.rtl,e={width:"auto","margin-left":d?b:"","margin-right":d?"":b};!c&&this.$stage.children().css(e),a.css=e}},{filter:["width","items","settings"],run:function(a){var b=(this.width()/this.settings.items).toFixed(3)-this.settings.margin,c=null,d=this._items.length,e=!this.settings.autoWidth,f=[];for(a.items={merge:!1,width:b};d--;)c=this._mergers[d],c=this.settings.mergeFit&&Math.min(c,this.settings.items)||c,a.items.merge=c>1||a.items.merge,f[d]=e?b*c:this._items[d].width();this._widths=f}},{filter:["items","settings"],run:function(){var b=[],c=this._items,d=this.settings,e=Math.max(2*d.items,4),f=2*Math.ceil(c.length/2),g=d.loop&&c.length?d.rewind?e:Math.max(e,f):0,h="",i="";for(g/=2;g>0;)b.push(this.normalize(b.length/2,!0)),h+=c[b[b.length-1]][0].outerHTML,b.push(this.normalize(c.length-1-(b.length-1)/2,!0)),i=c[b[b.length-1]][0].outerHTML+i,g-=1;this._clones=b,a(h).addClass("cloned").appendTo(this.$stage),a(i).addClass("cloned").prependTo(this.$stage)}},{filter:["width","items","settings"],run:function(){for(var a=this.settings.rtl?1:-1,b=this._clones.length+this._items.length,c=-1,d=0,e=0,f=[];++c<b;)d=f[c-1]||0,e=this._widths[this.relative(c)]+this.settings.margin,f.push(d+e*a);this._coordinates=f}},{filter:["width","items","settings"],run:function(){var a=this.settings.stagePadding,b=this._coordinates,c={width:Math.ceil(Math.abs(b[b.length-1]))+2*a,"padding-left":a||"","padding-right":a||""};this.$stage.css(c)}},{filter:["width","items","settings"],run:function(a){var b=this._coordinates.length,c=!this.settings.autoWidth,d=this.$stage.children();if(c&&a.items.merge)for(;b--;)a.css.width=this._widths[this.relative(b)],d.eq(b).css(a.css);else c&&(a.css.width=a.items.width,d.css(a.css))}},{filter:["items"],run:function(){this._coordinates.length<1&&this.$stage.removeAttr("style")}},{filter:["width","items","settings"],run:function(a){a.current=a.current?this.$stage.children().index(a.current):0,a.current=Math.max(this.minimum(),Math.min(this.maximum(),a.current)),this.reset(a.current)}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;c<d;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children(".active").removeClass("active"),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass("active"),this.$stage.children(".center").removeClass("center"),this.settings.center&&this.$stage.children().eq(this.current()).addClass("center")}}],e.prototype.initializeStage=function(){this.$stage=this.$element.find("."+this.settings.stageClass),this.$stage.length||(this.$element.addClass(this.options.loadingClass),this.$stage=a("<"+this.settings.stageElement+">",{class:this.settings.stageClass}).wrap(a("<div/>",{class:this.settings.stageOuterClass})),this.$element.append(this.$stage.parent()))},e.prototype.initializeItems=function(){var b=this.$element.find(".owl-item");if(b.length)return this._items=b.get().map(function(b){return a(b)}),this._mergers=this._items.map(function(){return 1}),void this.refresh();this.replace(this.$element.children().not(this.$stage.parent())),this.isVisible()?this.refresh():this.invalidate("width"),this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)},e.prototype.initialize=function(){if(this.enter("initializing"),this.trigger("initialize"),this.$element.toggleClass(this.settings.rtlClass,this.settings.rtl),this.settings.autoWidth&&!this.is("pre-loading")){var a,b,c;a=this.$element.find("img"),b=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,c=this.$element.children(b).width(),a.length&&c<=0&&this.preloadAutoWidthImages(a)}this.initializeStage(),this.initializeItems(),this.registerEventHandlers(),this.leave("initializing"),this.trigger("initialized")},e.prototype.isVisible=function(){return!this.settings.checkVisibility||this.$element.is(":visible")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){a<=b&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),"function"==typeof e.stagePadding&&(e.stagePadding=e.stagePadding()),delete e.responsive,e.responsiveClass&&this.$element.attr("class",this.$element.attr("class").replace(new RegExp("("+this.options.responsiveClass+"-)\\S+\\s","g"),"$1"+d))):e=a.extend({},this.options),this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}})},e.prototype.optionsLogic=function(){this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.options.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};b<c;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={},!this.is("valid")&&this.enter("valid")},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){this.enter("refreshing"),this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$element.addClass(this.options.refreshClass),this.update(),this.$element.removeClass(this.options.refreshClass),this.leave("refreshing"),this.trigger("refreshed")},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this._handlers.onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return!!this._items.length&&(this._width!==this.$element.width()&&(!!this.isVisible()&&(this.enter("resizing"),this.trigger("resize").isDefaultPrevented()?(this.leave("resizing"),!1):(this.invalidate("width"),this.refresh(),this.leave("resizing"),void this.trigger("resized")))))},e.prototype.registerEventHandlers=function(){a.support.transition&&this.$stage.on(a.support.transition.end+".owl.core",a.proxy(this.onTransitionEnd,this)),!1!==this.settings.responsive&&this.on(b,"resize",this._handlers.onThrottledResize),this.settings.mouseDrag&&(this.$element.addClass(this.options.dragClass),this.$stage.on("mousedown.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("dragstart.owl.core selectstart.owl.core",function(){return!1})),this.settings.touchDrag&&(this.$stage.on("touchstart.owl.core",a.proxy(this.onDragStart,this)),this.$stage.on("touchcancel.owl.core",a.proxy(this.onDragEnd,this)))},e.prototype.onDragStart=function(b){var d=null;3!==b.which&&(a.support.transform?(d=this.$stage.css("transform").replace(/.*\(|\)| /g,"").split(","),d={x:d[16===d.length?12:4],y:d[16===d.length?13:5]}):(d=this.$stage.position(),d={x:this.settings.rtl?d.left+this.$stage.width()-this.width()+this.settings.margin:d.left,y:d.top}),this.is("animating")&&(a.support.transform?this.animate(d.x):this.$stage.stop(),this.invalidate("position")),this.$element.toggleClass(this.options.grabClass,"mousedown"===b.type),this.speed(0),this._drag.time=(new Date).getTime(),this._drag.target=a(b.target),this._drag.stage.start=d,this._drag.stage.current=d,this._drag.pointer=this.pointer(b),a(c).on("mouseup.owl.core touchend.owl.core",a.proxy(this.onDragEnd,this)),a(c).one("mousemove.owl.core touchmove.owl.core",a.proxy(function(b){var d=this.difference(this._drag.pointer,this.pointer(b));a(c).on("mousemove.owl.core touchmove.owl.core",a.proxy(this.onDragMove,this)),Math.abs(d.x)<Math.abs(d.y)&&this.is("valid")||(b.preventDefault(),this.enter("dragging"),this.trigger("drag"))},this)))},e.prototype.onDragMove=function(a){var b=null,c=null,d=null,e=this.difference(this._drag.pointer,this.pointer(a)),f=this.difference(this._drag.stage.start,e);this.is("dragging")&&(a.preventDefault(),this.settings.loop?(b=this.coordinates(this.minimum()),c=this.coordinates(this.maximum()+1)-b,f.x=((f.x-b)%c+c)%c+b):(b=this.settings.rtl?this.coordinates(this.maximum()):this.coordinates(this.minimum()),c=this.settings.rtl?this.coordinates(this.minimum()):this.coordinates(this.maximum()),d=this.settings.pullDrag?-1*e.x/5:0,f.x=Math.max(Math.min(f.x,b+d),c+d)),this._drag.stage.current=f,this.animate(f.x))},e.prototype.onDragEnd=function(b){var d=this.difference(this._drag.pointer,this.pointer(b)),e=this._drag.stage.current,f=d.x>0^this.settings.rtl?"left":"right";a(c).off(".owl.core"),this.$element.removeClass(this.options.grabClass),(0!==d.x&&this.is("dragging")||!this.is("valid"))&&(this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(this.closest(e.x,0!==d.x?f:this._drag.direction)),this.invalidate("position"),this.update(),this._drag.direction=f,(Math.abs(d.x)>3||(new Date).getTime()-this._drag.time>300)&&this._drag.target.one("click.owl.core",function(){return!1})),this.is("dragging")&&(this.leave("dragging"),this.trigger("dragged"))},e.prototype.closest=function(b,c){var e=-1,f=30,g=this.width(),h=this.coordinates();return this.settings.freeDrag||a.each(h,a.proxy(function(a,i){return"left"===c&&b>i-f&&b<i+f?e=a:"right"===c&&b>i-g-f&&b<i-g+f?e=a+1:this.op(b,"<",i)&&this.op(b,">",h[a+1]!==d?h[a+1]:i-g)&&(e="left"===c?a+1:a),-1===e},this)),this.settings.loop||(this.op(b,">",h[this.minimum()])?e=b=this.minimum():this.op(b,"<",h[this.maximum()])&&(e=b=this.maximum())),e},e.prototype.animate=function(b){var c=this.speed()>0;this.is("animating")&&this.onTransitionEnd(),c&&(this.enter("animating"),this.trigger("translate")),a.support.transform3d&&a.support.transition?this.$stage.css({transform:"translate3d("+b+"px,0px,0px)",transition:this.speed()/1e3+"s"+(this.settings.slideTransition?" "+this.settings.slideTransition:"")}):c?this.$stage.animate({left:b+"px"},this.speed(),this.settings.fallbackEasing,a.proxy(this.onTransitionEnd,this)):this.$stage.css({left:b+"px"})},e.prototype.is=function(a){return this._states.current[a]&&this._states.current[a]>0},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(b){return"string"===a.type(b)&&(this._invalidated[b]=!0,this.is("valid")&&this.leave("valid")),a.map(this._invalidated,function(a,b){return b})},e.prototype.reset=function(a){(a=this.normalize(a))!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(a,b){var c=this._items.length,e=b?0:this._clones.length;return!this.isNumeric(a)||c<1?a=d:(a<0||a>=c+e)&&(a=((a-e/2)%c+c)%c+e/2),a},e.prototype.relative=function(a){return a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=this.settings,f=this._coordinates.length;if(e.loop)f=this._clones.length/2+this._items.length-1;else if(e.autoWidth||e.merge){if(b=this._items.length)for(c=this._items[--b].width(),d=this.$element.width();b--&&!((c+=this._items[b].width()+this.settings.margin)>d););f=b+1}else f=e.center?this._items.length-1:this._items.length-e.items;return a&&(f-=this._clones.length/2),Math.max(f,0)},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2==0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c,e=1,f=b-1;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(this.settings.rtl&&(e=-1,f=b+1),c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[f]||0))/2*e):c=this._coordinates[f]||0,c=Math.ceil(c))},e.prototype.duration=function(a,b,c){return 0===c?0:Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(a,b){var c=this.current(),d=null,e=a-this.relative(c),f=(e>0)-(e<0),g=this._items.length,h=this.minimum(),i=this.maximum();this.settings.loop?(!this.settings.rewind&&Math.abs(e)>g/2&&(e+=-1*f*g),a=c+e,(d=((a-h)%g+g)%g+h)!==a&&d-e<=i&&d-e>0&&(c=d-e,a=d,this.reset(c))):this.settings.rewind?(i+=1,a=(a%i+i)%i):a=Math.max(h,Math.min(i,a)),this.speed(this.duration(c,a,b)),this.current(a),this.isVisible()&&this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.onTransitionEnd=function(a){if(a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0)))return!1;this.leave("animating"),this.trigger("translated")},e.prototype.viewport=function(){var d;return this.options.responsiveBaseElement!==b?d=a(this.options.responsiveBaseElement).width():b.innerWidth?d=b.innerWidth:c.documentElement&&c.documentElement.clientWidth?d=c.documentElement.clientWidth:console.warn("Can not detect viewport width."),d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)},this)),this.reset(this.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(b,c){var e=this.relative(this._current);c=c===d?this._items.length:this.normalize(c,!0),b=b instanceof jQuery?b:a(b),this.trigger("add",{content:b,position:c}),b=this.prepare(b),0===this._items.length||c===this._items.length?(0===this._items.length&&this.$stage.append(b),0!==this._items.length&&this._items[c-1].after(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)):(this._items[c].before(b),this._items.splice(c,0,b),this._mergers.splice(c,0,1*b.find("[data-merge]").addBack("[data-merge]").attr("data-merge")||1)),this._items[e]&&this.reset(this._items[e].index()),this.invalidate("items"),this.trigger("added",{content:b,position:c})},e.prototype.remove=function(a){(a=this.normalize(a,!0))!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.preloadAutoWidthImages=function(b){b.each(a.proxy(function(b,c){this.enter("pre-loading"),c=a(c),a(new Image).one("load",a.proxy(function(a){c.attr("src",a.target.src),c.css("opacity",1),this.leave("pre-loading"),!this.is("pre-loading")&&!this.is("initializing")&&this.refresh()},this)).attr("src",c.attr("src")||c.attr("data-src")||c.attr("data-src-retina"))},this))},e.prototype.destroy=function(){this.$element.off(".owl.core"),this.$stage.off(".owl.core"),a(c).off(".owl.core"),!1!==this.settings.responsive&&(b.clearTimeout(this.resizeTimer),this.off(b,"resize",this._handlers.onThrottledResize));for(var d in this._plugins)this._plugins[d].destroy();this.$stage.children(".cloned").remove(),this.$stage.unwrap(),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$stage.remove(),this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class",this.$element.attr("class").replace(new RegExp(this.options.responsiveClass+"-\\S+\\s","g"),"")).removeData("owl.carousel")},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:a<c;case">":return d?a<c:a>c;case">=":return d?a<=c:a>=c;case"<=":return d?a>=c:a<=c}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d,f,g){var h={item:{count:this._items.length,index:this.current()}},i=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),j=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},h,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(j)}),this.register({type:e.Type.Event,name:b}),this.$element.trigger(j),this.settings&&"function"==typeof this.settings[i]&&this.settings[i].call(this,j)),j},e.prototype.enter=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]===d&&(this._states.current[b]=0),this._states.current[b]++},this))},e.prototype.leave=function(b){a.each([b].concat(this._states.tags[b]||[]),a.proxy(function(a,b){this._states.current[b]--},this))},e.prototype.register=function(b){if(b.type===e.Type.Event){if(a.event.special[b.name]||(a.event.special[b.name]={}),!a.event.special[b.name].owl){var c=a.event.special[b.name]._default;a.event.special[b.name]._default=function(a){return!c||!c.apply||a.namespace&&-1!==a.namespace.indexOf("owl")?a.namespace&&a.namespace.indexOf("owl")>-1:c.apply(this,arguments)},a.event.special[b.name].owl=!0}}else b.type===e.Type.State&&(this._states.tags[b.name]?this._states.tags[b.name]=this._states.tags[b.name].concat(b.tags):this._states.tags[b.name]=b.tags,this._states.tags[b.name]=a.grep(this._states.tags[b.name],a.proxy(function(c,d){return a.inArray(c,this._states.tags[b.name])===d},this)))},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.pointer=function(a){var c={x:null,y:null};return a=a.originalEvent||a||b.event,a=a.touches&&a.touches.length?a.touches[0]:a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:a,a.pageX?(c.x=a.pageX,c.y=a.pageY):(c.x=a.clientX,c.y=a.clientY),c},e.prototype.isNumeric=function(a){return!isNaN(parseFloat(a))},e.prototype.difference=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},a.fn.owlCarousel=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),f=d.data("owl.carousel");f||(f=new e(this,"object"==typeof b&&b),d.data("owl.carousel",f),a.each(["next","prev","to","destroy","refresh","replace","add","remove"],function(b,c){f.register({type:e.Type.Event,name:c}),f.$element.on(c+".owl.carousel.core",a.proxy(function(a){a.namespace&&a.relatedTarget!==this&&(this.suppress([c]),f[c].apply(this,[].slice.call(arguments,1)),this.release([c]))},f))})),"string"==typeof b&&"_"!==b.charAt(0)&&f[b].apply(f,c)})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._interval=null,this._visible=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoRefresh&&this.watch()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={autoRefresh:!0,autoRefreshInterval:500},e.prototype.watch=function(){this._interval||(this._visible=this._core.isVisible(),this._interval=b.setInterval(a.proxy(this.refresh,this),this._core.settings.autoRefreshInterval))},e.prototype.refresh=function(){this._core.isVisible()!==this._visible&&(this._visible=!this._visible,this._core.$element.toggleClass("owl-hidden",!this._visible),this._visible&&this._core.invalidate("width")&&this._core.refresh())},e.prototype.destroy=function(){var a,c;b.clearInterval(this._interval);for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoRefresh=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel resized.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type)){var c=this._core.settings,e=c.center&&Math.ceil(c.items/2)||c.items,f=c.center&&-1*e||0,g=(b.property&&b.property.value!==d?b.property.value:this._core.current())+f,h=this._core.clones().length,i=a.proxy(function(a,b){this.load(b)},this);for(c.lazyLoadEager>0&&(e+=c.lazyLoadEager,c.loop&&(g-=c.lazyLoadEager,e++));f++<e;)this.load(h/2+this._core.relative(g)),h&&a.each(this._core.clones(this._core.relative(g)),i),g++}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers)};e.Defaults={lazyLoad:!1,lazyLoadEager:0},e.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src")||f.attr("data-srcset");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):f.is("source")?f.one("load.owl.lazy",a.proxy(function(){this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("srcset",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":'url("'+g+'")',opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(c){this._core=c,this._previousHeight=null,this._handlers={"initialized.owl.carousel refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&"position"===a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){a.namespace&&this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass).index()===this._core.current()&&this.update()},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._intervalId=null;var d=this;a(b).on("load",function(){d._core.settings.autoHeight&&d.update()}),a(b).resize(function(){d._core.settings.autoHeight&&(null!=d._intervalId&&clearTimeout(d._intervalId),d._intervalId=setTimeout(function(){d.update()},250))})};e.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},e.prototype.update=function(){var b=this._core._current,c=b+this._core.settings.items,d=this._core.settings.lazyLoad,e=this._core.$stage.children().toArray().slice(b,c),f=[],g=0;a.each(e,function(b,c){f.push(a(c).height())}),g=Math.max.apply(null,f),g<=1&&d&&this._previousHeight&&(g=this._previousHeight),this._previousHeight=g,this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)},e.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._videos={},this._playing=null,this._handlers={"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.register({type:"state",name:"playing",tags:["interacting"]})},this),"resize.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.video&&this.isInFullScreen()&&a.preventDefault()},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._core.is("resizing")&&this._core.$stage.find(".cloned .owl-video-frame").remove()},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"===a.property.name&&this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};e.Defaults={video:!1,videoHeight:!1,videoWidth:!1},e.prototype.fetch=function(a,b){var c=function(){return a.attr("data-vimeo-id")?"vimeo":a.attr("data-vzaar-id")?"vzaar":"youtube"}(),d=a.attr("data-vimeo-id")||a.attr("data-youtube-id")||a.attr("data-vzaar-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else if(d[3].indexOf("vimeo")>-1)c="vimeo";else{if(!(d[3].indexOf("vzaar")>-1))throw new Error("Video URL not supported.");c="vzaar"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},e.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?"width:"+c.width+"px;height:"+c.height+"px;":"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(c){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?a("<div/>",{class:"owl-video-tn "+j,srcType:c}):a("<div/>",{class:"owl-video-tn",style:"opacity:1;background-image:url("+c+")"}),b.after(d),b.after(e)};if(b.wrap(a("<div/>",{class:"owl-video-wrapper",style:g})),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length)return l(h.attr(i)),h.remove(),!1;"youtube"===c.type?(f="//img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type?a.ajax({type:"GET",url:"//vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}):"vzaar"===c.type&&a.ajax({type:"GET",url:"//vzaar.com/api/videos/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a.framegrab_url,l(f)}})},e.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null,this._core.leave("playing"),this._core.trigger("stopped",null,"video")},e.prototype.play=function(b){var c,d=a(b.target),e=d.closest("."+this._core.settings.itemClass),f=this._videos[e.attr("data-video")],g=f.width||"100%",h=f.height||this._core.$stage.height();this._playing||(this._core.enter("playing"),this._core.trigger("play",null,"video"),e=this._core.items(this._core.relative(e.index())),this._core.reset(e.index()),c=a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'),c.attr("height",h),c.attr("width",g),"youtube"===f.type?c.attr("src","//www.youtube.com/embed/"+f.id+"?autoplay=1&rel=0&v="+f.id):"vimeo"===f.type?c.attr("src","//player.vimeo.com/video/"+f.id+"?autoplay=1"):"vzaar"===f.type&&c.attr("src","//view.vzaar.com/"+f.id+"/player?autoplay=true"),a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")),this._playing=e.addClass("owl-video-playing"))},e.prototype.isInFullScreen=function(){var b=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return b&&a(b).parent().hasClass("owl-video-frame")},e.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){a.namespace&&(this.swapping="translated"==a.type)},this),"translate.owl.carousel":a.proxy(function(a){a.namespace&&this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,
animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&a.support.animation&&a.support.transition){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.one(a.support.animation.end,c).css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g)),f&&e.one(a.support.animation.end,c).addClass("animated owl-animated-in").addClass(f))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.onTransitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this._core=b,this._call=null,this._time=0,this._timeout=0,this._paused=!0,this._handlers={"changed.owl.carousel":a.proxy(function(a){a.namespace&&"settings"===a.property.name?this._core.settings.autoplay?this.play():this.stop():a.namespace&&"position"===a.property.name&&this._paused&&(this._time=0)},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.autoplay&&this.play()},this),"play.owl.autoplay":a.proxy(function(a,b,c){a.namespace&&this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(a){a.namespace&&this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.play()},this),"touchstart.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this._core.is("rotating")&&this.pause()},this),"touchend.owl.core":a.proxy(function(){this._core.settings.autoplayHoverPause&&this.play()},this)},this._core.$element.on(this._handlers),this._core.options=a.extend({},e.Defaults,this._core.options)};e.Defaults={autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1},e.prototype._next=function(d){this._call=b.setTimeout(a.proxy(this._next,this,d),this._timeout*(Math.round(this.read()/this._timeout)+1)-this.read()),this._core.is("interacting")||c.hidden||this._core.next(d||this._core.settings.autoplaySpeed)},e.prototype.read=function(){return(new Date).getTime()-this._time},e.prototype.play=function(c,d){var e;this._core.is("rotating")||this._core.enter("rotating"),c=c||this._core.settings.autoplayTimeout,e=Math.min(this._time%(this._timeout||c),c),this._paused?(this._time=this.read(),this._paused=!1):b.clearTimeout(this._call),this._time+=this.read()%c-e,this._timeout=c,this._call=b.setTimeout(a.proxy(this._next,this,d),c-e)},e.prototype.stop=function(){this._core.is("rotating")&&(this._time=0,this._paused=!0,b.clearTimeout(this._call),this._core.leave("rotating"))},e.prototype.pause=function(){this._core.is("rotating")&&!this._paused&&(this._time=this.read(),this._paused=!0,b.clearTimeout(this._call))},e.prototype.destroy=function(){var a,b;this.stop();for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(b){this._core=b,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){b.namespace&&this._core.settings.dotsData&&this._templates.push('<div class="'+this._core.settings.dotClass+'">'+a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot")+"</div>")},this),"added.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,0,this._templates.pop())},this),"remove.owl.carousel":a.proxy(function(a){a.namespace&&this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"changed.owl.carousel":a.proxy(function(a){a.namespace&&"position"==a.property.name&&this.draw()},this),"initialized.owl.carousel":a.proxy(function(a){a.namespace&&!this._initialized&&(this._core.trigger("initialize",null,"navigation"),this.initialize(),this.update(),this.draw(),this._initialized=!0,this._core.trigger("initialized",null,"navigation"))},this),"refreshed.owl.carousel":a.proxy(function(a){a.namespace&&this._initialized&&(this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation"))},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers)};e.Defaults={nav:!1,navText:['<span aria-label="Previous">&#x2039;</span>','<span aria-label="Next">&#x203a;</span>'],navSpeed:!1,navElement:'button type="button" role="presentation"',navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotsData:!1,dotsSpeed:!1,dotsContainer:!1},e.prototype.initialize=function(){var b,c=this._core.settings;this._controls.$relative=(c.navContainer?a(c.navContainer):a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"),this._controls.$previous=a("<"+c.navElement+">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click",a.proxy(function(a){this.prev(c.navSpeed)},this)),this._controls.$next=a("<"+c.navElement+">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click",a.proxy(function(a){this.next(c.navSpeed)},this)),c.dotsData||(this._templates=[a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),this._controls.$absolute=(c.dotsContainer?a(c.dotsContainer):a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"),this._controls.$absolute.on("click","button",a.proxy(function(b){var d=a(b.target).parent().is(this._controls.$absolute)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(d,c.dotsSpeed)},this));for(b in this._overrides)this._core[b]=a.proxy(this[b],this)},e.prototype.destroy=function(){var a,b,c,d,e;e=this._core.settings;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)"$relative"===b&&e.navContainer?this._controls[b].html(""):this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},e.prototype.update=function(){var a,b,c,d=this._core.clones().length/2,e=d+this._core.items().length,f=this._core.maximum(!0),g=this._core.settings,h=g.center||g.autoWidth||g.dotsData?1:g.dotsEach||g.items;if("page"!==g.slideBy&&(g.slideBy=Math.min(g.slideBy,g.items)),g.dots||"page"==g.slideBy)for(this._pages=[],a=d,b=0,c=0;a<e;a++){if(b>=h||0===b){if(this._pages.push({start:Math.min(f,a-d),end:a-d+h-1}),Math.min(f,a-d)===f)break;b=0,++c}b+=this._core.mergers(this._core.relative(a))}},e.prototype.draw=function(){var b,c=this._core.settings,d=this._core.items().length<=c.items,e=this._core.relative(this._core.current()),f=c.loop||c.rewind;this._controls.$relative.toggleClass("disabled",!c.nav||d),c.nav&&(this._controls.$previous.toggleClass("disabled",!f&&e<=this._core.minimum(!0)),this._controls.$next.toggleClass("disabled",!f&&e>=this._core.maximum(!0))),this._controls.$absolute.toggleClass("disabled",!c.dots||d),c.dots&&(b=this._pages.length-this._controls.$absolute.children().length,c.dotsData&&0!==b?this._controls.$absolute.html(this._templates.join("")):b>0?this._controls.$absolute.append(new Array(b+1).join(this._templates[0])):b<0&&this._controls.$absolute.children().slice(b).remove(),this._controls.$absolute.find(".active").removeClass("active"),this._controls.$absolute.children().eq(a.inArray(this.current(),this._pages)).addClass("active"))},e.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotsData?1:c.dotsEach||c.items)}},e.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,a.proxy(function(a,c){return a.start<=b&&a.end>=b},this)).pop()},e.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},e.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},e.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},e.prototype.to=function(b,c,d){var e;!d&&this._pages.length?(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c)):a.proxy(this._overrides.to,this._core)(b,c)},a.fn.owlCarousel.Constructor.Plugins.Navigation=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){"use strict";var e=function(c){this._core=c,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(c){c.namespace&&"URLHash"===this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){if(b.namespace){var c=a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");if(!c)return;this._hashes[c]=b.content}},this),"changed.owl.carousel":a.proxy(function(c){if(c.namespace&&"position"===c.property.name){var d=this._core.items(this._core.relative(this._core.current())),e=a.map(this._hashes,function(a,b){return a===d?b:null}).join();if(!e||b.location.hash.slice(1)===e)return;b.location.hash=e}},this)},this._core.options=a.extend({},e.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(a){var c=b.location.hash.substring(1),e=this._core.$stage.children(),f=this._hashes[c]&&e.index(this._hashes[c]);f!==d&&f!==this._core.current()&&this._core.to(this._core.relative(f),!1,!0)},this))};e.Defaults={URLhashListener:!1},e.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=e}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){function e(b,c){var e=!1,f=b.charAt(0).toUpperCase()+b.slice(1);return a.each((b+" "+h.join(f+" ")+f).split(" "),function(a,b){if(g[b]!==d)return e=!c||b,!1}),e}function f(a){return e(a,!0)}var g=a("<support>").get(0).style,h="Webkit Moz O ms".split(" "),i={transition:{end:{WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}},animation:{end:{WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd",animation:"animationend"}}},j={csstransforms:function(){return!!e("transform")},csstransforms3d:function(){return!!e("perspective")},csstransitions:function(){return!!e("transition")},cssanimations:function(){return!!e("animation")}};j.csstransitions()&&(a.support.transition=new String(f("transition")),a.support.transition.end=i.transition.end[a.support.transition]),j.cssanimations()&&(a.support.animation=new String(f("animation")),a.support.animation.end=i.animation.end[a.support.animation]),j.csstransforms()&&(a.support.transform=new String(f("transform")),a.support.transform3d=j.csstransforms3d())}(window.Zepto||window.jQuery,window,document);
/**!
 * MixItUp v2.1.11
 *
 * @copyright Copyright 2015 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   Commercial use requires a commercial license.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 *            Non-commercial use permitted under terms of CC-BY-NC license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */

(function($, undf) {
  "use strict";

  /**
   * MixItUp Constructor Function
   * @constructor
   * @extends jQuery
   */

  $.MixItUp = function() {
    var self = this;

    self._execAction("_constructor", 0);

    $.extend(self, {
      /* Public Properties
			---------------------------------------------------------------------- */

      selectors: {
        target: ".mix",
        filter: ".filter",
        sort: ".sort"
      },

      animation: {
        enable: true,
        effects: "fade scale",
        duration: 600,
        easing: "ease",
        perspectiveDistance: "3000",
        perspectiveOrigin: "50% 50%",
        queue: true,
        queueLimit: 1,
        animateChangeLayout: false,
        animateResizeContainer: true,
        animateResizeTargets: false,
        staggerSequence: false,
        reverseOut: false
      },

      callbacks: {
        onMixLoad: false,
        onMixStart: false,
        onMixBusy: false,
        onMixEnd: false,
        onMixFail: false,
        _user: false
      },

      controls: {
        enable: true,
        live: false,
        toggleFilterButtons: false,
        toggleLogic: "or",
        activeClass: "active"
      },

      layout: {
        display: "inline-block",
        containerClassFail: "fail"
      },

      load: {
        filter: "all",
        sort: false
      },

      /* Private Properties
			---------------------------------------------------------------------- */

      _$body: null,
      _$container: null,
      _$targets: null,
      _$parent: null,
      _$sortButtons: null,
      _$filterButtons: null,

      _suckMode: false,
      _mixing: false,
      _sorting: false,
      _clicking: false,
      _loading: true,
      _changingLayout: false,
      _changingClass: false,
      _changingDisplay: false,

      _origOrder: [],
      _startOrder: [],
      _newOrder: [],
      _activeFilter: null,
      _toggleArray: [],
      _toggleString: "",
      _activeSort: "default:asc",
      _newSort: null,
      _startHeight: null,
      _newHeight: null,
      _incPadding: true,
      _newDisplay: null,
      _newClass: null,
      _targetsBound: 0,
      _targetsDone: 0,
      _queue: [],

      _$show: $(),
      _$hide: $()
    });

    self._execAction("_constructor", 1);
  };

  /**
   * MixItUp Prototype
   * @override
   */

  $.MixItUp.prototype = {
    constructor: $.MixItUp,

    /* Static Properties
		---------------------------------------------------------------------- */

    _instances: {},
    _handled: {
      _filter: {},
      _sort: {}
    },
    _bound: {
      _filter: {},
      _sort: {}
    },
    _actions: {},
    _filters: {},

    /* Static Methods
		---------------------------------------------------------------------- */

    /**
     * Extend
     * @since 2.1.0
     * @param {object} new properties/methods
     * @extends {object} prototype
     */

    extend: function(extension) {
      for (var key in extension) {
        $.MixItUp.prototype[key] = extension[key];
      }
    },

    /**
     * Add Action
     * @since 2.1.0
     * @param {string} hook name
     * @param {string} namespace
     * @param {function} function to execute
     * @param {number} priority
     * @extends {object} $.MixItUp.prototype._actions
     */

    addAction: function(hook, name, func, priority) {
      $.MixItUp.prototype._addHook("_actions", hook, name, func, priority);
    },

    /**
     * Add Filter
     * @since 2.1.0
     * @param {string} hook name
     * @param {string} namespace
     * @param {function} function to execute
     * @param {number} priority
     * @extends {object} $.MixItUp.prototype._filters
     */

    addFilter: function(hook, name, func, priority) {
      $.MixItUp.prototype._addHook("_filters", hook, name, func, priority);
    },

    /**
     * Add Hook
     * @since 2.1.0
     * @param {string} type of hook
     * @param {string} hook name
     * @param {function} function to execute
     * @param {number} priority
     * @extends {object} $.MixItUp.prototype._filters
     */

    _addHook: function(type, hook, name, func, priority) {
      var collection = $.MixItUp.prototype[type],
        obj = {};

      priority = priority === 1 || priority === "post" ? "post" : "pre";

      obj[hook] = {};
      obj[hook][priority] = {};
      obj[hook][priority][name] = func;

      $.extend(true, collection, obj);
    },

    /* Private Methods
		---------------------------------------------------------------------- */

    /**
     * Initialise
     * @since 2.0.0
     * @param {object} domNode
     * @param {object} config
     */

    _init: function(domNode, config) {
      var self = this;

      self._execAction("_init", 0, arguments);

      config && $.extend(true, self, config);

      self._$body = $("body");
      self._domNode = domNode;
      self._$container = $(domNode);
      self._$container.addClass(self.layout.containerClass);
      self._id = domNode.id;

      self._platformDetect();

      self._brake = self._getPrefixedCSS("transition", "none");

      self._refresh(true);

      self._$parent = self._$targets.parent().length
        ? self._$targets.parent()
        : self._$container;

      if (self.load.sort) {
        self._newSort = self._parseSort(self.load.sort);
        self._newSortString = self.load.sort;
        self._activeSort = self.load.sort;
        self._sort();
        self._printSort();
      }

      self._activeFilter =
        self.load.filter === "all"
          ? self.selectors.target
          : self.load.filter === "none"
          ? ""
          : self.load.filter;

      self.controls.enable && self._bindHandlers();

      if (self.controls.toggleFilterButtons) {
        self._buildToggleArray();

        for (var i = 0; i < self._toggleArray.length; i++) {
          self._updateControls(
            { filter: self._toggleArray[i], sort: self._activeSort },
            true
          );
        }
      } else if (self.controls.enable) {
        self._updateControls({
          filter: self._activeFilter,
          sort: self._activeSort
        });
      }

      self._filter();

      self._init = true;

      self._$container.data("mixItUp", self);

      self._execAction("_init", 1, arguments);

      self._buildState();

      self._$targets.css(self._brake);

      self._goMix(self.animation.enable);
    },

    /**
     * Platform Detect
     * @since 2.0.0
     */

    _platformDetect: function() {
      var self = this,
        vendorsTrans = ["Webkit", "Moz", "O", "ms"],
        vendorsRAF = ["webkit", "moz"],
        chrome = window.navigator.appVersion.match(/Chrome\/(\d+)\./) || false,
        ff = typeof InstallTrigger !== "undefined",
        prefix = function(el) {
          for (var i = 0; i < vendorsTrans.length; i++) {
            if (vendorsTrans[i] + "Transition" in el.style) {
              return {
                prefix: "-" + vendorsTrans[i].toLowerCase() + "-",
                vendor: vendorsTrans[i]
              };
            }
          }
          return "transition" in el.style ? "" : false;
        },
        transPrefix = prefix(self._domNode);

      self._execAction("_platformDetect", 0);

      self._chrome = chrome ? parseInt(chrome[1], 10) : false;
      self._ff = ff
        ? parseInt(window.navigator.userAgent.match(/rv:([^)]+)\)/)[1])
        : false;
      self._prefix = transPrefix.prefix;
      self._vendor = transPrefix.vendor;
      self._suckMode = window.atob && self._prefix ? false : true;

      self._suckMode && (self.animation.enable = false);
      self._ff && self._ff <= 4 && (self.animation.enable = false);

      /* Polyfills
			---------------------------------------------------------------------- */

      /**
       * window.requestAnimationFrame
       */

      for (
        var x = 0;
        x < vendorsRAF.length && !window.requestAnimationFrame;
        x++
      ) {
        window.requestAnimationFrame =
          window[vendorsRAF[x] + "RequestAnimationFrame"];
      }

      /**
       * Object.getPrototypeOf
       */

      if (typeof Object.getPrototypeOf !== "function") {
        if (typeof "test".__proto__ === "object") {
          Object.getPrototypeOf = function(object) {
            return object.__proto__;
          };
        } else {
          Object.getPrototypeOf = function(object) {
            return object.constructor.prototype;
          };
        }
      }

      /**
       * Element.nextElementSibling
       */

      if (self._domNode.nextElementSibling === undf) {
        Object.defineProperty(Element.prototype, "nextElementSibling", {
          get: function() {
            var el = this.nextSibling;

            while (el) {
              if (el.nodeType === 1) {
                return el;
              }
              el = el.nextSibling;
            }
            return null;
          }
        });
      }

      self._execAction("_platformDetect", 1);
    },

    /**
     * Refresh
     * @since 2.0.0
     * @param {boolean} init
     * @param {boolean} force
     */

    _refresh: function(init, force) {
      var self = this;

      self._execAction("_refresh", 0, arguments);

      self._$targets = self._$container.find(self.selectors.target);

      for (var i = 0; i < self._$targets.length; i++) {
        var target = self._$targets[i];

        if (target.dataset === undf || force) {
          target.dataset = {};

          for (var j = 0; j < target.attributes.length; j++) {
            var attr = target.attributes[j],
              name = attr.name,
              val = attr.value;

            if (name.indexOf("data-") > -1) {
              var dataName = self._helpers._camelCase(
                name.substring(5, name.length)
              );
              target.dataset[dataName] = val;
            }
          }
        }

        if (target.mixParent === undf) {
          target.mixParent = self._id;
        }
      }

      if (
        (self._$targets.length && init) ||
        (!self._origOrder.length && self._$targets.length)
      ) {
        self._origOrder = [];

        for (var i = 0; i < self._$targets.length; i++) {
          var target = self._$targets[i];

          self._origOrder.push(target);
        }
      }

      self._execAction("_refresh", 1, arguments);
    },

    /**
     * Bind Handlers
     * @since 2.0.0
     */

    _bindHandlers: function() {
      var self = this,
        filters = $.MixItUp.prototype._bound._filter,
        sorts = $.MixItUp.prototype._bound._sort;

      self._execAction("_bindHandlers", 0);

      if (self.controls.live) {
        self._$body
          .on("click.mixItUp." + self._id, self.selectors.sort, function() {
            self._processClick($(this), "sort");
          })
          .on("click.mixItUp." + self._id, self.selectors.filter, function() {
            self._processClick($(this), "filter");
          });
      } else {
        self._$sortButtons = $(self.selectors.sort);
        self._$filterButtons = $(self.selectors.filter);

        self._$sortButtons.on("click.mixItUp." + self._id, function() {
          self._processClick($(this), "sort");
        });

        self._$filterButtons.on("click.mixItUp." + self._id, function() {
          self._processClick($(this), "filter");
        });
      }

      filters[self.selectors.filter] =
        filters[self.selectors.filter] === undf
          ? 1
          : filters[self.selectors.filter] + 1;
      sorts[self.selectors.sort] =
        sorts[self.selectors.sort] === undf
          ? 1
          : sorts[self.selectors.sort] + 1;

      self._execAction("_bindHandlers", 1);
    },

    /**
     * Process Click
     * @since 2.0.0
     * @param {object} $button
     * @param {string} type
     */

    _processClick: function($button, type) {
      var self = this,
        trackClick = function($button, type, off) {
          var proto = $.MixItUp.prototype;

          proto._handled["_" + type][self.selectors[type]] =
            proto._handled["_" + type][self.selectors[type]] === undf
              ? 1
              : proto._handled["_" + type][self.selectors[type]] + 1;

          if (
            proto._handled["_" + type][self.selectors[type]] ===
            proto._bound["_" + type][self.selectors[type]]
          ) {
            $button[(off ? "remove" : "add") + "Class"](
              self.controls.activeClass
            );
            delete proto._handled["_" + type][self.selectors[type]];
          }
        };

      self._execAction("_processClick", 0, arguments);

      if (
        !self._mixing ||
        (self.animation.queue && self._queue.length < self.animation.queueLimit)
      ) {
        self._clicking = true;

        if (type === "sort") {
          var sort = $button.attr("data-sort");

          if (
            !$button.hasClass(self.controls.activeClass) ||
            sort.indexOf("random") > -1
          ) {
            $(self.selectors.sort).removeClass(self.controls.activeClass);
            trackClick($button, type);
            self.sort(sort);
          }
        }

        if (type === "filter") {
          var filter = $button.attr("data-filter"),
            ndx,
            seperator = self.controls.toggleLogic === "or" ? "," : "";

          if (!self.controls.toggleFilterButtons) {
            if (!$button.hasClass(self.controls.activeClass)) {
              $(self.selectors.filter).removeClass(self.controls.activeClass);
              trackClick($button, type);
              self.filter(filter);
            }
          } else {
            self._buildToggleArray();

            if (!$button.hasClass(self.controls.activeClass)) {
              trackClick($button, type);

              self._toggleArray.push(filter);
            } else {
              trackClick($button, type, true);
              ndx = self._toggleArray.indexOf(filter);
              self._toggleArray.splice(ndx, 1);
            }

            self._toggleArray = $.grep(self._toggleArray, function(n) {
              return n;
            });

            self._toggleString = self._toggleArray.join(seperator);

            self.filter(self._toggleString);
          }
        }

        self._execAction("_processClick", 1, arguments);
      } else {
        if (typeof self.callbacks.onMixBusy === "function") {
          self.callbacks.onMixBusy.call(self._domNode, self._state, self);
        }
        self._execAction("_processClickBusy", 1, arguments);
      }
    },

    /**
     * Build Toggle Array
     * @since 2.0.0
     */

    _buildToggleArray: function() {
      var self = this,
        activeFilter = self._activeFilter.replace(/\s/g, "");

      self._execAction("_buildToggleArray", 0, arguments);

      if (self.controls.toggleLogic === "or") {
        self._toggleArray = activeFilter.split(",");
      } else {
        self._toggleArray = activeFilter.split(".");

        !self._toggleArray[0] && self._toggleArray.shift();

        for (var i = 0, filter; (filter = self._toggleArray[i]); i++) {
          self._toggleArray[i] = "." + filter;
        }
      }

      self._execAction("_buildToggleArray", 1, arguments);
    },

    /**
     * Update Controls
     * @since 2.0.0
     * @param {object} command
     * @param {boolean} multi
     */

    _updateControls: function(command, multi) {
      var self = this,
        output = {
          filter: command.filter,
          sort: command.sort
        },
        update = function($el, filter) {
          try {
            multi &&
            type === "filter" &&
            !(output.filter === "none" || output.filter === "")
              ? $el.filter(filter).addClass(self.controls.activeClass)
              : $el
                  .removeClass(self.controls.activeClass)
                  .filter(filter)
                  .addClass(self.controls.activeClass);
          } catch (e) {}
        },
        type = "filter",
        $el = null;

      self._execAction("_updateControls", 0, arguments);

      command.filter === undf && (output.filter = self._activeFilter);
      command.sort === undf && (output.sort = self._activeSort);
      output.filter === self.selectors.target && (output.filter = "all");

      for (var i = 0; i < 2; i++) {
        $el = self.controls.live
          ? $(self.selectors[type])
          : self["_$" + type + "Buttons"];
        $el && update($el, "[data-" + type + '="' + output[type] + '"]');
        type = "sort";
      }

      self._execAction("_updateControls", 1, arguments);
    },

    /**
     * Filter (private)
     * @since 2.0.0
     */

    _filter: function() {
      var self = this;

      self._execAction("_filter", 0);

      for (var i = 0; i < self._$targets.length; i++) {
        var $target = $(self._$targets[i]);

        if ($target.is(self._activeFilter)) {
          self._$show = self._$show.add($target);
        } else {
          self._$hide = self._$hide.add($target);
        }
      }

      self._execAction("_filter", 1);
    },

    /**
     * Sort (private)
     * @since 2.0.0
     */

    _sort: function() {
      var self = this,
        arrayShuffle = function(oldArray) {
          var newArray = oldArray.slice(),
            len = newArray.length,
            i = len;

          while (i--) {
            var p = parseInt(Math.random() * len);
            var t = newArray[i];
            newArray[i] = newArray[p];
            newArray[p] = t;
          }
          return newArray;
        };

      self._execAction("_sort", 0);

      self._startOrder = [];

      for (var i = 0; i < self._$targets.length; i++) {
        var target = self._$targets[i];

        self._startOrder.push(target);
      }

      switch (self._newSort[0].sortBy) {
        case "default":
          self._newOrder = self._origOrder;
          break;
        case "random":
          self._newOrder = arrayShuffle(self._startOrder);
          break;
        case "custom":
          self._newOrder = self._newSort[0].order;
          break;
        default:
          self._newOrder = self._startOrder.concat().sort(function(a, b) {
            return self._compare(a, b);
          });
      }

      self._execAction("_sort", 1);
    },

    /**
     * Compare Algorithm
     * @since 2.0.0
     * @param {string|number} a
     * @param {string|number} b
     * @param {number} depth (recursion)
     * @return {number}
     */

    _compare: function(a, b, depth) {
      depth = depth ? depth : 0;

      var self = this,
        order = self._newSort[depth].order,
        getData = function(el) {
          return el.dataset[self._newSort[depth].sortBy] || 0;
        },
        attrA = isNaN(getData(a) * 1)
          ? getData(a).toLowerCase()
          : getData(a) * 1,
        attrB = isNaN(getData(b) * 1)
          ? getData(b).toLowerCase()
          : getData(b) * 1;

      if (attrA < attrB) return order === "asc" ? -1 : 1;
      if (attrA > attrB) return order === "asc" ? 1 : -1;
      if (attrA === attrB && self._newSort.length > depth + 1)
        return self._compare(a, b, depth + 1);

      return 0;
    },

    /**
     * Print Sort
     * @since 2.0.0
     * @param {boolean} reset
     */

    _printSort: function(reset) {
      var self = this,
        order = reset ? self._startOrder : self._newOrder,
        targets = self._$parent[0].querySelectorAll(self.selectors.target),
        nextSibling = targets.length
          ? targets[targets.length - 1].nextElementSibling
          : null,
        frag = document.createDocumentFragment();

      self._execAction("_printSort", 0, arguments);

      for (var i = 0; i < targets.length; i++) {
        var target = targets[i],
          whiteSpace = target.nextSibling;

        if (target.style.position === "absolute") continue;

        if (whiteSpace && whiteSpace.nodeName === "#text") {
          self._$parent[0].removeChild(whiteSpace);
        }

        self._$parent[0].removeChild(target);
      }

      for (var i = 0; i < order.length; i++) {
        var el = order[i];

        if (
          self._newSort[0].sortBy === "default" &&
          self._newSort[0].order === "desc" &&
          !reset
        ) {
          var firstChild = frag.firstChild;
          frag.insertBefore(el, firstChild);
          frag.insertBefore(document.createTextNode(" "), el);
        } else {
          frag.appendChild(el);
          frag.appendChild(document.createTextNode(" "));
        }
      }

      nextSibling
        ? self._$parent[0].insertBefore(frag, nextSibling)
        : self._$parent[0].appendChild(frag);

      self._execAction("_printSort", 1, arguments);
    },

    /**
     * Parse Sort
     * @since 2.0.0
     * @param {string} sortString
     * @return {array} newSort
     */

    _parseSort: function(sortString) {
      var self = this,
        rules =
          typeof sortString === "string" ? sortString.split(" ") : [sortString],
        newSort = [];

      for (var i = 0; i < rules.length; i++) {
        var rule =
            typeof sortString === "string"
              ? rules[i].split(":")
              : ["custom", rules[i]],
          ruleObj = {
            sortBy: self._helpers._camelCase(rule[0]),
            order: rule[1] || "asc"
          };

        newSort.push(ruleObj);

        if (ruleObj.sortBy === "default" || ruleObj.sortBy === "random") break;
      }

      return self._execFilter("_parseSort", newSort, arguments);
    },

    /**
     * Parse Effects
     * @since 2.0.0
     * @return {object} effects
     */

    _parseEffects: function() {
      var self = this,
        effects = {
          opacity: "",
          transformIn: "",
          transformOut: "",
          filter: ""
        },
        parse = function(effect, extract, reverse) {
          if (self.animation.effects.indexOf(effect) > -1) {
            if (extract) {
              var propIndex = self.animation.effects.indexOf(effect + "(");
              if (propIndex > -1) {
                var str = self.animation.effects.substring(propIndex),
                  match = /\(([^)]+)\)/.exec(str),
                  val = match[1];

                return { val: val };
              }
            }
            return true;
          } else {
            return false;
          }
        },
        negate = function(value, invert) {
          if (invert) {
            return value.charAt(0) === "-"
              ? value.substr(1, value.length)
              : "-" + value;
          } else {
            return value;
          }
        },
        buildTransform = function(key, invert) {
          var transforms = [
            ["scale", ".01"],
            ["translateX", "20px"],
            ["translateY", "20px"],
            ["translateZ", "20px"],
            ["rotateX", "90deg"],
            ["rotateY", "90deg"],
            ["rotateZ", "180deg"]
          ];

          for (var i = 0; i < transforms.length; i++) {
            var prop = transforms[i][0],
              def = transforms[i][1],
              inverted = invert && prop !== "scale";

            effects[key] += parse(prop)
              ? prop +
                "(" +
                negate(parse(prop, true).val || def, inverted) +
                ") "
              : "";
          }
        };

      effects.opacity = parse("fade") ? parse("fade", true).val || "0" : "1";

      buildTransform("transformIn");

      self.animation.reverseOut
        ? buildTransform("transformOut", true)
        : (effects.transformOut = effects.transformIn);

      effects.transition = {};

      effects.transition = self._getPrefixedCSS(
        "transition",
        "all " +
          self.animation.duration +
          "ms " +
          self.animation.easing +
          ", opacity " +
          self.animation.duration +
          "ms linear"
      );

      self.animation.stagger = parse("stagger") ? true : false;
      self.animation.staggerDuration = parseInt(
        parse("stagger")
          ? parse("stagger", true).val
            ? parse("stagger", true).val
            : 100
          : 100
      );

      return self._execFilter("_parseEffects", effects);
    },

    /**
     * Build State
     * @since 2.0.0
     * @param {boolean} future
     * @return {object} futureState
     */

    _buildState: function(future) {
      var self = this,
        state = {};

      self._execAction("_buildState", 0);

      state = {
        activeFilter: self._activeFilter === "" ? "none" : self._activeFilter,
        activeSort:
          future && self._newSortString
            ? self._newSortString
            : self._activeSort,
        fail: !self._$show.length && self._activeFilter !== "",
        $targets: self._$targets,
        $show: self._$show,
        $hide: self._$hide,
        totalTargets: self._$targets.length,
        totalShow: self._$show.length,
        totalHide: self._$hide.length,
        display:
          future && self._newDisplay ? self._newDisplay : self.layout.display
      };

      if (future) {
        return self._execFilter("_buildState", state);
      } else {
        self._state = state;

        self._execAction("_buildState", 1);
      }
    },

    /**
     * Go Mix
     * @since 2.0.0
     * @param {boolean} animate
     */

    _goMix: function(animate) {
      var self = this,
        phase1 = function() {
          if (self._chrome && self._chrome === 31) {
            chromeFix(self._$parent[0]);
          }

          self._setInter();

          phase2();
        },
        phase2 = function() {
          var scrollTop = window.pageYOffset,
            scrollLeft = window.pageXOffset,
            docHeight = document.documentElement.scrollHeight;

          self._getInterMixData();

          self._setFinal();

          self._getFinalMixData();

          window.pageYOffset !== scrollTop &&
            window.scrollTo(scrollLeft, scrollTop);

          self._prepTargets();

          if (window.requestAnimationFrame) {
            requestAnimationFrame(phase3);
          } else {
            setTimeout(function() {
              phase3();
            }, 20);
          }
        },
        phase3 = function() {
          self._animateTargets();

          if (self._targetsBound === 0) {
            self._cleanUp();
          }
        },
        chromeFix = function(grid) {
          var parent = grid.parentElement,
            placeholder = document.createElement("div"),
            frag = document.createDocumentFragment();

          parent.insertBefore(placeholder, grid);
          frag.appendChild(grid);
          parent.replaceChild(grid, placeholder);
        },
        futureState = self._buildState(true);

      self._execAction("_goMix", 0, arguments);

      !self.animation.duration && (animate = false);

      self._mixing = true;

      self._$container.removeClass(self.layout.containerClassFail);

      if (typeof self.callbacks.onMixStart === "function") {
        self.callbacks.onMixStart.call(
          self._domNode,
          self._state,
          futureState,
          self
        );
      }

      self._$container.trigger("mixStart", [self._state, futureState, self]);

      self._getOrigMixData();

      if (animate && !self._suckMode) {
        window.requestAnimationFrame ? requestAnimationFrame(phase1) : phase1();
      } else {
        self._cleanUp();
      }

      self._execAction("_goMix", 1, arguments);
    },

    /**
     * Get Target Data
     * @since 2.0.0
     */

    _getTargetData: function(el, stage) {
      var self = this,
        elStyle;

      el.dataset[stage + "PosX"] = el.offsetLeft;
      el.dataset[stage + "PosY"] = el.offsetTop;

      if (self.animation.animateResizeTargets) {
        elStyle = !self._suckMode
          ? window.getComputedStyle(el)
          : {
              marginBottom: "",
              marginRight: ""
            };

        el.dataset[stage + "MarginBottom"] = parseInt(elStyle.marginBottom);
        el.dataset[stage + "MarginRight"] = parseInt(elStyle.marginRight);
        el.dataset[stage + "Width"] = el.offsetWidth;
        el.dataset[stage + "Height"] = el.offsetHeight;
      }
    },

    /**
     * Get Original Mix Data
     * @since 2.0.0
     */

    _getOrigMixData: function() {
      var self = this,
        parentStyle = !self._suckMode
          ? window.getComputedStyle(self._$parent[0])
          : { boxSizing: "" },
        parentBS =
          parentStyle.boxSizing || parentStyle[self._vendor + "BoxSizing"];

      self._incPadding = parentBS === "border-box";

      self._execAction("_getOrigMixData", 0);

      !self._suckMode && (self.effects = self._parseEffects());

      self._$toHide = self._$hide.filter(":visible");
      self._$toShow = self._$show.filter(":hidden");
      self._$pre = self._$targets.filter(":visible");

      self._startHeight = self._incPadding
        ? self._$parent.outerHeight()
        : self._$parent.height();

      for (var i = 0; i < self._$pre.length; i++) {
        var el = self._$pre[i];

        self._getTargetData(el, "orig");
      }

      self._execAction("_getOrigMixData", 1);
    },

    /**
     * Set Intermediate Positions
     * @since 2.0.0
     */

    _setInter: function() {
      var self = this;

      self._execAction("_setInter", 0);

      if (self._changingLayout && self.animation.animateChangeLayout) {
        self._$toShow.css("display", self._newDisplay);

        if (self._changingClass) {
          self._$container
            .removeClass(self.layout.containerClass)
            .addClass(self._newClass);
        }
      } else {
        self._$toShow.css("display", self.layout.display);
      }

      self._execAction("_setInter", 1);
    },

    /**
     * Get Intermediate Mix Data
     * @since 2.0.0
     */

    _getInterMixData: function() {
      var self = this;

      self._execAction("_getInterMixData", 0);

      for (var i = 0; i < self._$toShow.length; i++) {
        var el = self._$toShow[i];

        self._getTargetData(el, "inter");
      }

      for (var i = 0; i < self._$pre.length; i++) {
        var el = self._$pre[i];

        self._getTargetData(el, "inter");
      }

      self._execAction("_getInterMixData", 1);
    },

    /**
     * Set Final Positions
     * @since 2.0.0
     */

    _setFinal: function() {
      var self = this;

      self._execAction("_setFinal", 0);

      self._sorting && self._printSort();

      self._$toHide.removeStyle("display");

      if (self._changingLayout && self.animation.animateChangeLayout) {
        self._$pre.css("display", self._newDisplay);
      }

      self._execAction("_setFinal", 1);
    },

    /**
     * Get Final Mix Data
     * @since 2.0.0
     */

    _getFinalMixData: function() {
      var self = this;

      self._execAction("_getFinalMixData", 0);

      for (var i = 0; i < self._$toShow.length; i++) {
        var el = self._$toShow[i];

        self._getTargetData(el, "final");
      }

      for (var i = 0; i < self._$pre.length; i++) {
        var el = self._$pre[i];

        self._getTargetData(el, "final");
      }

      self._newHeight = self._incPadding
        ? self._$parent.outerHeight()
        : self._$parent.height();

      self._sorting && self._printSort(true);

      self._$toShow.removeStyle("display");

      self._$pre.css("display", self.layout.display);

      if (self._changingClass && self.animation.animateChangeLayout) {
        self._$container
          .removeClass(self._newClass)
          .addClass(self.layout.containerClass);
      }

      self._execAction("_getFinalMixData", 1);
    },

    /**
     * Prepare Targets
     * @since 2.0.0
     */

    _prepTargets: function() {
      var self = this,
        transformCSS = {
          _in: self._getPrefixedCSS("transform", self.effects.transformIn),
          _out: self._getPrefixedCSS("transform", self.effects.transformOut)
        };

      self._execAction("_prepTargets", 0);

      if (self.animation.animateResizeContainer) {
        self._$parent.css("height", self._startHeight + "px");
      }

      for (var i = 0; i < self._$toShow.length; i++) {
        var el = self._$toShow[i],
          $el = $(el);

        el.style.opacity = self.effects.opacity;
        el.style.display =
          self._changingLayout && self.animation.animateChangeLayout
            ? self._newDisplay
            : self.layout.display;

        $el.css(transformCSS._in);

        if (self.animation.animateResizeTargets) {
          el.style.width = el.dataset.finalWidth + "px";
          el.style.height = el.dataset.finalHeight + "px";
          el.style.marginRight =
            -(el.dataset.finalWidth - el.dataset.interWidth) +
            el.dataset.finalMarginRight * 1 +
            "px";
          el.style.marginBottom =
            -(el.dataset.finalHeight - el.dataset.interHeight) +
            el.dataset.finalMarginBottom * 1 +
            "px";
        }
      }

      for (var i = 0; i < self._$pre.length; i++) {
        var el = self._$pre[i],
          $el = $(el),
          translate = {
            x: el.dataset.origPosX - el.dataset.interPosX,
            y: el.dataset.origPosY - el.dataset.interPosY
          },
          transformCSS = self._getPrefixedCSS(
            "transform",
            "translate(" + translate.x + "px," + translate.y + "px)"
          );

        $el.css(transformCSS);

        if (self.animation.animateResizeTargets) {
          el.style.width = el.dataset.origWidth + "px";
          el.style.height = el.dataset.origHeight + "px";

          if (el.dataset.origWidth - el.dataset.finalWidth) {
            el.style.marginRight =
              -(el.dataset.origWidth - el.dataset.interWidth) +
              el.dataset.origMarginRight * 1 +
              "px";
          }

          if (el.dataset.origHeight - el.dataset.finalHeight) {
            el.style.marginBottom =
              -(el.dataset.origHeight - el.dataset.interHeight) +
              el.dataset.origMarginBottom * 1 +
              "px";
          }
        }
      }

      self._execAction("_prepTargets", 1);
    },

    /**
     * Animate Targets
     * @since 2.0.0
     */

    _animateTargets: function() {
      var self = this;

      self._execAction("_animateTargets", 0);

      self._targetsDone = 0;
      self._targetsBound = 0;

      self._$parent
        .css(
          self._getPrefixedCSS(
            "perspective",
            self.animation.perspectiveDistance + "px"
          )
        )
        .css(
          self._getPrefixedCSS(
            "perspective-origin",
            self.animation.perspectiveOrigin
          )
        );

      if (self.animation.animateResizeContainer) {
        self._$parent
          .css(
            self._getPrefixedCSS(
              "transition",
              "height " + self.animation.duration + "ms ease"
            )
          )
          .css("height", self._newHeight + "px");
      }

      for (var i = 0; i < self._$toShow.length; i++) {
        var el = self._$toShow[i],
          $el = $(el),
          translate = {
            x: el.dataset.finalPosX - el.dataset.interPosX,
            y: el.dataset.finalPosY - el.dataset.interPosY
          },
          delay = self._getDelay(i),
          toShowCSS = {};

        el.style.opacity = "";

        for (var j = 0; j < 2; j++) {
          var a = j === 0 ? (a = self._prefix) : "";

          if (self._ff && self._ff <= 20) {
            toShowCSS[a + "transition-property"] = "all";
            toShowCSS[a + "transition-timing-function"] =
              self.animation.easing + "ms";
            toShowCSS[a + "transition-duration"] =
              self.animation.duration + "ms";
          }

          toShowCSS[a + "transition-delay"] = delay + "ms";
          toShowCSS[a + "transform"] =
            "translate(" + translate.x + "px," + translate.y + "px)";
        }

        if (self.effects.transform || self.effects.opacity) {
          self._bindTargetDone($el);
        }

        self._ff && self._ff <= 20
          ? $el.css(toShowCSS)
          : $el.css(self.effects.transition).css(toShowCSS);
      }

      for (var i = 0; i < self._$pre.length; i++) {
        var el = self._$pre[i],
          $el = $(el),
          translate = {
            x: el.dataset.finalPosX - el.dataset.interPosX,
            y: el.dataset.finalPosY - el.dataset.interPosY
          },
          delay = self._getDelay(i);

        if (
          !(
            el.dataset.finalPosX === el.dataset.origPosX &&
            el.dataset.finalPosY === el.dataset.origPosY
          )
        ) {
          self._bindTargetDone($el);
        }

        $el.css(
          self._getPrefixedCSS(
            "transition",
            "all " +
              self.animation.duration +
              "ms " +
              self.animation.easing +
              " " +
              delay +
              "ms"
          )
        );
        $el.css(
          self._getPrefixedCSS(
            "transform",
            "translate(" + translate.x + "px," + translate.y + "px)"
          )
        );

        if (self.animation.animateResizeTargets) {
          if (
            el.dataset.origWidth - el.dataset.finalWidth &&
            el.dataset.finalWidth * 1
          ) {
            el.style.width = el.dataset.finalWidth + "px";
            el.style.marginRight =
              -(el.dataset.finalWidth - el.dataset.interWidth) +
              el.dataset.finalMarginRight * 1 +
              "px";
          }

          if (
            el.dataset.origHeight - el.dataset.finalHeight &&
            el.dataset.finalHeight * 1
          ) {
            el.style.height = el.dataset.finalHeight + "px";
            el.style.marginBottom =
              -(el.dataset.finalHeight - el.dataset.interHeight) +
              el.dataset.finalMarginBottom * 1 +
              "px";
          }
        }
      }

      if (self._changingClass) {
        self._$container
          .removeClass(self.layout.containerClass)
          .addClass(self._newClass);
      }

      for (var i = 0; i < self._$toHide.length; i++) {
        var el = self._$toHide[i],
          $el = $(el),
          delay = self._getDelay(i),
          toHideCSS = {};

        for (var j = 0; j < 2; j++) {
          var a = j === 0 ? (a = self._prefix) : "";

          toHideCSS[a + "transition-delay"] = delay + "ms";
          toHideCSS[a + "transform"] = self.effects.transformOut;
          toHideCSS.opacity = self.effects.opacity;
        }

        $el.css(self.effects.transition).css(toHideCSS);

        if (self.effects.transform || self.effects.opacity) {
          self._bindTargetDone($el);
        }
      }

      self._execAction("_animateTargets", 1);
    },

    /**
     * Bind Targets TransitionEnd
     * @since 2.0.0
     * @param {object} $el
     */

    _bindTargetDone: function($el) {
      var self = this,
        el = $el[0];

      self._execAction("_bindTargetDone", 0, arguments);

      if (!el.dataset.bound) {
        el.dataset.bound = true;
        self._targetsBound++;

        $el.on("webkitTransitionEnd.mixItUp transitionend.mixItUp", function(
          e
        ) {
          if (
            (e.originalEvent.propertyName.indexOf("transform") > -1 ||
              e.originalEvent.propertyName.indexOf("opacity") > -1) &&
            $(e.originalEvent.target).is(self.selectors.target)
          ) {
            $el.off(".mixItUp");
            el.dataset.bound = "";
            self._targetDone();
          }
        });
      }

      self._execAction("_bindTargetDone", 1, arguments);
    },

    /**
     * Target Done
     * @since 2.0.0
     */

    _targetDone: function() {
      var self = this;

      self._execAction("_targetDone", 0);

      self._targetsDone++;

      self._targetsDone === self._targetsBound && self._cleanUp();

      self._execAction("_targetDone", 1);
    },

    /**
     * Clean Up
     * @since 2.0.0
     */

    _cleanUp: function() {
      var self = this,
        targetStyles = self.animation.animateResizeTargets
          ? "transform opacity width height margin-bottom margin-right"
          : "transform opacity",
        unBrake = function() {
          self._$targets.removeStyle("transition", self._prefix);
        };

      self._execAction("_cleanUp", 0);

      !self._changingLayout
        ? self._$show.css("display", self.layout.display)
        : self._$show.css("display", self._newDisplay);

      self._$targets.css(self._brake);

      self._$targets
        .removeStyle(targetStyles, self._prefix)
        .removeAttr(
          "data-inter-pos-x data-inter-pos-y data-final-pos-x data-final-pos-y data-orig-pos-x data-orig-pos-y data-orig-height data-orig-width data-final-height data-final-width data-inter-width data-inter-height data-orig-margin-right data-orig-margin-bottom data-inter-margin-right data-inter-margin-bottom data-final-margin-right data-final-margin-bottom"
        );

      self._$hide.removeStyle("display");

      self._$parent.removeStyle(
        "height transition perspective-distance perspective perspective-origin-x perspective-origin-y perspective-origin perspectiveOrigin",
        self._prefix
      );

      if (self._sorting) {
        self._printSort();
        self._activeSort = self._newSortString;
        self._sorting = false;
      }

      if (self._changingLayout) {
        if (self._changingDisplay) {
          self.layout.display = self._newDisplay;
          self._changingDisplay = false;
        }

        if (self._changingClass) {
          self._$parent
            .removeClass(self.layout.containerClass)
            .addClass(self._newClass);
          self.layout.containerClass = self._newClass;
          self._changingClass = false;
        }

        self._changingLayout = false;
      }

      self._refresh();

      self._buildState();

      if (self._state.fail) {
        self._$container.addClass(self.layout.containerClassFail);
      }

      self._$show = $();
      self._$hide = $();

      if (window.requestAnimationFrame) {
        requestAnimationFrame(unBrake);
      }

      self._mixing = false;

      if (typeof self.callbacks._user === "function") {
        self.callbacks._user.call(self._domNode, self._state, self);
      }

      if (typeof self.callbacks.onMixEnd === "function") {
        self.callbacks.onMixEnd.call(self._domNode, self._state, self);
      }

      self._$container.trigger("mixEnd", [self._state, self]);

      if (self._state.fail) {
        typeof self.callbacks.onMixFail === "function" &&
          self.callbacks.onMixFail.call(self._domNode, self._state, self);
        self._$container.trigger("mixFail", [self._state, self]);
      }

      if (self._loading) {
        typeof self.callbacks.onMixLoad === "function" &&
          self.callbacks.onMixLoad.call(self._domNode, self._state, self);
        self._$container.trigger("mixLoad", [self._state, self]);
      }

      if (self._queue.length) {
        self._execAction("_queue", 0);

        self.multiMix(self._queue[0][0], self._queue[0][1], self._queue[0][2]);
        self._queue.splice(0, 1);
      }

      self._execAction("_cleanUp", 1);

      self._loading = false;
    },

    /**
     * Get Prefixed CSS
     * @since 2.0.0
     * @param {string} property
     * @param {string} value
     * @param {boolean} prefixValue
     * @return {object} styles
     */

    _getPrefixedCSS: function(property, value, prefixValue) {
      var self = this,
        styles = {},
        prefix = "",
        i = -1;

      for (i = 0; i < 2; i++) {
        prefix = i === 0 ? self._prefix : "";
        prefixValue
          ? (styles[prefix + property] = prefix + value)
          : (styles[prefix + property] = value);
      }

      return self._execFilter("_getPrefixedCSS", styles, arguments);
    },

    /**
     * Get Delay
     * @since 2.0.0
     * @param {number} i
     * @return {number} delay
     */

    _getDelay: function(i) {
      var self = this,
        n =
          typeof self.animation.staggerSequence === "function"
            ? self.animation.staggerSequence.call(self._domNode, i, self._state)
            : i,
        delay = self.animation.stagger ? n * self.animation.staggerDuration : 0;

      return self._execFilter("_getDelay", delay, arguments);
    },

    /**
     * Parse MultiMix Arguments
     * @since 2.0.0
     * @param {array} args
     * @return {object} output
     */

    _parseMultiMixArgs: function(args) {
      var self = this,
        output = {
          command: null,
          animate: self.animation.enable,
          callback: null
        };

      for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (arg !== null) {
          if (typeof arg === "object" || typeof arg === "string") {
            output.command = arg;
          } else if (typeof arg === "boolean") {
            output.animate = arg;
          } else if (typeof arg === "function") {
            output.callback = arg;
          }
        }
      }

      return self._execFilter("_parseMultiMixArgs", output, arguments);
    },

    /**
     * Parse Insert Arguments
     * @since 2.0.0
     * @param {array} args
     * @return {object} output
     */

    _parseInsertArgs: function(args) {
      var self = this,
        output = {
          index: 0,
          $object: $(),
          multiMix: { filter: self._state.activeFilter },
          callback: null
        };

      for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (typeof arg === "number") {
          output.index = arg;
        } else if (typeof arg === "object" && arg instanceof $) {
          output.$object = arg;
        } else if (typeof arg === "object" && self._helpers._isElement(arg)) {
          output.$object = $(arg);
        } else if (typeof arg === "object" && arg !== null) {
          output.multiMix = arg;
        } else if (typeof arg === "boolean" && !arg) {
          output.multiMix = false;
        } else if (typeof arg === "function") {
          output.callback = arg;
        }
      }

      return self._execFilter("_parseInsertArgs", output, arguments);
    },

    /**
     * Execute Action
     * @since 2.0.0
     * @param {string} methodName
     * @param {boolean} isPost
     * @param {array} args
     */

    _execAction: function(methodName, isPost, args) {
      var self = this,
        context = isPost ? "post" : "pre";

      if (
        !self._actions.isEmptyObject &&
        self._actions.hasOwnProperty(methodName)
      ) {
        for (var key in self._actions[methodName][context]) {
          self._actions[methodName][context][key].call(self, args);
        }
      }
    },

    /**
     * Execute Filter
     * @since 2.0.0
     * @param {string} methodName
     * @param {mixed} value
     * @return {mixed} value
     */

    _execFilter: function(methodName, value, args) {
      var self = this;

      if (
        !self._filters.isEmptyObject &&
        self._filters.hasOwnProperty(methodName)
      ) {
        for (var key in self._filters[methodName]) {
          return self._filters[methodName][key].call(self, args);
        }
      } else {
        return value;
      }
    },

    /* Helpers
		---------------------------------------------------------------------- */

    _helpers: {
      /**
       * CamelCase
       * @since 2.0.0
       * @param {string}
       * @return {string}
       */

      _camelCase: function(string) {
        return string.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase();
        });
      },

      /**
       * Is Element
       * @since 2.1.3
       * @param {object} element to test
       * @return {boolean}
       */

      _isElement: function(el) {
        if (window.HTMLElement) {
          return el instanceof HTMLElement;
        } else {
          return el !== null && el.nodeType === 1 && el.nodeName === "string";
        }
      }
    },

    /* Public Methods
		---------------------------------------------------------------------- */

    /**
     * Is Mixing
     * @since 2.0.0
     * @return {boolean}
     */

    isMixing: function() {
      var self = this;

      return self._execFilter("isMixing", self._mixing);
    },

    /**
     * Filter (public)
     * @since 2.0.0
     * @param {array} arguments
     */

    filter: function() {
      var self = this,
        args = self._parseMultiMixArgs(arguments);

      self._clicking && (self._toggleString = "");

      self.multiMix({ filter: args.command }, args.animate, args.callback);
    },

    /**
     * Sort (public)
     * @since 2.0.0
     * @param {array} arguments
     */

    sort: function() {
      var self = this,
        args = self._parseMultiMixArgs(arguments);

      self.multiMix({ sort: args.command }, args.animate, args.callback);
    },

    /**
     * Change Layout (public)
     * @since 2.0.0
     * @param {array} arguments
     */

    changeLayout: function() {
      var self = this,
        args = self._parseMultiMixArgs(arguments);

      self.multiMix(
        { changeLayout: args.command },
        args.animate,
        args.callback
      );
    },

    /**
     * MultiMix
     * @since 2.0.0
     * @param {array} arguments
     */

    multiMix: function() {
      var self = this,
        args = self._parseMultiMixArgs(arguments);

      self._execAction("multiMix", 0, arguments);

      if (!self._mixing) {
        if (self.controls.enable && !self._clicking) {
          self.controls.toggleFilterButtons && self._buildToggleArray();
          self._updateControls(args.command, self.controls.toggleFilterButtons);
        }

        self._queue.length < 2 && (self._clicking = false);

        delete self.callbacks._user;
        if (args.callback) self.callbacks._user = args.callback;

        var sort = args.command.sort,
          filter = args.command.filter,
          changeLayout = args.command.changeLayout;

        self._refresh();

        if (sort) {
          self._newSort = self._parseSort(sort);
          self._newSortString = sort;

          self._sorting = true;
          self._sort();
        }

        if (filter !== undf) {
          filter = filter === "all" ? self.selectors.target : filter;

          self._activeFilter = filter;
        }

        self._filter();

        if (changeLayout) {
          self._newDisplay =
            typeof changeLayout === "string"
              ? changeLayout
              : changeLayout.display || self.layout.display;
          self._newClass = changeLayout.containerClass || "";

          if (
            self._newDisplay !== self.layout.display ||
            self._newClass !== self.layout.containerClass
          ) {
            self._changingLayout = true;

            self._changingClass = self._newClass !== self.layout.containerClass;
            self._changingDisplay = self._newDisplay !== self.layout.display;
          }
        }

        self._$targets.css(self._brake);

        self._goMix(
          args.animate ^ self.animation.enable
            ? args.animate
            : self.animation.enable
        );

        self._execAction("multiMix", 1, arguments);
      } else {
        if (
          self.animation.queue &&
          self._queue.length < self.animation.queueLimit
        ) {
          self._queue.push(arguments);

          self.controls.enable &&
            !self._clicking &&
            self._updateControls(args.command);

          self._execAction("multiMixQueue", 1, arguments);
        } else {
          if (typeof self.callbacks.onMixBusy === "function") {
            self.callbacks.onMixBusy.call(self._domNode, self._state, self);
          }
          self._$container.trigger("mixBusy", [self._state, self]);

          self._execAction("multiMixBusy", 1, arguments);
        }
      }
    },

    /**
     * Insert
     * @since 2.0.0
     * @param {array} arguments
     */

    insert: function() {
      var self = this,
        args = self._parseInsertArgs(arguments),
        callback = typeof args.callback === "function" ? args.callback : null,
        frag = document.createDocumentFragment(),
        target = (function() {
          self._refresh();

          if (self._$targets.length) {
            return args.index < self._$targets.length || !self._$targets.length
              ? self._$targets[args.index]
              : self._$targets[self._$targets.length - 1].nextElementSibling;
          } else {
            return self._$parent[0].children[0];
          }
        })();

      self._execAction("insert", 0, arguments);

      if (args.$object) {
        for (var i = 0; i < args.$object.length; i++) {
          var el = args.$object[i];

          frag.appendChild(el);
          frag.appendChild(document.createTextNode(" "));
        }

        self._$parent[0].insertBefore(frag, target);
      }

      self._execAction("insert", 1, arguments);

      if (typeof args.multiMix === "object") {
        self.multiMix(args.multiMix, callback);
      }
    },

    /**
     * Prepend
     * @since 2.0.0
     * @param {array} arguments
     */

    prepend: function() {
      var self = this,
        args = self._parseInsertArgs(arguments);

      self.insert(0, args.$object, args.multiMix, args.callback);
    },

    /**
     * Append
     * @since 2.0.0
     * @param {array} arguments
     */

    append: function() {
      var self = this,
        args = self._parseInsertArgs(arguments);

      self.insert(
        self._state.totalTargets,
        args.$object,
        args.multiMix,
        args.callback
      );
    },

    /**
     * Get Option
     * @since 2.0.0
     * @param {string} string
     * @return {mixed} value
     */

    getOption: function(string) {
      var self = this,
        getProperty = function(obj, prop) {
          var parts = prop.split("."),
            last = parts.pop(),
            l = parts.length,
            i = 1,
            current = parts[0] || prop;

          while ((obj = obj[current]) && i < l) {
            current = parts[i];
            i++;
          }

          if (obj !== undf) {
            return obj[last] !== undf ? obj[last] : obj;
          }
        };

      return string
        ? self._execFilter("getOption", getProperty(self, string), arguments)
        : self;
    },

    /**
     * Set Options
     * @since 2.0.0
     * @param {object} config
     */

    setOptions: function(config) {
      var self = this;

      self._execAction("setOptions", 0, arguments);

      typeof config === "object" && $.extend(true, self, config);

      self._execAction("setOptions", 1, arguments);
    },

    /**
     * Get State
     * @since 2.0.0
     * @return {object} state
     */

    getState: function() {
      var self = this;

      return self._execFilter("getState", self._state, self);
    },

    /**
     * Force Refresh
     * @since 2.1.2
     */

    forceRefresh: function() {
      var self = this;

      self._refresh(false, true);
    },

    /**
     * Destroy
     * @since 2.0.0
     * @param {boolean} hideAll
     */

    destroy: function(hideAll) {
      var self = this,
        filters = $.MixItUp.prototype._bound._filter,
        sorts = $.MixItUp.prototype._bound._sort;

      self._execAction("destroy", 0, arguments);

      self._$body
        .add($(self.selectors.sort))
        .add($(self.selectors.filter))
        .off(".mixItUp");

      for (var i = 0; i < self._$targets.length; i++) {
        var target = self._$targets[i];

        hideAll && (target.style.display = "");

        delete target.mixParent;
      }

      self._execAction("destroy", 1, arguments);

      if (
        filters[self.selectors.filter] &&
        filters[self.selectors.filter] > 1
      ) {
        filters[self.selectors.filter]--;
      } else if (filters[self.selectors.filter] === 1) {
        delete filters[self.selectors.filter];
      }

      if (sorts[self.selectors.sort] && sorts[self.selectors.sort] > 1) {
        sorts[self.selectors.sort]--;
      } else if (sorts[self.selectors.sort] === 1) {
        delete sorts[self.selectors.sort];
      }

      delete $.MixItUp.prototype._instances[self._id];
    }
  };

  /* jQuery Methods
	---------------------------------------------------------------------- */

  /**
   * jQuery .mixItUp() method
   * @since 2.0.0
   * @extends $.fn
   */

  $.fn.mixItUp = function() {
    var args = arguments,
      dataReturn = [],
      eachReturn,
      _instantiate = function(domNode, settings) {
        var instance = new $.MixItUp(),
          rand = function() {
            return ("00000" + ((Math.random() * 16777216) << 0).toString(16))
              .substr(-6)
              .toUpperCase();
          };

        instance._execAction("_instantiate", 0, arguments);

        domNode.id = !domNode.id ? "MixItUp" + rand() : domNode.id;

        if (!instance._instances[domNode.id]) {
          instance._instances[domNode.id] = instance;
          instance._init(domNode, settings);
        }

        instance._execAction("_instantiate", 1, arguments);
      };

    eachReturn = this.each(function() {
      if (args && typeof args[0] === "string") {
        var instance = $.MixItUp.prototype._instances[this.id];
        if (args[0] === "isLoaded") {
          dataReturn.push(instance ? true : false);
        } else {
          var data = instance[args[0]](args[1], args[2], args[3]);
          if (data !== undf) dataReturn.push(data);
        }
      } else {
        _instantiate(this, args[0]);
      }
    });

    if (dataReturn.length) {
      return dataReturn.length > 1 ? dataReturn : dataReturn[0];
    } else {
      return eachReturn;
    }
  };

  /**
   * jQuery .removeStyle() method
   * @since 2.0.0
   * @extends $.fn
   */

  $.fn.removeStyle = function(style, prefix) {
    prefix = prefix ? prefix : "";

    return this.each(function() {
      var el = this,
        styles = style.split(" ");

      for (var i = 0; i < styles.length; i++) {
        for (var j = 0; j < 4; j++) {
          switch (j) {
            case 0:
              var prop = styles[i];
              break;
            case 1:
              var prop = $.MixItUp.prototype._helpers._camelCase(prop);
              break;
            case 2:
              var prop = prefix + styles[i];
              break;
            case 3:
              var prop = $.MixItUp.prototype._helpers._camelCase(
                prefix + styles[i]
              );
          }

          if (
            el.style[prop] !== undf &&
            typeof el.style[prop] !== "unknown" &&
            el.style[prop].length > 0
          ) {
            el.style[prop] = "";
          }

          if (!prefix && j === 1) break;
        }
      }

      if (
        el.attributes &&
        el.attributes.style &&
        el.attributes.style !== undf &&
        el.attributes.style.value === ""
      ) {
        el.attributes.removeNamedItem("style");
      }
    });
  };
})(jQuery);


jQuery(document).ready(function($) {
	/* ADD CLASS ON LOAD*/

	$('html')
		.delay(1500)
		.queue(function(next) {
			$(this).addClass('loaded');
			next();
		});

	// -------------------- ANDY P. Menu Toggle -------------------
	// --------------------------------------------------------

	// jQuery(".toggle-btn").on('click', (function () {
	//   jQuery(".nav-main").addClass(visible);
	// }));

	$('.toggle-btn').click(function() {
		$('.nav-main').toggleClass('visible');
	});

	// Offset to header height

	var navHeight = $('header').height();
	var screenHeight = $(window).height();
	var shadowHeight = navHeight + 10;
	var negHeight = '-10px';
	// $("#map-outer-wrapper").css({
	//   "padding-top": navHeight + "px"
	// });
	$('#map-filter-wrapper').css({
		'padding-top': navHeight + 'px',
		//"box-shadow": "inset 0 '. navHeight .' 10px -10px #090b13"
		//'box-shadow': "0px "+shadowHeight+"px " + "(-)10px"  +"#666"
	});
	$('.page-template-accommodation .popup-image.wrapper').css({
		top: navHeight + 'px',
	});

	$('.number-counter__number').each(function() {
		var $this = $(this),
			countTo = $this.attr('data-count');

		$({
			countNum: $this.text(),
		}).animate(
			{
				countNum: countTo,
			},
			{
				duration: 3000,
				easing: 'linear',
				step: function() {
					$this.text(Math.floor(this.countNum));
				},
				complete: function() {
					$this.text(this.countNum);
					//alert('finished');
				},
			}
		);
	});

	//Smooth Scroll

	$('nav a, a.button, a.next-section, a.explore').click(function() {
		if ($(this).attr('href') != '#') {
			$('html, body').animate(
				{
					scrollTop: $($(this).attr('href')).offset().top - 100,
				},
				500
			);
			return false;
		}
	});

	/* ADD CLASS ON SCROLL*/

	$(window).scroll(function() {
		var scroll = $(window).scrollTop();

		if (scroll >= 100) {
			$('body').addClass('scrolled');
		} else {
			$('body').removeClass('scrolled');
		}
	});

	// ========== Controller for lightbox elements

	$('.gallery').each(function() {
		$(this)
			.find('.lightbox-gallery')
			.magnificPopup({
				type: 'image',
				gallery: {
					enabled: true,
				},
			});
	});

	$('.gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1],
		},
		image: {
			titleSrc: 'title',
			titleSrc: function(item) {
				return item.el.attr('title');
			},
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		},
	});

	$('.single-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		zoom: {
			enabled: true,
			duration: 300,
		},
	});

	$('.post-image a').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		zoom: {
			enabled: true,
			duration: 300,
		},
	});

	// GLOBAL OWL CAROUSEL SETTINGS

	$('.carousel_module').owlCarousel({
		loop: false,
		nav: true,
		// navClass: ["owl-prev", "owl-next"],
		navText: ['<svg width="50" height="50" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>', '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>' /* icons from https://iconmonstr.com */],
		autoplay: true,
		autoplayTimeout: 8000,
		autoplayHoverPause: true,
		loop: true,
		dots: false,
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 1,
			},
			1000: {
				items: 1,
			},
		},
	});

	$('.daily_module').owlCarousel({
		loop: false,
		nav: true,
		navClass: ['owl-prev', 'owl-next'],
		dots: false,
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 1,
			},
			1000: {
				items: 1,
			},
		},
	});

	$('.testimonials').owlCarousel({
		loop: true,
		nav: true,
		navClass: ['testi-prev', 'testi-next'],
		dots: false,
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 1,
			},
			1000: {
				items: 1,
			},
		},
	});

	/* CLASS AND FOCUS ON CLICK */

	$('.menu-trigger').click(function() {
		$('.menu-collapse').toggleClass('visible');
		$('.current-menu-item').toggleClass('loaded');
		$('.menu-trigger').toggleClass('opened');
	});

	$('.read-more').click(function() {
		$(this)
			.prev()
			.slideToggle();
		$(this).text($(this).text() == 'Read more' ? 'Read less' : 'Read more');
	});

	$('.tab-trigger').click(function() {
		$('.tab-trigger.active').removeClass('active');
		$(this).addClass('active');
	});

	$('.see-more').click(function() {
		$(this)
			.closest('.camp-summary__item')
			.toggleClass('open');
	});
	/*
    $(".safari-itinerary__item p.heading").click(function() {
        $(".safari-itinerary__item.open").removeClass("open");
	    $(this).closest('.safari-itinerary__item').toggleClass("open");
    });
    $(".safari-itinerary__item:first-child").addClass("open");
*/

	$('.safari-itinerary__item p.heading').click(function() {
		//$(this).next().slideToggle();
		$(this)
			.parent()
			.toggleClass('open');
		// $(this)
		//   .parent()
		//   .siblings()
		//   .removeClass("open");
	});

	$('.toggle__item p.heading').click(function() {
		//$(this).next().slideToggle();
		$(this)
			.parent()
			.toggleClass('open');
		$(this)
			.parent()
			.siblings()
			.removeClass('open');
		var self = $(this).parent('.toggle__item');
		setTimeout(function() {
			$('html,body').animate(
				{
					scrollTop: $(self).offset().top - 100,
				},
				300
			);
		}, 500);
	});

	/*$(".toggle__item p.heading").click(function() {
    var self = this;
    $(this)
      .parent()
      .siblings(".toggle__item")
      .slideUp(500);
    $(this)
      .parent()
      .find(".toggle__item")
      .slideToggle(500, function() {
        $("html,body").animate(
          {
            scrollTop: $(self).offset().top - 30
          },
          500
        );
      });
  });*/

	$('.camp-map .marker').click(function() {
		//$(this).next().slideToggle();
		$(this)
			.siblings()
			.children('.camp-map__card')
			.removeClass('open');
		$(this)
			.children('.camp-map__card')
			.toggleClass('open');
		$(this).addClass('live');
		$(this)
			.siblings('.marker')
			.removeClass('live');
	});

	$('.filter-wrapper__trigger').click(function() {
		$('.filter-wrapper', '.map-outer-wrapper').toggleClass('open');
	});

	$('.close-filters').click(function() {
		$('.mockup-filter').toggleClass('open');
		$('.map-outer-wrapper').toggleClass('open');
	});

	$('.checkboxes-wrapper input:checkbox').click(function() {
		if ($('input[value="' + this.value + '"]:checkbox').prop('checked', this.checked)) {
			$('button.filter-reset').addClass('visible');
			$('div.filtered-result').addClass('visible');
			$('div.filter-header').addClass('filter-active');
		}
	});

	$('.checkbox input:checkbox').click(function() {
		var textinputs = document.querySelectorAll('.checkbox input[type=checkbox]');
		var empty = [].filter.call(textinputs, function(el) {
			return !el.checked;
		});
		if (textinputs.length == empty.length) {
			$('button.filter-reset').removeClass('visible');
			$('div.filtered-result').removeClass('visible');
			$('div.filter-header').removeClass('filter-active');
		}
	});

	$('.checkbox input:checkbox').click(function() {
		$('#wipe').addClass('right');
		setTimeout(function() {
			$('#wipe').removeClass('right');
		}, 300);
	});

	$('input[type="checkbox"]').click(function() {
		$('input[value="' + this.value + '"]:checkbox').prop('checked', this.checked);
	});

	$('input:checkbox.toggle ').click(function() {
		$(this)
			.closest('.company-summary__item')
			.toggleClass('visible');
	});

	$('.search-trigger').click(function() {
		$('#search-overlay').addClass('open');
		//$('body').css({'max-height':'100vh', 'overflow':'hidden'});
		//$('html').css({'overflow-y':'scroll'});
		$('#search-input').focus();
	});

	$('.close-search, .search-submit').click(function() {
		$('#search-overlay').removeClass('open');
		//$('body').css({'max-height':'none', 'overflow':'hidden'});
	});

	$('.layer-buttons__item.off').click(function() {
		$(this)
			.siblings('.layer-buttons__item')
			.removeClass('active');
		$(this).addClass('active');
		$('#overlay')
			.find('#High_water_level')
			.addClass('hide');
		$('#overlay')
			.find('#low_water_level')
			.addClass('hide');
	});

	$('.layer-buttons__item.low').click(function() {
		$(this)
			.siblings('.layer-buttons__item')
			.removeClass('active');
		$(this).addClass('active');
		$('#overlay')
			.find('#High_water_level')
			.addClass('hide');
		$('#overlay')
			.find('#low_water_level')
			.removeClass('hide');
	});

	$('.layer-buttons__item.high').click(function() {
		$(this)
			.siblings('.layer-buttons__item')
			.removeClass('active');
		$(this).addClass('active');
		$('#overlay')
			.find('#low_water_level')
			.addClass('hide');
		$('#overlay')
			.find('#High_water_level')
			.removeClass('hide');
	});
	$('.filter-switcher').click(function() {
		$('.filter-header').toggleClass('hide');
	});

	$('.checkboxes-wrapper input:checkbox').click(function() {
		function scrollToTop() {
			$('html, body').animate(
				{
					scrollTop: $('#Filters').offset().top - 75,
				},
				'slow'
			);
		}
		setTimeout(scrollToTop, 700);
	});

	// ========== Count filter results
	$(document).ready(function() {
		var allElems;
		setTimeout(function() {
			var allElems = $('.mix');
			var count = 0;
			for (var i = 0; i < allElems.length; i++) {
				var thisElem = allElems[i];
				if (thisElem.style.display == 'inline-block') count++;
			}
			$('#filter-count').text(count);
		}, 500);
	});

	$('.filter-group input[type=checkbox]').click(function() {
		setTimeout(function() {
			$('.feature_switch').prop('checked', false);
			var allElemsClick = $('.mix');
			var countClick = 0;
			for (var i = 0; i < allElemsClick.length; i++) {
				var thisElemClick = allElemsClick[i];
				if (thisElemClick.style.display == 'inline-block') countClick++;
			}
			$('#filter-count').text(countClick);
			if (countClick < 1) {
				$('.filtered-result').addClass('empty');
			} else if (countClick > 0) {
				$('.filtered-result').removeClass('empty');
			}
		}, 800);
	});

	/*$('.checkbox input:checkbox').click(function() {
    $('div.mix').addClass(function(){
            var floated = $(this).css('display');
            return floated ? 'display-' + floated : '';
        });
        var n = $('div.mix.display-block').length;
        $( "span#filter-count" ).text(n);
});*/

	$('.open').click(function(event) {
		$(this).removeClass('visible');
		$('.profile-image').addClass('reveal');
	});
	$('.close-trigger').click(function(event) {
		$('.profile-image').removeClass('reveal');
		$('.open').addClass('visible');
	});

	// ============REMOVE DUPLICATE ELEMENTS

	$.each($('.camp-includes'), function(i, one) {
		var seen = {};

		$('.repeater', one).each(function() {
			var txt = $(this).text();
			if (seen[txt]) $(this).remove();
			else seen[txt] = true;
		});
	});

	// ============SHOW MORE OR LESS

	$(document).ready(function() {
		(function() {
			var showChar = 500;
			var ellipsestext = '...';

			$('.truncate').each(function() {
				var content = $(this).html();
				if (content.length > showChar) {
					var c = content.substr(0, showChar);
					var h = content;
					var html = '<div class="truncate-text" style="display:block">' + c + '<span class="moreellipses">' + ellipsestext + '&nbsp;&nbsp;<a href="" class="moreless more button button__standard--fixed-width button__standard">Read more</a></span></span></div><div class="truncate-text" style="display:none">' + h + '<a href="" class="moreless less button button__standard--fixed-width button__standard">Less</a></span></div>';

					$(this).html(html);
				}
			});

			$('.moreless').click(function() {
				var thisEl = $(this);
				var cT = thisEl.closest('.truncate-text');
				var tX = '.truncate-text';

				if (thisEl.hasClass('less')) {
					cT.prev(tX).toggle();
					cT.slideToggle();
				} else {
					cT.toggle();
					cT.next(tX).fadeToggle();
				}
				return false;
			});
			/* end iffe */
		})();

		/* end ready */
	});

	// ========== Add class if in viewport on page load

	$.fn.isOnScreen = function() {
		var win = $(window);

		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft(),
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var bounds = this.offset();
		bounds.right = bounds.left + this.outerWidth();
		bounds.bottom = bounds.top + this.outerHeight();

		return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
	};

	$('.slide-up, .slide-down, .slide-right, .slow-fade').each(function() {
		if ($(this).isOnScreen()) {
			$(this).addClass('active');
		}
	});

	// ========== Add class on entering viewport

	$.fn.isInViewport = function() {
		var elementTop = $(this).offset().top;
		var elementBottom = elementTop + $(this).outerHeight();
		var viewportTop = $(window).scrollTop();
		var viewportBottom = viewportTop + $(window).height();
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	$(window).on('resize scroll', function() {
		$('.slide-up, .slide-down, .slide-right, .slow-fade').each(function() {
			if ($(this).isInViewport()) {
				$(this).addClass('active');
			}
		});
	});

	// ========== Tab Slider

	var action = false,
		clicked = false;
	var Owl = {
		init: function() {
			Owl.carousel();
		},
		carousel: function() {
			var owl;
			$(document).ready(function() {
				owl = $('.tabs').owlCarousel({
					items: 1,
					center: true,
					nav: false,
					dots: true,
					loop: true,
					margin: 10,
					dotsContainer: '.test',
					navText: ['prev', 'next'],
				});
				$('.owl-next').on('click', function() {
					action = 'next';
				});
				$('.owl-prev').on('click', function() {
					action = 'prev';
				});
				$('.tabs-header').on('click', 'li', function(e) {
					owl.trigger('to.owl.carousel', [$(this).index(), 300]);
				});
			});
		},
	};
	$(document).ready(function() {
		Owl.init();
	});

	/***********HERO SLIDER***********/
	var slideCount = $('#slider ul li').length;
	var slideWidth = $('#slider ul li').width();
	var slideHeight = $('#slider ul li').height();
	var sliderUlWidth = slideCount * slideWidth;
	$('#slider ul').css({
		width: sliderUlWidth,
		marginLeft: -slideWidth,
	});
	$('#slider ul li:last-child').prependTo('#slider ul');

	function moveLeft() {
		$('#slider ul').animate(
			{
				left: +slideWidth,
			},
			500,
			function() {
				$('#slider ul li:last-child').prependTo('#slider ul');
				$('#slider ul').css('left', '');
			}
		);
	}

	function moveRight() {
		$('#slider ul').animate(
			{
				left: -slideWidth,
			},
			500,
			function() {
				$('#slider ul li:first-child').appendTo('#slider ul');
				$('#slider ul').css('left', '');
			}
		);
	}
	$('a.control_prev').click(function() {
		moveLeft();
	});
	$('a.control_next').click(function() {
		moveRight();
	});

	/*********** FILTER CONTROLLER ***********/

	var multiFilter = {
		// Declare any variables we will need as properties of the object
		$filterGroups: null,
		$filterUi: null,
		$reset: null,
		groups: [],
		outputArray: [],
		outputString: '',
		// The "init" method will run on document ready and cache any jQuery objects we will need.
		init: function() {
			var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "checkboxFilter" object so that we can share methods and properties between all parts of the object.
			self.$filterUi = $('#Filters');
			self.$filterGroups = $('.filter-group');
			self.$reset = $('#reset');
			self.$container = $('#Container');
			self.$filterGroups.each(function() {
				self.groups.push({
					$inputs: $(this).find('input'),
					active: [],
					tracker: false,
				});
			});
			self.bindHandlers();
		},
		// The "bindHandlers" method will listen for whenever a form value changes.
		bindHandlers: function() {
			var self = this,
				typingDelay = 300,
				typingTimeout = -1,
				resetTimer = function() {
					clearTimeout(typingTimeout);

					typingTimeout = setTimeout(function() {
						self.parseFilters();
					}, typingDelay);
				};
			self.$filterGroups.filter('.checkboxes').on('change', function() {
				self.parseFilters();
			});
			self.$filterGroups.filter('.search').on('keyup change', resetTimer);
			self.$reset.on('click', function(e) {
				e.preventDefault();
				self.$filterUi[0].reset();
				self.$filterUi.find('input[type="text"]').val('');
				self.parseFilters();
			});
		},
		// The parseFilters method checks which filters are active in each group:
		parseFilters: function() {
			var self = this;
			// loop through each filter group and add active filters to arrays
			for (var i = 0, group; (group = self.groups[i]); i++) {
				group.active = []; // reset arrays
				group.$inputs.each(function() {
					var searchTerm = '',
						$input = $(this),
						minimumLength = 3;
					if ($input.is(':checked')) {
						group.active.push(this.value);
					}
					if ($input.is('[type="text"]') && this.value.length >= minimumLength) {
						searchTerm = this.value
							.trim()
							.toLowerCase()
							.replace(' ', '-');
						group.active[0] = '[class*="' + searchTerm + '"]';
					}
				});
				group.active.length && (group.tracker = 0);
			}
			self.concatenate();
		},
		// The "concatenate" method will crawl through each group, concatenating filters as desired:
		concatenate: function() {
			var self = this,
				cache = '',
				crawled = false,
				checkTrackers = function() {
					var done = 0;
					for (var i = 0, group; (group = self.groups[i]); i++) {
						group.tracker === false && done++;
					}
					return done < self.groups.length;
				},
				crawl = function() {
					for (var i = 0, group; (group = self.groups[i]); i++) {
						group.active[group.tracker] && (cache += group.active[group.tracker]);
						if (i === self.groups.length - 1) {
							self.outputArray.push(cache);
							cache = '';
							updateTrackers();
						}
					}
				},
				updateTrackers = function() {
					for (var i = self.groups.length - 1; i > -1; i--) {
						var group = self.groups[i];
						if (group.active[group.tracker + 1]) {
							group.tracker++;
							break;
						} else if (i > 0) {
							group.tracker && (group.tracker = 0);
						} else {
							crawled = true;
						}
					}
				};
			self.outputArray = []; // reset output array
			do {
				crawl();
			} while (!crawled && checkTrackers());
			self.outputString = self.outputArray.join();
			// If the output string is empty, show all rather than none:
			!self.outputString.length && (self.outputString = 'all');
			console.log(self.outputString);
			// ^ we can check the console here to take a look at the filter string that is produced
			// Send the output string to MixItUp via the 'filter' method:
			if (self.$container.mixItUp('isLoaded')) {
				self.$container.mixItUp('filter', self.outputString);
			}
		},
	};
	// On document ready, initialise our code.
	$(function() {
		// Initialize multiFilter code
		multiFilter.init();
		// Instantiate MixItUp
		$('#Container.filter-wrapper').mixItUp({
			controls: {
				enable: false,
			},
			animation: {
				easing: 'cubic-bezier(0.86, 0, 0.87, 1)',
				//queueLimit: 3,
				duration: 500,
			},
		});
		$('#Container.marker-wrapper').mixItUp({
			animation: {
				duration: 500,
			},
		});
	});

	// call this once after DOM ready and once if DOM inside hideables changed
	Array.prototype.forEach.call(document.querySelectorAll('.hideable'), function(hideable) {
		hideable.style.maxHeight = hideable.scrollHeight + 'px';
	});
	Array.prototype.forEach.call(document.querySelectorAll('.toggle'), function(toggle) {
		toggle.checked = true;
	});
	$('.hero-carousel').css({
		paddingTop: navHeight + 'px',
	});

	var slideHeight = screenHeight * 0.75 - navHeight;

	$('.hero-carousel .carousel_module .owl-item').css({
		height: slideHeight,
	});

	var seen = {};
	$('.single-itineraries .camp-summary__item').each(function() {
		var campItem = $(this).attr('data-camp');
		if (seen[campItem]) $(this).remove();
		else seen[campItem] = true;
	});

	var seen = {};
	$('li.activity').each(function() {
		var activityItem = $(this).attr('data-activity');
		if (seen[activityItem]) $(this).remove();
		else seen[activityItem] = true;
	});

	var seen = {};
	$('.single-destination').each(function() {
		var destinationItem = $(this).attr('data-destination');
		if (seen[destinationItem]) $(this).remove();
		else seen[destinationItem] = true;
	});

	var seen = {};
	$('.safari-includes .location-repeater').each(function() {
		var destinationItem = $(this).attr('data-destination');
		if (seen[destinationItem]) $(this).remove();
		else seen[destinationItem] = true;
	});
	$(document).ready(function() {
		$('.feature_switch').click(function() {
			if ($(this).is(':checked')) {
				$('.checkboxes-wrapper input').prop('checked', false);
				$('.col.mix')
					.not('.featured')
					.slideUp();
				$('.col.mix.featured').css('display', 'inline-block');
				var filters = $('#Filters');
				setTimeout(function() {
					$('html,body').animate(
						{
							scrollTop: $(filters).offset().top - 75,
						},
						300
					);
				}, 500);
			} else {
				$('.col.mix').slideDown();
				$('.col.mix').css('display', 'inline-block');
			}
			var allElems;
			setTimeout(function() {
				var allElems = $('.mix');
				var count = 0;
				for (var i = 0; i < allElems.length; i++) {
					var thisElem = allElems[i];
					if (thisElem.style.display == 'inline-block') count++;
				}
				$('#filter-count').text(count);
			}, 500);
		});
	});

	if ($('header').width() < 576) {
		$('.filter-switcher').prop('checked', false);
	}
}); //Don't remove ---- end of jQuery wrapper

//Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
	const headerEl = document.querySelector('.sidebar');
	let options = {
		root: null,
		rootMargin: '-250px 0px',
		threshold: 0,
	};
	let floatObserver = new IntersectionObserver(floatingTitle, options);
	document.querySelectorAll('.floating-heading').forEach(description => {
		floatObserver.observe(description);
	});
});

function floatingTitle(entries, ob) {
	const sidebar = document.querySelector('.sidebar');
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			//entry.target.classList.remove('fade-out');
			sidebar.classList.remove('enabled');
		} else {
			//entry.target.classList.add('fade-out');
			sidebar.classList.add('enabled');
		}
	});
}

// First we select the element we want to target
const hero = document.querySelector('.hero__find');
const target = document.querySelector('.filter-header');

function handleIntersection(entries) {
	entries.map(entry => {
		if (entry.isIntersecting) {
			target.classList.remove('at-top');
		} else {
			target.classList.add('at-top');
		}
	});
}

const observer = new IntersectionObserver(handleIntersection);

observer.observe(hero);

//@prepros-prepend jquery.magnific-popup.js
//@prepros-prepend owl.carousel.min.js
//@prepros-prepend mixitup.js

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

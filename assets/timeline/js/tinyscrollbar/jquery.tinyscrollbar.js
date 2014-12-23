/*!
 * Tiny Scrollbar 1.66
 * http://www.baijs.nl/tinyscrollbar/
 *
 * Copyright 2010, Maarten Baijs
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Date: 13 / 11 / 2011
 * Depends on library: jQuery
 * 
 *
 * Customized by pezflash - October 2014
 * Project: jQuery Timeline slider v2.0
 * http: //www.codecanyon.net/user/pezflash
 */
 
 
//SHARED VARS
var ratio;
var ratioDragger;
var iScroll;
var iScroll2;
var iPosition;
 

(function($){
	$.tiny = $.tiny || { };
	
	$.tiny.scrollbar = {
		options: {	
			axis: 'x', // vertical or horizontal scrollbar? ( x || y ).
			wheel: 20,  //how many pixels must the mouswheel scroll at a time.
			mouseWheel: '1', //enable or disable the mousewheel;
			size: 'auto', //set the size of the scrollbar to auto or a fixed number.
			draggerWidth: 'auto' //set the size of the thumb to auto or a fixed number.
		}
	};	
	
	$.fn.tinyscrollbar = function(options) { 
		var options = $.extend({}, $.tiny.scrollbar.options, options); 		
		this.each(function(){ $(this).data('tsb', new Scrollbar($(this), options)); });
		return this;
	};
	$.fn.tinyscrollbar_update = function(sScroll) { return $(this).data('tsb').update(sScroll); };
	
	function Scrollbar(root, options){
		var oSelf = this;
		var oWrapper = root;
		var oViewport = { obj: $('.viewport', root) };
		var oImages = { obj: $('.images', root) };
		var oMilestones = { obj: $('.milestones', root) };
		var oContent = { obj: $('.content', root) };
		var oScrollbar = { obj: $('.scrollbar', root) };
		var oScrollbar2 = { obj: $('.scrollbar', root) };
		var oTrack = { obj: $('.track', oScrollbar.obj) };
		var oDragger = { obj: $('.dragger', oScrollbar.obj) };
		var sAxis = options.axis == 'x', sDirection = sAxis ? 'left' : 'top', sSize = sAxis ? 'Width' : 'Height';
		iScroll, iScroll2, iPosition = { start: -30, now: -30 }, iMouse = {};

		function initialize() {	
			oSelf.update();
			setEvents();
			return oSelf;
		}
		this.update = function(sScroll){
			oViewport[options.axis] = oViewport.obj[0]['offset'+ sSize];
			oMilestones[options.axis] = oMilestones.obj[0]['offset'+ sSize];
			oImages[options.axis] = oImages.obj[0]['scroll'+ sSize];
			oContent[options.axis] = oContent.obj[0]['scroll'+ sSize];
			oImages.ratio = oViewport[options.axis] / oImages[options.axis];
			oContent.ratio = oMilestones[options.axis] / oContent[options.axis];
			oScrollbar.obj.toggleClass('hidden', oImages.ratio >= 1);
			oScrollbar2.obj.toggleClass('hidden', oContent.ratio >= 1);
			oTrack[options.axis] = options.size == 'auto' ? oViewport[options.axis] : options.size;
			oDragger[options.axis] = Math.min(oTrack[options.axis], Math.max(0, ( options.draggerWidth == 'auto' ? (oTrack[options.axis] * oImages.ratio) : options.draggerWidth )));
			oScrollbar.ratio = options.draggerWidth == 'auto' ? (oImages[options.axis] / oTrack[options.axis]) : (oImages[options.axis] - oViewport[options.axis]) / (oTrack[options.axis] - oDragger[options.axis]);
			iScroll = (sScroll == 'relative' && oImages.ratio <= 1) ? Math.min((oImages[options.axis] - oViewport[options.axis]), Math.max(0, iScroll)) : 0;
			iScroll = (sScroll == 'bottom' && oImages.ratio <= 1) ? (oImages[options.axis] - oViewport[options.axis]) : isNaN(parseInt(sScroll)) ? iScroll : parseInt(sScroll);
			oScrollbar2.ratio = options.draggerWidth == 'auto' ? (oContent[options.axis] / oTrack[options.axis]) : (oContent[options.axis] - oMilestones[options.axis]) / (oTrack[options.axis] - oDragger[options.axis]);
			iScroll2 = (sScroll == 'relative' && oContent.ratio <= 1) ? Math.min((oContent[options.axis] - oMilestones[options.axis]), Math.max(0, iScroll2)) : 0;
			iScroll2 = (sScroll == 'bottom' && oContent.ratio <= 1) ? (oContent[options.axis] - oMilestones[options.axis]) : isNaN(parseInt(sScroll)) ? iScroll2 : parseInt(sScroll);
			ratio = oScrollbar2.ratio / oScrollbar.ratio;
			ratioDragger = (oTrack[options.axis] - oDragger[options.axis]) / (oImages[options.axis] - oTrack[options.axis]);
			setSize();
		};
		function setSize(){
			oDragger.obj.css(sDirection, iScroll / oScrollbar.ratio);
			oImages.obj.css(sDirection, -iScroll);
			oContent.obj.css(sDirection, -iScroll2);
			iMouse['start'] = oDragger.obj.offset()[sDirection];
			var sCssSize = sSize.toLowerCase(); 
			oScrollbar.obj.css(sCssSize, oTrack[options.axis]);
			oTrack.obj.css(sCssSize, oTrack[options.axis]);
			oDragger.obj.css(sCssSize, oDragger[options.axis]);		
		};		
		function setEvents(){
			oDragger.obj.bind('mousedown', start);
			oDragger.obj[0].ontouchstart = function(oEvent){
				oEvent.preventDefault();
				oDragger.obj.unbind('mousedown');
				start(oEvent.touches[0]);
				return false;
			};	
			oTrack.obj.bind('mouseup', drag);
			if(options.mouseWheel == '1' && this.addEventListener){
				oWrapper[0].addEventListener('DOMMouseScroll', wheel, false);
				oWrapper[0].addEventListener('mousewheel', wheel, false );
			}
			else if(options.mouseWheel == '1'){oWrapper[0].onmousewheel = wheel;}
		};
		function start(oEvent){
			iMouse.start = sAxis ? oEvent.pageX : oEvent.pageY;
			var oDraggerDir = parseInt(oDragger.obj.css(sDirection));
			iPosition.start = oDraggerDir == 'auto' ? 0 : oDraggerDir;
			$(document).bind('mousemove', drag);
			document.ontouchmove = function(oEvent){
				$(document).unbind('mousemove');
				drag(oEvent.touches[0]);
			};
			$(document).bind('mouseup', end);
			oDragger.obj.bind('mouseup', end);
			oDragger.obj[0].ontouchend = document.ontouchend = function(oEvent){
				$(document).unbind('mouseup');
				oDragger.obj.unbind('mouseup');
				end(oEvent.touches[0]);
			};
			return false;
		};		
		function wheel(oEvent){
			if(!(oImages.ratio >= 1)){
				var oEvent = oEvent || window.event;
				var iDelta = oEvent.wheelDelta ? oEvent.wheelDelta/120 : -oEvent.detail/3;
				iScroll -= iDelta * options.wheel * oScrollbar.ratio;
				iScroll = Math.min((oImages[options.axis] - oViewport[options.axis]), Math.max(0, iScroll));
				iScroll2 -= iDelta * options.wheel * oScrollbar2.ratio;
				iScroll2 = Math.min((oContent[options.axis] - oMilestones[options.axis]), Math.max(0, iScroll2));
				
				oDragger.obj.css(sDirection, iScroll / oScrollbar.ratio);
				oImages.obj.css(sDirection, -iScroll);
				oContent.obj.css(sDirection, -iScroll2);
				
				oEvent = $.event.fix(oEvent);
				oEvent.preventDefault();
			};
		};
		function end(oEvent){
			$(document).unbind('mousemove', drag);
			$(document).unbind('mouseup', end);
			oDragger.obj.unbind('mouseup', end);
			document.ontouchmove = oDragger.obj[0].ontouchend = document.ontouchend = null;
			return false;
		};
		function drag(oEvent){
			if(!(oImages.ratio >= 1)){
				iPosition.now = Math.min((oTrack[options.axis] - oDragger[options.axis]), Math.max(0, (iPosition.start + ((sAxis ? oEvent.pageX : oEvent.pageY) - iMouse.start))));
				iScroll = iPosition.now * oScrollbar.ratio;
				iScroll2 = iPosition.now * oScrollbar2.ratio;
								
				$(oImages.obj).stop(true, true).animate({ left: -iScroll }, 1000, 'easeInOutQuad');
				$(oContent.obj).stop(true, true).animate({ left: -iScroll2 }, 700, 'easeInOutQuad');
				$(oDragger.obj).stop(true, true).animate({ left: iPosition.now }, 700, 'easeInOutQuad');
				
				//DIRECT USE WITHOUT JQUERY ANIMATION
				//oImages.obj.css(sDirection, -iScroll);
				//oContent.obj.css(sDirection, -iScroll2);
				//oDragger.obj.css(sDirection, iPosition.now);
			}
			return false;
		};
		
		return initialize();
	};
})(jQuery);
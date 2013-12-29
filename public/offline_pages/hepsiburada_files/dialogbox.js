;(function($) {

	$.fn.DialogBox = function(event,options,callback,preventDefault,stopPropagation) {

		var target = $(this);
		target[event](function(event) {
			if (preventDefault && preventDefault == true) {
					event.returnValue = false;
					if (event.preventDefault) { event.preventDefault(); }
			}
			if (stopPropagation && stopPropagation == true) {
					event.cancelBubble = true;
					if (event.stopPropagation) { event.stopPropagation(); }
			}
			if (target.blur) { target.blur(); }
			$.DialogBox(options,callback,target);
		});

	};

	$.DialogBoxArray = new Array();

	$.DialogBox = function(options,callback,target) {

		var options = $.extend({
			title: 'Title', content: 'Description', type: 'information',
			buttons: { confirm: {title:'Continue', style:'continue'}, cancel: {title:'Cancel', style:'cancel'} },
			style: { modal: 'dialogbox-background', dialog: 'dialogbox-dialog', content : 'dialogbox-content', buttons: 'dialogbox-buttons', timeout: 'dialogbox-timer' },
			background: '#000', opacity: '0.6',
			animate : { open: false, close : false, speed: false },
			timeout: { second: false, screen: false },
			modalclose: false, usekey: false
		}, options);

		var modalbox = {};
		
		modalbox.createDialog = function() {

			modalbox.background = $('<div/>', {'class':options.style.modal,css:{background:options.background,opacity:options.opacity}});
			modalbox.background.css({'display':'none'});
			modalbox.background.appendTo('body');

			if (options.modalclose) {
				modalbox.background.click(function() {
					modalbox.response = false;
					modalbox.removeDialog();
				});
			}
			
			modalbox.dialog = $('<div/>', {'class':options.style.dialog});
			modalbox.content = $('<div/>', {'class':options.style.content});
			modalbox.content.appendTo(modalbox.dialog);
			modalbox.title = $('<h1/>', {'class':'title',html:options.title});
			modalbox.title.appendTo(modalbox.content);
			modalbox.description = $('<div/>', {'class':'description',html:options.content});
			modalbox.description.appendTo(modalbox.content);
			modalbox.buttons = $('<div/>', {'class':options.style.buttons});
			modalbox.buttons.appendTo(modalbox.dialog);
			
			var modalbuttons = {};
			
			if (options.type=='confirmation' || options.type=='information') {
				if (options.buttons.confirm.title) {
					modalbuttons.confirm = $('<button/>', {'class':options.buttons.confirm.style,html:options.buttons.confirm.title});
					modalbuttons.confirm.appendTo(modalbox.buttons);
					modalbuttons.confirm.click(function() {
						modalbox.response = true;
						modalbox.removeDialog();
					});
				}
			}
			
			if (options.type=='confirmation') {
				if (options.buttons.cancel.title) {
					modalbuttons.cancel = $('<button/>', {'class':options.buttons.cancel.style,html:options.buttons.cancel.title});
					modalbuttons.cancel.appendTo(modalbox.buttons);			
					modalbuttons.cancel.click(function() {
						modalbox.response = false;
						modalbox.removeDialog();
					});
				}
			}
			
			modalbox.dialog.appendTo('body');
			modalbox.width = modalbox.dialog.width();
			modalbox.height = modalbox.dialog.height();
			modalbox.windowWidth = document.documentElement.clientWidth;
			modalbox.windowHeight = document.documentElement.clientHeight;
			modalbox.leftCenter = (modalbox.windowWidth-modalbox.width)*0.50;
			modalbox.topCenter = (modalbox.windowHeight-modalbox.height)*0.50;
			modalbox.bottom = (modalbox.windowHeight-modalbox.height);
			modalbox.right = (modalbox.windowWidth-modalbox.width);

			if (options.animate.speed && options.animate.open) {
				switch(options.animate.open) {
					case 'top':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,left:modalbox.leftCenter}).animate({opacity:1,top:modalbox.topCenter},options.animate.speed);
					break;
					case 'left':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:modalbox.topCenter}).animate({opacity:1,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'right':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:modalbox.topCenter,left:modalbox.right}).animate({opacity:1,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'bottom':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,left:modalbox.leftCenter,top:modalbox.bottom}).animate({opacity:1,top:modalbox.topCenter},options.animate.speed);
					break;
					case 'topLeft':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:0,left:0}).animate({opacity:1,top:modalbox.topCenter,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'topRight':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:0,left:modalbox.right}).animate({opacity:1,top:modalbox.topCenter,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'bottomLeft':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:modalbox.bottom,left:0}).animate({opacity:1,top:modalbox.topCenter,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'bottomRight':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:modalbox.bottom,left:modalbox.right}).animate({opacity:1,top:modalbox.topCenter,left:modalbox.leftCenter},options.animate.speed);
					break;
					case 'topFade':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:(modalbox.topCenter-25),left:modalbox.leftCenter}).animate({opacity:1,top:modalbox.topCenter},options.animate.speed);
					break;
					case 'bottomFade':
						modalbox.background.fadeIn(options.animate.speed);
						modalbox.dialog.css({opacity:0,top:(modalbox.topCenter+25),left:modalbox.leftCenter}).animate({opacity:1,top:modalbox.topCenter},options.animate.speed);
					break;
				}
			} else {
				modalbox.background.show();
				modalbox.dialog.css({left:modalbox.leftCenter,top:modalbox.topCenter});
			}
			
			modalbox.timeout = $('<div/>', {'class':options.style.timeout,css:{'display':'none'}});
			modalbox.timeout.appendTo(modalbox.buttons);			

		}

		var modalPosition = function() {
			modalbox.leftCenter = (document.documentElement.clientWidth-modalbox.dialog.width())*0.50;
			modalbox.topCenter = (document.documentElement.clientHeight-modalbox.dialog.height())*0.50;
			modalbox.dialog.stop().animate({left:modalbox.leftCenter,top:modalbox.topCenter});
		}
		
		var modalKeylist = { enter : 13, space : 32, escape : 27 };
		
		var modalKeydown = function(event) {
			event = event || window.event;
			if (options.type=='confirmation' || options.type=='information') {
				if (event.keyCode==modalKeylist.escape) {
					event.returnValue = false;
					if (event.preventDefault) {
						event.preventDefault();
					}
					modalbox.response = false;
					modalbox.removeDialog();
				}
				if (event.keyCode==modalKeylist.enter || event.keyCode==modalKeylist.space) {
					event.returnValue = false;
					if (event.preventDefault) {
						event.preventDefault();
					}
					modalbox.response = true;
					modalbox.removeDialog();
				}
			}
		}
		
		modalbox.addEventListener = function(target,event,callback,useCapture) {
			if ( typeof target.addEventListener === 'function' ) {
				target.addEventListener(event,callback,useCapture);
			} else if ( target.attachEvent ) {
				target.attachEvent(event,callback,useCapture);
			}
		}

		modalbox.removeEventListener = function(target,event,callback,useCapture) {
			if (typeof target.removeEventListener === 'function') {
				target.removeEventListener(event,callback,useCapture);
			} else if ( target.detachEvent ) {
				target.detachEvent(event,callback,useCapture);
			}
		}
		
		modalbox.getUniqueId = function(randLength) {
			var numbers = [];
			for (var i=0; i<randLength; i++) {
				numbers.push(Math.floor(Math.random()*10));
			}
			return numbers.join('');
		}

		modalbox.addUseKey = function() {
			if (options.usekey) {
				modalbox.addEventListener(document,'keydown',modalKeydown,false);
				modalbox.addEventListener(document,'onkeydown',modalKeydown,false);
			}
		}

		modalbox.removeUseKey = function() {
			if (options.usekey) {
				modalbox.removeEventListener(document,'keydown',modalKeydown,false);
				modalbox.removeEventListener(document,'onkeydown',modalKeydown,false);
			}
		}
		
		modalbox.closeDialog = function() {
			modalbox.dialog.remove();
			modalbox.background.remove();
			modalbox.removeEventListener(window,'resize',modalPosition,false);
			modalbox.removeEventListener(window,'onresize',modalPosition,false);
			modalbox.removeUseKey();
			if (typeof parseInt(options.timeout.second) == 'number' && parseInt(options.timeout.second) > 0) {
				clearInterval(modalbox.interval);
			}
			if (typeof callback === 'function') {
				callback.call(target,modalbox.response);
			}
			delete $.DialogBoxArray[modalbox.id];
			var LastDialogBox = false;
			for ( var i in $.DialogBoxArray ) {
				LastDialogBox = i;
			}
			if (LastDialogBox) {
				$.DialogBoxArray[LastDialogBox].show();
			}
		}

		modalbox.removeDialog = function() {
		
			if (typeof modalbox.response === 'undefined') {
				modalbox.response = false;
			}
			if (options.animate.speed && options.animate.close) {
				switch(options.animate.close) {
					case 'top':
						modalbox.dialog.animate({top:"+=50"},'fast',function() {
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,top:0},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'left':
						modalbox.dialog.animate({left:"+=50"},'fast',function() {
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:0},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'right':
						modalbox.dialog.animate({left:"-=50"},'fast',function() {
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:modalbox.right},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'bottom':
						modalbox.dialog.animate({top:"-=50"},'fast',function() {
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,top:modalbox.bottom},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'topLeft':
						modalbox.dialog.animate({left:"+=50",top:"+=50"},'fast', function(){
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:0,top:0},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'topRight':
						modalbox.dialog.animate({left:"-=50",top:"+=50"},'fast', function(){
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:modalbox.right,top:0},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'bottomLeft':
						modalbox.dialog.animate({left:"+=50",top:"-=50"},'fast', function(){
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:0,top:modalbox.bottom},options.animate.speed, function(){
								modalbox.closeDialog();
							});	
						});
					break;
					case 'bottomRight':
						modalbox.dialog.animate({left:"-=50",top:"-=50"},'fast', function(){
							modalbox.background.fadeOut(options.animate.speed);
							modalbox.dialog.animate({opacity:0,left:modalbox.right,top:modalbox.bottom},options.animate.speed, function(){
								modalbox.closeDialog();
							});
						});
					break;
					case 'fadeOut':
						modalbox.background.fadeOut(options.animate.speed);
						modalbox.dialog.animate({opacity:0},options.animate.speed, function(){
							modalbox.closeDialog();
						});
					break;
				}
			} else {
				modalbox.closeDialog();
			}

		}

		modalbox.insertDialog = function() {

			for ( var i in $.DialogBoxArray ) {
				$.DialogBoxArray[i].hide();
			}

			if (typeof modalbox.id === 'undefined') {
				modalbox.id = modalbox.getUniqueId(48);
			}

			modalbox.createDialog();
			modalbox.addEventListener(window,'resize',modalPosition,false);
			modalbox.addEventListener(window,'onresize',modalPosition,false);
			modalbox.addUseKey();
			
			if ( typeof parseInt(options.timeout.second) == 'number' && parseInt(options.timeout.second) > 0 ) {
				modalbox.remaining = parseInt(options.timeout.second);
				modalbox.timeout.html(modalbox.remaining);
				if (options.timeout.screen) {
					modalbox.timeout.css({'display':'block'});
				}
				modalbox.interval = setInterval(function() {
					if (modalbox.remaining>0) {
						modalbox.remaining--;
						modalbox.timeout.html(modalbox.remaining);
					}
					if (modalbox.remaining==0) {
						modalbox.removeDialog();
					}
				},1000);
				
			}
			
			output = {
				title: function(title) {
					modalbox.title.html(title);
				},
				content: function(content) {
					modalbox.description.html(content);
				},
				hide: function() {
					modalbox.removeUseKey();
					modalbox.dialog.hide();
					modalbox.background.hide();
				},
				show: function() {
					modalbox.addUseKey();
					modalbox.dialog.fadeIn();
					modalbox.background.fadeIn();	
				},
				close: function() {
					modalbox.removeDialog();
				}
			};

			$.DialogBoxArray[modalbox.id] = output;
			
			return output;

		}

		return modalbox.insertDialog();

	}

})(jQuery);
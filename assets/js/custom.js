var windowWidth = window.innerWidth,
	windowHeight = window.innerHeight,
	scrollPosition = $(window).scrollTop();

$(document).ready(function() {
	$('#slide-next').click(function(){
		$('#logo').addClass('white');
	});
    $('#slide-one').css({
    	'width': windowWidth,
    	'min-height': windowHeight
    });

    $('.list-case-studies li').click(function(){
    	$(this).parent().css({
    		'position': 'static',
    		'box-shadow': '0px 0px 0px 0px #000000'
    	});
    	$('.list-case-studies li').hide();
    	$(this).show();
		$(this).addClass('active');
		$('.close').fadeIn();
	});

	$('a.close').click(function(){
		$('.list-case-studies').css({
    		'position': 'relative',
    		'box-shadow': '0px 0px 5px 5px rgba(0,0,0,0.25)'
    	});
		$('.list-case-studies li').removeClass('active');
		$('.list-case-studies li').show();
		$('.close').hide();
        $('.slimScroll').slimScroll({ destroy: true });
	});

    $(".footer-nav > ul > li").click(function() {
        $(".footer-nav > ul > li").find("ul").fadeOut();
        $(this).find("ul").fadeIn();
        $(".footer-nav > ul > li").removeClass("active");
        $(this).addClass("active");
    });

    // Window Load
    $(window).resize(function(){
    	windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
    	$('#slide-one').css({
	    	'width': windowWidth,
	    	'min-height': windowHeight
	    });
    });
	
	
	
});
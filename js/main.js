
(function($) {
 $('#clock').countdown('2016/5/1', function(event) {
  $(this).html(event.strftime('%D days %H:%M:%S'));
});

	'use strict';
	
	//-- function to reveal element that entering viewport (in info section)
	function RevealElement(){
		'use strict';
		
		var topOfWindow;
		var revealFactor = $(window).height();
				
		//-- if in extra small device
		if($(window).width()<768){
			topOfWindow = $(window).scrollTop();
		}
		else{
			topOfWindow = $('#info-wrapper').scrollTop();
		}
		
		var element_class = ["close-link","about","subscribe","contact","back-to-top"];
		
		for(var i=0;i<element_class.length;i++){
			if($('.'+element_class[i]).offset().top < (topOfWindow+revealFactor)){
				$('.'+element_class[i]).addClass('fadeInUp');
			}
		}
	}
	
	//-- show home element
	$(window).load(function() {
		$('#preloader').addClass('fadeOut');
		//-- hide preloader div
		setTimeout(function(){
			$('#preloader').css('z-index','1');
		},1000);
		
		//-- disable hide-after class (hide after -> for smoother animation on entrance)
		setTimeout(function(){
			$('.info-link').removeClass('hide-after');
		},1500);
		
		
		$('header, .home h1, .days_dash').addClass('fadeInDown');
		$('footer, .info-link, .hours_dash').addClass('fadeInUp');
	});
	
	//-- reveal element on scroll (in info section)
	$('#info-wrapper').scroll(function(){
		if($('#info-wrapper').is(':visible')){
			RevealElement();
		}
	});
	
	//-- reveal element on scroll (in info section) -- IN SMALL DEVICES
	$(window).scroll(function(){
		if($(window).width()<768){
			if($('#info-wrapper').is(':visible')){
				RevealElement();
			}
		}
	});
	
	//-- open theme switcher
	$('.switch').click(function(e) {
        if($('#theme-switcher').hasClass('open')){
			$('#theme-switcher').removeClass('open');
		}
		else{
			$('#theme-switcher').addClass('open');
		}
    });
	
	//-- change color theme
	$('.switch-theme').each(function(index, element) {
        $(this).on("click",function(){
			$('#current-theme').attr('href',$(this).attr('data-theme'));
		});
    });
	
	//-- more info clicked
	$('.more-info').click(function(e) {
		//-- set scroll top to 0
		$('html,body').animate({
			scrollTop:0
		},100,"easeOutCirc",function(){
			//-- hide home section
		$('#home-wrapper').addClass('zoomOut');
		
		//-- show info section
		$('#info-wrapper').show('fast',function(){
			$(this).css({
				opacity:1,
				top:0
			});
		});
				
		//-- show info content
		setTimeout(function(){
			RevealElement();
			//-- hide gradient overlay
			$('.overlay').css('opacity',0);
			
			//-- for smoother entrance animation
			$('.info-link').addClass('hide-after');
		},1000);
		});
    });
	
	//-- close info link clicked
	$('.close-info').click(function(e) {
        //-- hide info section
		$('#info-wrapper').css({
			opacity:0,
			top:'100%'
		});
		
		//-- show gradient overlay
		$('.overlay').css('opacity',0.9);
		
		setTimeout(function(){
			$('#info-wrapper').hide();
			
			//-- enable :after and :before hover effect
			$('.info-link').removeClass('hide-after');
		},1000);
		
		//-- show home element
		$('#home-wrapper').removeClass('zoomOut').addClass('zoomIn');
    });
		
    //-- activate backstretch
	$.backstretch([
		"img/sample.jpg",
		"img/sample2.jpg"
		
	],{
		duration:6000,
		fade:'normal'
	});
	
	//-- activate countdown
	$('.countdown').countDown({
		targetDate: {
			'day': 		0,
			'month': 	0,
			'year': 	0,
			'hour': 	0,
			'min': 		0,
			'sec': 		0
		},
		omitWeeks:true
	});
	
	//-- back to top link clicked
	$('.back-to-top').click(function(e) {
        $('#info-wrapper, html, body').animate({
			scrollTop:0
		},1000,"easeOutCirc");
    });
		
})(jQuery);
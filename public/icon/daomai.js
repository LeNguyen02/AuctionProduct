$(document).ready(function(e) {
	var sw = 0;
	if (typeof(window.innerWidth) == 'number') {
		sw = window.innerWidth;
	} else if (document.documentElement && document.documentElement.clientWidth) {
		sw = document.documentElement.clientWidth;

	} else if (document.body && document.body.clientWidth) {
		sw = document.body.clientWidth;
	};

	function hoaroi_free() {
		setTimeout(function() {
			window.requestAnimationFrame(hoaroi_free);
		}, 1000);
		var size = (Math.floor(Math.random() * (30 - 10)) + 10);
		var xPosition = (Math.floor(Math.random() * (sw - size-2)) + (size+2));
		var yPosition = 0;
		var l = document.createElement("DIV");
		l.style.width = size + "px";
		l.style.height = size + "px";
		l.style.backgroundImage = "url(http://172.31.5.42/ESUN_Data/icon/daomai.png)";
		var bg_pos = (Math.floor(Math.random() * 4));
		l.style.backgroundPosition = "0px -"+(size*bg_pos)+"px";
		l.style.backgroundSize = size + "px "+4*size+"px"
		l.style.position = "absolute";
		l.style.left = (xPosition) + "px";
		l.style.top = (yPosition + 10) + "px";
		l.style.zIndex = 9999;
		l.style.display = 'none';
		document.body.appendChild(l);
		$(l).fadeIn(500);
		var stop = false;
		var hoaroi = function() {
			if (!stop) {
				setTimeout(function() {
					window.requestAnimationFrame(hoaroi);
				}, 20);
				l.style.top = (parseInt($(l).css('top'), 10) + 1) + "px";
				if ((parseInt($(l).css('top'), 10)) % 10 == 0) {
					if (Math.random() < 0.5) {
						l.style.left = (parseInt($(l).css('left'), 10) + 1) + "px";
					} else {
						l.style.left = (parseInt($(l).css('left'), 10) - 1) + "px";
					}
				}
			}
		}
		window.requestAnimationFrame(hoaroi);
		setTimeout(function() {
			$(l).fadeOut((Math.floor(Math.random() * (6000 - 2500)) + 2500), function() {
				$(l).remove();
				stop = true;
			});
		}, (Math.floor(Math.random() * (15000 - 5000)) + 5000));
	}
	window.requestAnimationFrame(hoaroi_free);


});
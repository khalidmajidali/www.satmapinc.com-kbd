/* Counter Starts */
	    	// var myCounter = new flipCounter('flip-counter', {value:470211111, inc:123, pace:600, auto:true});
	    	var myCounterFunction = $(function () {
		    	var nextCall = 60000,
		    	inc = 10,
		    	randomFactor = .2;
		    	var t = $.now();
		    	var url = "http://satmapinc.com/SatmapForms/CallHandler.ashx";
		    	if (window.location.toString().indexOf("www") != -1) {
		    		url = "http://www.satmapinc.com/SatmapForms/CallHandler.ashx";
		    	}

		    	var myCounter;
		    	loadCounter();
		    	setCounter();

		    	function loadCounter() {
		    		try {
		    			var values;
		    			$.get(url, function (html) {
		    				values = html.split("|");
		    				inc = parseFloat(values[1]);
		    				nextCall = parseFloat(values[2]) * 60000;
		    				randomFactor = parseFloat(values[3]);

		    				if (myCounter === undefined) {
		    					myCounter = new flipCounter('flip-counter', {
		    						value: parseFloat(values[0]),
		    						inc: getRandomInt(inc * (randomFactor), inc * (2 - randomFactor)),
		    						pace: 1000,
		    						auto: true
		    					});
		    				} else {
		    					myCounter.setIncrement(getRandomInt(inc * (randomFactor), inc * (2 - randomFactor)));
		    				}
		    				t = $.now();
		    			});
		    		} catch (err) {
		    			console.log(err);
		    		}
		    		setTimeout(function () {
		    			loadCounter();
		    			console.log("Timer Set");
		    		}, nextCall);
		    	}

		    	function getRandomInt(min, max) {
		    		return Math.floor(Math.random() * (max - min + 1) + min);
		    	}

		    	function setCounter() {
		    		try {
		    			var myPace = getRandomInt(1000 * (randomFactor), 1000 * (2 - randomFactor));
		    			if (myCounter != undefined) {
		    				myCounter.setIncrement(getRandomInt(inc * (randomFactor), inc * (2 - randomFactor)));
		    				myCounter.setPace(myPace);
		    			}
		    		} catch (err) {
		    			console.log(err);
		    		}
		    		setTimeout(function () {
		    			setCounter();
		    		}, myPace);
		    	}
		    }); /* Counter Ends */
		});
/* swipelistener.js
 *
 * Copyright 2014 Kyle Paulsen, jQuery Foundation, Inc. and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Swipe event listeners with a small footprint.
 *
 * NOTE: This library HEAVILY (almost 100%) borrows code from jquery mobile's implementation.
 * Basically this file: https://github.com/jquery/jquery-mobile/blob/master/js/events/touch.js
 * was converted into what you see below. That being said, they deserve most of the credit.
 * I just wanted to use their events without having to load all of jQuery and jQuery mobile.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function swipeListener(el, gestureType, func) {
    var supportTouch = "ontouchend" in document;
    var touchStartEvent = supportTouch ? "touchstart" : "mousedown";
    var touchStopEvent = supportTouch ? "touchend" : "mouseup";
    var touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

    var gestureEventInProgress = false;

    // More than this horizontal displacement, and we will suppress scrolling.
    var scrollSupressionThreshold = 30;

    // More time than this, and it isn't a swipe.
    var durationThreshold = 1000;

    // Swipe horizontal displacement must be more than this.
    var horizontalDistanceThreshold = 30;

    // Swipe vertical displacement must be less than this.
    var verticalDistanceThreshold = 30;

    var getLocation = function(event) {
        var winPageX = window.pageXOffset;
        var winPageY = window.pageYOffset;
        var x = event.clientX;
        var y = event.clientY;

        if (event.pageY === 0 && Math.floor(y) > Math.floor(event.pageY) ||
            event.pageX === 0 && Math.floor(x) > Math.floor(event.pageX)) {

            // iOS4 clientX/clientY have the value that should have been
            // in pageX/pageY. While pageX/page/ have the value 0
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < (event.pageY - winPageY) || x < (event.pageX - winPageX)) {

            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page. Detectable since clientX/clientY
            // should never be smaller than pageX/pageY minus page scroll
            x = event.pageX - winPageX;
            y = event.pageY - winPageY;
        }

        return {x: x, y: y};
    };

    var swipeStart = function(event) {
        var data = event.touches ? event.touches[0] : event;
        var location = getLocation(data);
        return {
            time: (new Date()).getTime(),
            coords: [location.x, location.y],
            origin: event.target
        };
    };

    var swipeStop = function(event) {
        var data = event.touches ? event.touches[0] : event;
        var location = getLocation(data);
        return {
            time: (new Date()).getTime(),
            coords: [location.x, location.y]
        };
    };

    var handleSwipe = function(start, stop, origTarget) {
        var withinTimeDelta = stop.time - start.time < durationThreshold;
        var withinHorizontalThreshhold = Math.abs(start.coords[0] - stop.coords[0]) > horizontalDistanceThreshold;
        var withinVerticalThreshhold = Math.abs(start.coords[1] - stop.coords[1]) > verticalDistanceThreshold;

        var xDiff = Math.abs(start.coords[0] - stop.coords[0]);
        var yDiff = Math.abs(start.coords[1] - stop.coords[1]);
        if (withinTimeDelta && (withinHorizontalThreshhold || withinVerticalThreshhold)) {
            var direction;
            if (xDiff > yDiff) {
                direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
            } else {
                direction = start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown";
            }

            if (direction === gestureType || gestureType === "swipe") {
                func.call(el, {target: origTarget, swipestart: start, swipestop: stop, type: direction});
            }

            return true;
        }
        return false;
    };

    var init = function(event) {
        if (gestureEventInProgress) {
            // not sure if this will ever happen.
            return false;
        }
        gestureEventInProgress = true;

        var stop;
        var start = swipeStart(event);
        var origTarget = event.target;
        var emitted = false;

        var preventedDefault = false;
        var moveHandler = function(event) {
            if (!swipeListener.allowScrolling) {
                event.preventDefault();
            }

            if (!start || preventedDefault) {
                return;
            }

            stop = swipeStop(event);
            if (!emitted) {
                emitted = handleSwipe(start, stop, origTarget);
                if (emitted) {
                    gestureEventInProgress = false;
                }
            }
            // prevent scrolling
            var xDiff = Math.abs(start.coords[0] - stop.coords[0]);
            var yDiff = Math.abs(start.coords[1] - stop.coords[1]);
            if (xDiff > scrollSupressionThreshold || yDiff > scrollSupressionThreshold) {
                event.preventDefault();
                preventedDefault = true;
            }
        };

        var stopHandler = function() {
            emitted = true;
            gestureEventInProgress = false;
            document.removeEventListener(touchMoveEvent, moveHandler);
            document.removeEventListener(touchStopEvent, stopHandler);
            moveHandler = null; // not sure why this is here.
        };

        document.addEventListener(touchMoveEvent, moveHandler);
        document.addEventListener(touchStopEvent, stopHandler);
    };

    el.addEventListener(touchStartEvent, init);

    return {
        remove: function() {
            el.removeEventListener(touchStartEvent, init);
        }
    };
}
if (typeof window !== "undefined") {
    if (typeof window.define === "function" && window.define.amd) {
        window.define(swipeListener);
    }
    window.swipeListener = swipeListener;
}
if (typeof module !== "undefined") {
    module.exports = swipeListener;
}

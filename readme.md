# SwipeListener

Swipe event listeners with a small footprint.

For those who want simple swipeleft, swiperight, swipeup and swipedown events without having to use jquery and jquery mobile. Less than 1kb minified and gzipped. Less than 2kb just minified.

Most of this library is made up of code from the jquery mobile library. But only the parts needed to get swipe events.

Download the min or full source and put it on your page.

# Usage

```javascript
swipeListener(document.getElementById("hello"), "swipeleft", function(e) {
    this.innerHTML = "Swiped Left!!";
});
```

* The first argument is the element you want to bind to.
* The second argument is the event type which can be:
  * swipeleft
  * swiperight
  * swipeup
  * swipedown
  * swipe - this gets called on any swipe event.
* The third argument is your callback which gets passed an object that looks like:

```javascript
{
    target: the_element_that_was_swiped_on,
    swipestart: the_touchstart_event,
    swipestop: the_touchend_event,
    type: "swipeleft", "swiperight", "swipeup", or "swipedown"
}
```

You can use the 'this' keyword in your callback to refer to the element you bound to.

A final thing you can do is set swipeListener.allowScrolling = true to allow scrolling while swiping on a bound event. This is a site wide setting.

Have fun.

# License

MIT

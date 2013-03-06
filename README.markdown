#jquery.gridnav - Grid Navigation Effects with jQuery

Shared by [Mary Lou](https://twitter.com/crnacura) on [Codrops](http://tympanus.net/codrops/), the jQuery plugin for grid navigation through a set of thumbnails is perfect for galleries, featured images or what else you want.

##Examples

You can see the original examples [here](http://tympanus.net/codrops/2011/06/09/grid-navigation-effects/)

You can [download](https://github.com/douglasmiranda/jquery.gridnav/archive/master.zip) and see the new features on the [example/example.html](https://github.com/douglasmiranda/jquery.gridnav/blob/master/example/example.html).

##What Changed?

Originally the plugin do not provide the option "auto", that is, to see more images you have to click in "next" or "prev" button.

I added a way to do this.

##How?

The "timeout" option have to be added when initializing the plugin.

```javascript
$(function() {
    $('#images-container').gridnav({
        type: {
            timeout: 4000
        }
    });
});
```

Then, every 4 seconds the images will move automatically.

##What others options do I have?

```javascript
$('#images-container').gridnav({
    rows: 2,
    navL: '#images-container-prev',
    navR: '#images-container-next',
    navDots: '#images-container-dots',
    type: {
        mode: 'sequpdown',
        speed: 400,
        easing: '',
        factor: 50,
        reverse: false
    }
});
```

###The following parameters can be used/set:

* __rows:__ the number of rows to be shown in the grid
* __navL/navR:__ the selectors for the previous and next navigation elements
* __navDots:__ the selectors for dots elements
* __mode:__ the type of animation; you can use def | fade | seqfade | updown | sequpdown | showhide | disperse | rows
* __speed:__ the speed of the animation for fade, seqfade, updown, sequpdown, showhide, disperse, rows
* __easing:__ the easing effect for fade, seqfade, updown, sequpdown, showhide, disperse, rows
* __factor:__ delay between each item animation for seqfade, sequpdown; amount of pixels the row move when using rows
* __reverse:__ for reversing the order when using sequpdown


###Contributors

These guys help me make it better. Thanks, guys!

[@hiryu85](https://github.com/hiryu85)
[@nbraem](https://github.com/nbraem)

##Licence

This plugin can be used freely in personal and commercial projects. But just in case, you should read this http://tympanus.net/codrops/licensing/
/**
 * Codrops - 2011
 *
 * This plugin can be used freely in personal and commercial projects.
 * But just in case, you should read this http://tympanus.net/codrops/licensing/
 * "timeout" option added by Douglas Miranda - http://douglasmiranda.com
 */
(function($) {
    jQuery.fn.reverse = Array.prototype.reverse;

    var
        // auxiliar functions
        aux     = {
            setup               : function( $wrapper, $items, opts ) {

                // set the wrappers position to relative
                $wrapper.css('position', 'relative');

                // save the items position
                aux.saveInitialPosition( $items );

                // set the items to absolute and assign top & left
                $items.each(function(i) {
                    var $item   = $(this);

                    $item.css({
                        position    : 'absolute',
                        left        : $item.data('left'),
                        top         : $item.data('top')
                    });
                });

                    // check how many items we have per row
                var rowCount    = Math.floor( $wrapper.width() / $items.width() ),
                    // number of items to show is rowCount * n rows
                    shown       = rowCount * opts.rows,
                    // total number of rows
                    totalRows   = Math.ceil( $items.length / rowCount );

                // save this values for later
                var config          = {};
                config.currentRow   = 1;
                config.totalRows    = totalRows;
                config.rowCount     = rowCount;
                config.shownItems   = shown;
                $wrapper.data('config', config);

                // show n rowns
                $wrapper.children(':gt(' + (shown - 1) + ')').hide();

                // assign row classes to the items
                $items.each(function(i) {
                    var $item   = $(this),
                        row     = Math.ceil( (i + 1) / rowCount );

                    $item.addClass('tj_row_' + row);
                });

                // Navigation dots
                if ($d_nav.length > 0) {
                    var _dots = [];
                    for(var _i=0; _i < aux.get_pages($wrapper); _i++) _dots.push( $('<li />') );

                    $d_nav.html(_dots).end().find('li:first-child').addClass('active');
                    delete _dots;
                }

                nav.setup( $wrapper, $items, opts );

            },
            saveInitialPosition : function( $items ) {
                $items.each(function(i) {
                    var $item   = $(this);

                    $item.data({
                        left        : $item.position().left + 'px',
                        top         : $item.position().top + 'px'
                    });
                });
            },
            // Pagination
            get_page            : function($wrapper) {
                var config = $wrapper.data('config');
                return Math.ceil( config.currentRow / config.rowCount );
            },
            get_pages           : function($wrapper) {
                var config = $wrapper.data('config');
                return Math.ceil( config.totalRows / config.rowCount );
            },
            has_next            : function($wrapper) {
                return aux.get_page($wrapper) < aux.get_pages($wrapper) ? true : false;
            },
            has_prev            : function($wrapper) {
                return aux.get_page($wrapper) > 1 ? true : false;
            }
        },
        // navigation types
        nav     = {
            setup           : function( $wrapper, $items, opts ) {
                nav[opts.type.mode].setup( $wrapper, $items, opts );
            },
            def             : {
                setup       : function( $wrapper, $items, opts ) {
                    var config = $wrapper.data('config');

                    $items.each(function(i) {
                        var $item   = $(this),
                            row     = Math.ceil( (i + 1) / config.rowCount ),
                            t,
                            f = row % opts.rows;

                        if( f === 1 ) {
                            t = '0px';
                        } else if( f === 0 ) {
                            t = (opts.rows - 1) * $items.height()  + 'px';
                        } else {
                            t = (f - 1) * $items.height() + 'px';
                        }

                        $item.css({ top : t });
                    });
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];

                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));

                        nextRows.push(
                            dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    currentRows = currentRows.join(','), nextRows = nextRows.join(',');

                    $wrapper.children(currentRows).hide();
                    $wrapper.children(nextRows).show();

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data( 'anim', false );

                    $wrapper.data('config', config);
                }
            },
            fade            : {
                setup       : function( $wrapper, $items, opts ) {
                    // same like def mode
                    nav['def'].setup( $wrapper, $items, opts );
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];

                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));

                        nextRows.push(
                            dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    nextRows = nextRows.join(',');
                    $wrapper.children(currentRows).fadeOut( opts.type.speed, opts.type.easing );

                    var $nextRowElements= $wrapper.children(nextRows),

                        totalNextRows   = $nextRowElements.length,
                        cnt             = 0;

                    $nextRowElements.fadeIn( opts.type.speed, opts.type.easing, function() {
                        ++cnt;
                        if( cnt === totalNextRows ) {
                            $wrapper.data( 'anim', false );
                        }
                    });

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data('config', config);
                }
            },
            seqfade         : {
                setup       : function( $wrapper, $items, opts ) {
                    // same like def mode
                    nav['def'].setup( $wrapper, $items, opts );
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];
                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));
                        nextRows.push( dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    currentRows = currentRows.join(','), nextRows = nextRows.join(',');
                    var seq_t   = opts.type.factor;

                    var $currentRowElements;
                    ( dir === 1 )
                        ? $currentRowElements = $wrapper.children(currentRows)
                        : $currentRowElements = $wrapper.children(currentRows).reverse();

                    $currentRowElements.each(function(i) {
                        var $el = $(this);
                        setTimeout(function() {
                            $el.fadeOut( opts.type.speed, opts.type.easing )
                        }, seq_t + i * seq_t);
                    });

                    var $nextRowElements;
                    ( dir === 1 )
                        ? $nextRowElements = $wrapper.children(nextRows)
                        : $nextRowElements = $wrapper.children(nextRows).reverse();

                    var total_elems = $nextRowElements.length,
                        cnt         = 0;

                    $nextRowElements.each(function(i) {
                        var $el = $(this);
                        setTimeout(function() {
                            $el.fadeIn( opts.type.speed, opts.type.easing, function() {
                                ++cnt;
                                if( cnt === total_elems ) {
                                    $wrapper.data( 'anim', false );
                                }
                            })
                        }, (seq_t * 2) + i * seq_t);
                    });

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data('config', config);
                }
            },
            updown          : {
                setup       : function( $wrapper, $items, opts ) {
                    var config = $wrapper.data('config');

                    $wrapper.children(':gt(' + (config.shownItems - 1) + ')').css('opacity', 0);

                    $items.each(function(i) {
                        var $item   = $(this),
                            row     = Math.ceil( (i + 1) / config.rowCount ),
                            t       = $item.position().top,
                            f = row % opts.rows;

                        if( row > opts.rows ) {
                            t = (opts.rows * $items.height());
                        }

                        $item.css({ top : t + 'px'});
                    });
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - 1 <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var movingRows  = [];

                    for( var i = 0; i <= opts.rows; ++i ) {
                        movingRows.push( dir === 1
                            ? '.tj_row_' + (config.currentRow + i)
                            : '.tj_row_' + (config.currentRow + (i - 1))
                        );
                    }

                    movingRows = movingRows.join(',');
                    var $elements;

                    ( dir === 1 )
                        ? $elements = $wrapper.children(movingRows)
                        : $elements = $wrapper.children(movingRows).reverse();

                    var total_elems = $elements.length,
                        cnt         = 0;

                    $elements.each(function(i) {
                        var $el         = $(this),
                            row         = $el.attr('class'),
                            animParam   = {},

                            currentRow  = config.currentRow;

                        // if first row fade out
                        // if last row fade in
                        // for all the rows move them up / down
                        if( dir === 1 ) {
                            if(  row === 'tj_row_' + (currentRow) ) {
                                animParam.opacity   = 0;
                            }
                            else if( row === 'tj_row_' + (currentRow + opts.rows) ) {
                                animParam.opacity   = 1;
                            }
                        }
                        else {
                            if(  row === 'tj_row_' + (currentRow - 1) ) {
                                animParam.opacity   = 1;
                            }
                            else if( row === 'tj_row_' + (currentRow + opts.rows - 1) ) {
                                animParam.opacity   = 0;
                            }
                        }

                        $el.show();

                        (dir === 1)
                            ? animParam.top = $el.position().top - $el.height() + 'px'
                            : animParam.top = $el.position().top + $el.height() + 'px'

                        $el.stop().animate(animParam, opts.type.speed, opts.type.easing, function() {
                            if( parseInt( animParam.top ) < 0 || parseInt( animParam.top ) > $el.height() * (opts.rows - 1) )
                                $el.hide();

                            ++cnt;
                            if( cnt === total_elems ) {
                                $wrapper.data( 'anim', false );
                            }
                        });
                    });

                    (dir === 1) ? config.currentRow += 1 : config.currentRow -= 1;

                    $wrapper.data('config', config);
                }
            },
            sequpdown       : {
                setup       : function( $wrapper, $items, opts ) {
                    // same like updown mode
                    nav['updown'].setup( $wrapper, $items, opts );
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - 1 <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var movingRows  = [];

                    for( var i = 0; i <= opts.rows; ++i ) {
                        movingRows.push( dir === 1
                            ? '.tj_row_' + (config.currentRow + i)
                            : '.tj_row_' + (config.currentRow + (i - 1)));
                    }

                    movingRows = movingRows.join(',')

                    var seq_t   = opts.type.factor,
                        $elements;

                    var dircond = 1;
                    if( opts.type.reverse ) dircond = -1;
                    ( dir === dircond )
                        ? $elements = $wrapper.children(movingRows)
                        : $elements = $wrapper.children(movingRows).reverse();

                    var total_elems = $elements.length,
                        cnt         = 0;

                    $elements.each(function(i) {
                        var $el         = $(this),
                            row         = $el.attr('class'),
                            animParam   = {},

                            currentRow  = config.currentRow;

                        setTimeout(function() {
                            // if first row fade out
                            // if last row fade in
                            // for all the rows move them up / down
                            if( dir === 1 ) {
                                if(  row === 'tj_row_' + (currentRow) ) {
                                    animParam.opacity   = 0;
                                }
                                else if( row === 'tj_row_' + (currentRow + opts.rows) ) {
                                    animParam.opacity   = 1;
                                }
                            }
                            else {
                                if(  row === 'tj_row_' + (currentRow - 1) ) {
                                    animParam.opacity   = 1;
                                }
                                else if( row === 'tj_row_' + (currentRow + opts.rows - 1) ) {
                                    animParam.opacity   = 0;
                                }
                            }

                            $el.show();

                            (dir === 1)
                                ? animParam.top = $el.position().top - $el.height() + 'px'
                                : animParam.top = $el.position().top + $el.height() + 'px'

                            $el.stop().animate(animParam, opts.type.speed, opts.type.easing, function() {
                                if( parseInt( animParam.top ) < 0 || parseInt( animParam.top ) > $el.height() * (opts.rows - 1) )
                                    $el.hide();

                                ++cnt;
                                if( cnt === total_elems ) {
                                    $wrapper.data( 'anim', false );
                                }
                            });
                        }, seq_t + i * seq_t);
                    });

                    (dir === 1) ? config.currentRow += 1 : config.currentRow -= 1;

                    $wrapper.data('config', config);
                }
            },
            showhide        : {
                setup       : function( $wrapper, $items, opts ) {
                    var config = $wrapper.data('config');

                    $items.each(function(i) {
                        var $item   = $(this),
                            row     = Math.ceil( (i + 1) / config.rowCount ),
                            t,
                            f = row % opts.rows;

                        if( f === 1 ) {
                            t = '0px';
                        } else if( f === 0 ) {
                            t = (opts.rows - 1) * $items.height()  + 'px';
                        } else {
                            t = (f - 1) * $items.height() + 'px';
                        }

                        $item.css({ top : t });
                    });
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];

                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));

                        nextRows.push(
                            dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    currentRows = currentRows.join(','), nextRows = nextRows.join(',');
                    $wrapper.children(currentRows).hide( opts.type.speed, opts.type.easing );

                    var $nextRowElements= $wrapper.children(nextRows),
                        totalNextRows   = $nextRowElements.length,
                        cnt             = 0;

                    $nextRowElements.show( opts.type.speed, opts.type.easing, function() {
                        ++cnt;
                        if( cnt === totalNextRows ) {
                            $wrapper.data( 'anim', false );
                        }
                    });

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data('config', config);
                }
            },
            disperse        : {
                setup       : function( $wrapper, $items, opts ) {
                    var config = $wrapper.data('config');

                    $items.each(function(i) {
                        var $item   = $(this),
                            row     = Math.ceil( (i + 1) / config.rowCount ),
                            t,
                            f = row % opts.rows;

                        if( f === 1 ) {
                            t = '0px';
                        } else if( f === 0 ) {
                            t = (opts.rows - 1) * $items.height()  + 'px';
                        } else {
                            t = (f - 1) * $items.height() + 'px';
                        }

                        $item.css({ top : t }).data('top', t);
                    });
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];
                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));

                        nextRows.push(
                            dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    currentRows = currentRows.join(','), nextRows = nextRows.join(',');

                    $wrapper.children(currentRows).each(function(i) {
                        var $el = $(this);
                        $el.stop().animate({
                            left    : $el.position().left + Math.floor( Math.random() * 101 ) - 50 + 'px',
                            top     : $el.position().top + Math.floor( Math.random() * 101 ) - 50 + 'px',
                            opacity : 0
                        }, opts.type.speed, opts.type.easing, function() {
                            $el.css({
                                left    : $el.data('left'),
                                top     : $el.data('top')
                            }).hide();
                        });
                    });

                    var $nextRowElements    = $wrapper.children(nextRows);
                        total_elems         = $nextRowElements.length,
                        cnt                 = 0;

                    $nextRowElements.each(function(i) {
                        var $el = $(this);

                        $el.css({
                            left    : parseInt($el.data('left')) + Math.floor( Math.random() * 301 ) - 150 + 'px',
                            top     : parseInt($el.data('top')) + Math.floor( Math.random() * 301 ) - 150 + 'px',
                            opacity : 0
                        })
                        .show()
                        .animate({
                            left    : $el.data('left'),
                            top     : $el.data('top'),
                            opacity : 1
                        }, opts.type.speed, opts.type.easing, function() {
                            ++cnt;
                            if( cnt === total_elems ) {
                                $wrapper.data( 'anim', false );
                            }
                        });
                    });

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data('config', config);
                }
            },
            rows            : {
                setup       : function( $wrapper, $items, opts ) {
                    // same like def mode
                    nav['def'].setup( $wrapper, $items, opts );
                },
                pagination  : function( $wrapper, dir, opts ) {
                    var config = $wrapper.data('config');

                    if( ( dir === 1 && config.currentRow + opts.rows > config.totalRows ) ||
                        ( dir === -1 && config.currentRow - opts.rows <= 0 )
                    ) {
                        $wrapper.data( 'anim', false );
                        return false;
                    }

                    var currentRows = [], nextRows = [];
                    for( var i = 0; i < opts.rows; ++i ) {
                        currentRows.push('.tj_row_' + (config.currentRow + i));

                        nextRows.push(
                            dir === 1
                            ? '.tj_row_' + (config.currentRow + opts.rows + i)
                            : '.tj_row_' + (config.currentRow - 1 - i)
                        );
                    }
                    currentRows = currentRows.join(','), nextRows = nextRows.join(',');

                    $wrapper.children(currentRows).each(function(i) {
                        var $el     = $(this),
                            rownmb  = $el.attr('class').match(/tj_row_(\d+)/)[1],
                            diff;

                        if( rownmb%2 === 0 ) {
                            diff = opts.type.factor;
                        }
                        else {
                            diff = -opts.type.factor;
                        }

                        $el.stop().animate({
                            left    : $el.position().left + diff + 'px',
                            opacity : 0
                        }, opts.type.speed, opts.type.easing, function() {
                            $el.css({
                                left    : $el.data('left')
                            }).hide();
                        });
                    });

                    var $nextRowElements    = $wrapper.children(nextRows);
                        total_elems         = $nextRowElements.length,
                        cnt                 = 0;

                    $nextRowElements.each(function(i) {
                        var $el = $(this),
                            rownmb  = $el.attr('class').match(/tj_row_(\d+)/)[1],
                            diff;

                        if( rownmb%2 === 0 ) {
                            diff = opts.type.factor;
                        }
                        else {
                            diff = -opts.type.factor;
                        }

                        $el.css({
                            left    : parseInt($el.data('left')) + diff + 'px',
                            opacity : 0
                        })
                        .show()
                        .animate({
                            left    : $el.data('left'),
                            opacity : 1
                        }, opts.type.speed, opts.type.easing, function() {
                            ++cnt;
                            if( cnt === total_elems ) {
                                $wrapper.data( 'anim', false );
                            }
                        });
                    });

                    (dir === 1) ? config.currentRow += opts.rows : config.currentRow -= opts.rows;

                    $wrapper.data('config', config);
                }
            }
        },
        methods = {
            init    : function( options ) {

                if( this.length ) {

                    var settings = {
                        rows    : 2,
                        navL    : '#tj_prev',
                        navR    : '#tj_next',
                        navDots : '#tj_dots',
                        type    : {
                            mode        : 'def',        // use def | fade | seqfade | updown | sequpdown | showhide | disperse | rows
                            speed       : 500,          // for fade, seqfade, updown, sequpdown, showhide, disperse, rows
                            easing      : 'jswing',     // for fade, seqfade, updown, sequpdown, showhide, disperse, rows
                            factor      : 50,           // for seqfade, sequpdown, rows
                            reverse     : false,            // for sequpdown
                            timeout     : 3000
                        }
                    };

                    return this.each(function() {

                        // if options exist, lets merge them with our default settings
                        if ( options ) {
                            $.extend( settings, options );
                        }

                        var $el             = $(this).css( 'visibility', 'hidden' ),
                            // the ul
                            $wrapper        = $el.find('ul.tj_gallery'),
                            // the items
                            $thumbs         = $wrapper.children('li'),
                            total           = $thumbs.length,
                            // the navigation elements
                            $p_nav          = $(settings.navL),
                            $n_nav          = $(settings.navR);
                            $d_nav          = $(settings.navDots);
                            $timeout        = settings.type.timeout;
                            $backToTop = true;

                        // save current row for later (first visible row)
                        //config.currentRow = 1;

                        // flag to control animation progress
                        $wrapper.data( 'anim', false );

                        // preload thumbs
                        var loaded = 0;
                        $thumbs.find('img').each( function(i) {
                            var $img    = $(this);
                            $('<img/>').load( function() {
                                ++loaded;
                                if( loaded === total ) {

                                    // setup
                                    aux.setup( $wrapper, $thumbs, settings );

                                    $el.css( 'visibility', 'visible' );

                                    // navigation events
                                    if( $p_nav.length ) {
                                        $p_nav.bind('click.gridnav', function( e ) {
                                            clearInterval(_interval);
                                            if( $wrapper.data( 'anim' ) ) return false;
                                            $wrapper.data( 'anim', true );

                                            nav[settings.type.mode].pagination( $wrapper, -1, settings );

                                            // Paginator
                                            $p_nav.removeClass('disabled').addClass(aux.has_prev($wrapper) ? '' : 'disabled');
                                            $n_nav.removeClass('disabled').addClass(aux.has_next($wrapper) ? '' : 'disabled');
                                            $d_nav.find('li').removeClass('active').end().find('li:nth-child('+ aux.get_page($wrapper)+')').addClass('active');
                                            return false;
                                        });
                                    }
                                    if( $n_nav.length ) {
                                        $n_nav.bind('click.gridnav', function( e ) {
                                            clearInterval(_interval);
                                            if( $wrapper.data( 'anim' ) ) return false;
                                            $wrapper.data( 'anim', true );
                                            nav[settings.type.mode].pagination( $wrapper, 1, settings );

                                            // Paginator
                                            $p_nav.removeClass('disabled').addClass(aux.has_prev($wrapper) ? '' : 'disabled');
                                            $n_nav.removeClass('disabled').addClass(aux.has_next($wrapper) ? '' : 'disabled');
                                            $d_nav.find('li').removeClass('active').end().find('li:nth-child('+ aux.get_page($wrapper) +')').addClass('active');
                                            return false;
                                        });
                                    }
                                    /*
                                    adds events to the mouse
                                    */
                                    $el.bind('mousewheel.gridnav', function(e, delta) {
                                        if(delta > 0) {
                                            if( $wrapper.data( 'anim' ) ) return false;
                                            $wrapper.data( 'anim', true );
                                            nav[settings.type.mode].pagination( $wrapper, -1, settings );

                                            // Paginator
                                            $p_nav.removeClass('disabled').addClass(aux.has_prev($wrapper) ? '' : 'disabled');
                                            $n_nav.removeClass('disabled').addClass(aux.has_next($wrapper) ? '' : 'disabled');
                                            $d_nav.find('li').removeClass('active').end().find('li:nth-child('+ aux.get_page($wrapper) +')').addClass('active');
                                        }
                                        else {
                                            if( $wrapper.data( 'anim' ) ) return false;
                                            $wrapper.data( 'anim', true );
                                            nav[settings.type.mode].pagination( $wrapper, 1, settings );

                                            // Paginator
                                            $p_nav.removeClass('disabled').addClass(aux.has_prev($wrapper) ? '' : 'disabled');
                                            $n_nav.removeClass('disabled').addClass(aux.has_next($wrapper) ? '' : 'disabled');
                                            $d_nav.find('li').removeClass('active').end().find('li:nth-child('+ aux.get_page($wrapper) +')').addClass('active');
                                        }
                                        return false;
                                    });

                                }
                            }).attr( 'src', $img.attr('src') );
                        });
                        // auto scroll feature, the official plugin does not have so I added
                        function autoScroll() {
                            if( $wrapper.data( 'anim' ) ) return false;
                            config = $wrapper.data( 'config' );
                            if( (config.totalRows) === config.currentRow ) {
                                if( $backToTop === false ) $backToTop = true;
                                $wrapper.data( 'anim', true );
                                nav[settings.type.mode].pagination( $wrapper, -1, settings );
                                return false;
                            } else if( $backToTop === true ) {
                                if( config.currentRow === 1 ) {
                                    $backToTop = false;
                                    $wrapper.data( 'anim', true );
                                    nav[settings.type.mode].pagination( $wrapper, 1, settings );
                                } else {
                                    $wrapper.data( 'anim', true );
                                    nav[settings.type.mode].pagination( $wrapper, -1, settings );
                                }
                                return false;
                            } else if( $backToTop === false ) {
                                $wrapper.data( 'anim', true );
                                nav[settings.type.mode].pagination( $wrapper, 1, settings );
                                return false;
                            }
                        };

                        if( $timeout > 0 ) {
                            var _interval = setInterval(autoScroll, $timeout);

                            // When hovering items
                            $wrapper.hover(
                                function() {
                                    clearInterval(_interval);
                                },
                                function() {
                                    _interval = setInterval(autoScroll, settings.type.timeout );
                                }
                            );
                        }

                    });
                }
            }
        };

    $.fn.gridnav = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.gridnav' );
        }
    };
})(jQuery);

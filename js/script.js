(function () {
    var maxBufferSize = 10;
    var bufferSize;
    var queue = [];
    var kept = [];
    var swept = [];

    window.kos_debug = function() {
        console.log({
            maxBufferSize,
            bufferSize,
            queue,
            kept,
            swept
        });
    }

    // Initialize Twitter embed function
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));


    // Embed a single tweet
    function embedTweet(id_str) {
        return new Promise(function(resolve) {
            twttr.ready(function() {
                twttr.widgets.createTweet(
                    id_str,
                    document.getElementsByClassName('cards')[0],
                    // It seems these parameters are not taken?
                    {
                        width: '550',
                        dnt: 'true'
                    }
                ).then(function(el) {
                    // Add classes for animation
                    $(el).addClass('animated bounceInDown');
                    resolve();
                });
            });
        });
    }


    // Whoosh audio feedback on swipe
    function playWhoosh() {
        // Just a bit of waiting to time it with animation
        setTimeout(function (){
            // Play a random sound of the 14 whooshes
            var audioNumber = Math.floor(Math.random() * 14) + 1;
            $('.whoosh' + audioNumber).trigger('play');
        }, 300);
    }


    function fetchTweets() {
        return $.getJSON('tweet_ids.php')
        .then(function(data) {
            queue = _.shuffle(data);
            bufferSize = Math.min(maxBufferSize, queue.length);
        });
    }


    function embedInitial() {
        var embedPromises = [];
        for (var i = 0; i < bufferSize; ++i) {
            embedPromises.push(embedTweet(queue[i]));
        }
        return Promise.all(embedPromises);
    }


    function keep() {
        var keepElement = $('.cards twitter-widget:first-child');

        // Animate element out and remove from DOM
        keepElement.addClass('bounceOutRight');
        keepElement.fadeOut(function() {
            keepElement.remove();
        });

        // Play whoosh sound effect
        playWhoosh();

        // queue one more
        embedTweet(queue[bufferSize]);

        // move first id in list to kept list
        kept.push(queue.shift());
    }

    function sweep() {
        var sweepElement = $('.cards twitter-widget:first-child');
        var sweepElementId = sweepElement.attr('data-tweet-id');

        // Animate element out and remove from DOM
        sweepElement.addClass('bounceOutLeft');
        sweepElement.fadeOut(function() {
            sweepElement.remove();
        });

        // Play whoosh sound effect
        playWhoosh();

        // ❌ Really delete the element
        // Comment out these lines if you want to test something
        $.ajax({
            url: 'sweep.php?id_str=' + sweepElementId
        });

        // queue one more
        embedTweet(queue[bufferSize]);

        // move first id in list to kept list
        swept.push(queue.shift());

        // Increment sweep counter
        $('.sweep-counter').html(swept.length);
    }


    // Keyboard shortcuts
    document.onkeyup = function(e) {
        // Keep: Space, →, Enter
        if (e.which === 32 || e.which === 39 || e.which === 13) {
            e.preventDefault();
            keep();
        // Sweep: Delete, ←
        } else if (e.which === 46 || e.which === 37) {
            e.preventDefault();
            sweep();
        }
    };


    // Button click events
    $('.keep').click(function(){
        keep();
    });

    $('.sweep').click(function(){
        sweep();
    });


    // Open Twitter log out page on app log out because otherwise it only logs out of Keep or Sweep
    $('.logout').click(function(){
        window.open('https://twitter.com/logout', '_blank').focus();
    });


    // Hide cursor when idle
    // From https://gist.github.com/scmx/1f79adde2e9c69912fee520a246ec9e5
    document.addEventListener('DOMContentLoaded', () => {
        let idleMouseTimer;
        let forceMouseHide = false;

        document.body.style.cursor = 'none';

        // Your wrapper here
        document.body.addEventListener('mousemove', () => {
            if (forceMouseHide) {
                return;
            }

            document.body.style.cursor = '';
            clearTimeout(idleMouseTimer);

            idleMouseTimer = setTimeout(() => {
                document.body.style.cursor = 'none';
                forceMouseHide = true;

                setTimeout(() => {
                    forceMouseHide = false;
                }, 200);
            }, 3000);
        });
    });


    // Start loading more tweets once the initial page is shown
    $(document).ready(function() {
        // Already load the next set of Tweets in the background
        fetchTweets()
        .then(embedInitial)
        .then(function() {
            // Show buttons
            $('.sweep').addClass('animated bounceInLeft').show();
            $('.keep').addClass('animated bounceInRight').show();

            // Hide loading spinner
            $('.loading').removeClass('loading');
        });
    });
})();

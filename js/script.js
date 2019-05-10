var max_id;

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


// randomize function from https://stackoverflow.com/a/11766418
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        // Exclude first card because that is the one shown
        $(this).children(selector).not(':first').sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};


// Embed a single tweet
function embedTweet(id_str) {
    twttr.ready(function() {
        twttr.widgets.createTweet(
            id_str,
            document.getElementsByClassName('cards')[0],
            // It seems these parameters are not taken?
            {
                cards: 'hidden',
                width: '550',
                dnt: 'true'
            }
        ).then(function(el) {
            // Add classes for animation
            $(el).addClass('animated bounceInDown');
        });
    });
}


// Whoosh audio feedback on swipe
function playWhoosh() {
    // Just a bit of waiting to time it with animation
    setTimeout(function (){
        // Play a random sound of the 14 whooshes
        audioNumber = Math.floor(Math.random() * 14) + 1;
        $('.whoosh' + audioNumber).trigger('play');
    }, 300);
}


// Load more Tweets in the background and append them to the list
function loadMore() {
    $.ajax({
        type: 'POST',
        url: 'loadmore.php?id_str=' + max_id,
        success: function(data) {
            $.each(JSON.parse(data), function(key, val) {
                embedTweet(val);
            });

            // Set oldest tweet of the new set as new max_id for next API call
            max_id = JSON.parse(data).sort().reverse().pop();
        }
    });

    // When newly loaded elements are added, everything needs to be shuffled
    $('twitter-widget').randomize();
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

    // The more you interact, the more Tweets are loaded
    loadMore();
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

    // Handle deletion choice checkbox
    if(document.getElementById('checkbox-delete').checked) {
        // Really delete the element
        $.ajax({
            url: 'sweep.php?id_str=' + sweepElementId
        });
        console.log('❌ DELETED ' + sweepElementId);
    } else {
        console.log('COULD have deleted ' + sweepElementId);
    }

    // The more you interact, the more Tweets are loaded
    loadMore();
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


// Start loading more tweets once the initial page is shown
$(document).ready(function() {
    // Set initial max_id from the elements fed from PHP
    max_id = $('.cards-staging').children().last().attr('data-tweet-id');

    // Load the first set of Tweets from what we got from the PHP
    $('.cards-staging').children().each(function () {
        embedTweet($(this).attr('data-tweet-id'));
    });
    $('.cards-staging').remove();

    // Already load the next set of Tweets in the background
    loadMore();

    // Show loading spinner and defer button animation
    setTimeout(function (){
        // Show buttons
        $('.sweep').addClass('animated bounceInLeft').show();
        $('.keep').addClass('animated bounceInRight').show();

        // Hide loading spinner
        $('.loading').removeClass('loading');
    }, 3000);
});

// randomize function from https://stackoverflow.com/a/11766418
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        // Exclude first card because that is the one shown
        // Exclude last card because it is used by loadmore as max_id
        $(this).children(selector).not(':first').not(':last').sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};


// Load more Tweets in the background and append them to the list
function loadMore() {
    var lastElement = $('.container twitter-status').last();
    var lastElementId = lastElement.attr('id');

    $.ajax({
        type: 'POST',
        url: 'loadmore.php?id_str=' + lastElementId,
        success: function(data) {
            $('.cards').append(data);
        }
    });

    // When newly loaded elements are added, everything needs to be shuffled
    $('twitter-status').randomize();
}

function keep() {
    var keepElement = $('.container twitter-status:first-child');
    keepElement.addClass('bounceOutRight');
    keepElement.fadeOut(function() {
        keepElement.remove();
    });

    loadMore();
}

function sweep() {
    var sweepElement = $('.container twitter-status:first-child');
    var sweepElementId = sweepElement.attr('id');
    sweepElement.addClass('bounceOutLeft');
    sweepElement.fadeOut(function() {
        sweepElement.remove();
    });
    // Activate these lines if you want sweeping to be active
    //$.ajax({
    //    url: 'sweep.php?id_str=' + sweepElementId
    //});

    loadMore();
}


// Keyboard shortcuts
document.onkeyup = function(e) {
    // Keep: Space, →, Enter
    if (e.which === 32 || e.which === 39 || e.which === 13) {
        keep();
    // Sweep: Delete, ←
    } else if (e.which === 46 || e.which === 37) {
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


// Start loading more tweets once the initial page is shown
$(document).ready(function() {
    loadMore();
});

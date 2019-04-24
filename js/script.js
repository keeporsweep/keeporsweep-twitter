function keep() {
    var keepElement = $('.container twitter-status:first-child');
    keepElement.addClass('bounceOutRight');
    keepElement.fadeOut(function() {
        keepElement.remove();
    });
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

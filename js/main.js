$(document).ready(function() {
    $('.cloud-icon').unbind('click');
    $('.cloud-icon').bind('click', function(e) {
        console.log('click!');
        toggleRightPane();
    });

    var isHide = false;
    var toggleRightPane = function() {
        console.log('toggleRightPane');
        console.log('isHide: ', isHide);
        if (isHide) {
            revealRightPane();
        } else {
            hideRightPane();
        }
        isHide = !isHide;
    };

    var revealRightPane = function() {
        console.log('revealRightPane');
        if (isHide) {
            $('.right-pane').animate({
                width: 'show'
            }, {
                duration: 800,
                easing: 'easeOutElastic'
            });
        }
    };

    var hideRightPane = function() {
        console.log('hideRightPane');
        if (!isHide) {
            $('.right-pane').animate({
                width: 'hide'
            }, {
                duration: 800,
                easing: 'easeOutBounce'
            });
        }
    };

    console.log('initializing graph...');
    initGraph();
});

$(document).ready(function() {
    $('.nav-icon').click(function(e) {
        $(this).toggleClass('active');
    });

    var isHide=true;
    var toggleRightPane = function() {
        if (isHide) {
            revealRightPane();
        } else {
            hideRightPane();
        }
        isHide = !isHide;
    };

    var revealRightPane = function() {
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
        if (!isHide) {
            $('.right-pane').animate({
                width: 'hide'
            }, {
                duration: 800,
                easing: 'easeOutBounce'
            });
        }
    };
});

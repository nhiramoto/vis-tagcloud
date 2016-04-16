var graph;

$(document).ready(function() {
    $('.cloud-icon').unbind('click');
    $('.cloud-icon').bind('click', function(e) {
        toggleRightPane();
    });

    var isHide = false;
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
                duration: 1000,
                easing: 'easeOutElastic'
            });
        }
    };

    var hideRightPane = function() {
        if (!isHide) {
            $('.right-pane').animate({
                width: 'hide'
            }, {
                duration: 1000,
                easing: 'easeOutBounce'
            });
            graph.cloud.clear();
        }
    };

    console.log('initializing graph...');
    graph = new Graph();
    graph.createGraph();

});

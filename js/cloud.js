function Cloud() {
    var self = this;

    var colorScale = d3.scale.category20b();
    var scale = null;
    var maxSize;
    var opacityScale = null;

    var width = 500;
    var height = 800;
    var offsetX = 250;
    var offsetY = 250;

    var cloudWidth = 400;
    var cloudHeight = 400;

    var text = null;

    var zoom = d3.behavior.zoom();
    zoom.translate([offsetX, offsetY]);

    var svg = d3.select('#cloud-content')
                    .append('svg')
                        .attr("width", width)
                        .attr("height", height)
                        .attr('class', 'cloud')
                        .call(zoom.on("zoom", function () {
                            container.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                        }));

    var container = svg.append('g')
                        .attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');

    var drawCloud = function(words) {
        console.log('drawing words...');
        // console.log(words);
        text = container
                .selectAll('text')
                .data(words, function(d) { return d.text; });
        // update
        text
            .transition()
                .ease('ease-out')
                .duration(200)
                .style('font-size', function(d) { return d.size + 'px'; })
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(1)';
                });
        // enter
        text.enter()
            .append('text')
                .style('font-family', function(d) { return d.font; })
                .style('font-size', function(d) { return d.size + "px"; })
                .attr('text-anchor', 'middle')
                .text(function(d) { return d.text; })
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(0.5)';
                })
                .style('opacity', 0.1)
                .style('fill', function(d) { return colorScale(d.size); })
                // .style('stroke', 'black')
                // .style('stroke-width', 1)
                .transition()
                    .ease('elastic-in')
                    .duration(500)
                    .attr('transform', function(d) {
                        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(1)';
                    })
                    // .style('stroke', 'gray')
                    // .style('stroke-width', 0.5)
                    .style('opacity', 1);
        // exit
        text.exit()
            .transition()
                .ease('elastic-in')
                .duration(700)
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate+360 + ')scale(0)';
                })
                .style('opacity', 0)
                .remove();

        // var lensCheck = false;
        // var disableRot = false;
        //
        // svg.on('mousemove', function() {
        //     var mCoord = d3.mouse(this);
        //     mCoord[0] = mCoord[0] - offsetX;
        //     mCoord[1] = mCoord[1] - offsetY;
        //     fisheye.focus(mCoord);
        //     text.each(function(d) { d.fisheye = fisheye(d); })
        //     .attr('transform', function(d) {
        //         if (!disableRot) {
        //             if (d.fisheye.rot == -1)
        //                 return 'translate(' + [d.fisheye.x, d.fisheye.y] + ')rotate(' + d.rotate + ')';
        //             return 'translate(' + [d.fisheye.x, d.fisheye.y] + ')rotate(' + d.rotate + ')';
        //         } else {
        //             if (d.fisheye.rot == -1)
        //                 return 'translate(' + [d.fisheye.x, d.fisheye.y] + ')rotate(' + d.rotate + ')';
        //             return 'translate(' + [d.fisheye.x, d.fisheye.y] + ')rotate(' + d.fisheye.rot + ')';
        //         }
        //     })
        //     .style('font-size', function(d) {
        //         if (d.fisheye.size == -1) {
        //             return d.size + 'px';
        //         } else {
        //             return d.fisheye.size + 'px';
        //         }
        //     });
        // });
    };

    var updateCloud = function(data) {
        var length = data.length;
        // console.log('keywords:');
        // var keywords = [];
        // for (var i = 0; i < length; i++) {
        //     keywords.push(data[i].text);
        // }
        // console.dir(keywords);
        scale = d3.scale.pow()
                        .domain([0, length])
                        .range([10, 100]);
        maxSize = d3.max(data, function(d) { return d.size; });
        opacityScale = d3.scale.linear()
                            .domain([0, maxSize])
                            .range([0.1, 1]);
        // colorScale = d3.scale.linear()
        //     .domain([0, maxSize])
        //     .range(["#ddd", "#bbb", "#999", "#777", "#555", "#333", "#111", "#000"]);
        this.cloud = d3.layout.cloud()
                        .size([400, 400])
                        .words(data)
                        .rotate(function() {
                            return ~~(Math.random() * 2) * 90;
                        })
                        .font('Impact, Bitstream Charter, sans-serif')
                        .timeInterval(10)
                        .spiral('rectangular')
                        .padding(1)
                        .fontSize(function(d) { return scale(d.size); })
                        .on('end', drawCloud)
                        .start();
    };

    this.clear = function() {
        $('#autor-name').text('Autor 1');
        $('#coautor-name').text('Autor 2');
        $('#photo1').removeClass('double');
        $('#photo2').removeClass('double');
        $('#photo1 > img').attr('src', '');
        $('#photo2 > img').attr('src', '');
        console.log('clear***');
    };

    this.resetZoom = function() {

    };

    this.requestTags = function(nid1, nid2) {
        if (nid1 === undefined && nid2 === undefined) {
            console.error('Pelo menos um id deve ser fornecido.');
        } else {
            $.ajax({
                url: "php/get_tags.php",
                type: "GET",
                dataType: "json",
                data: {"fromApp": true, "nid1": nid1, "nid2": nid2},
                success: function(data) {
                    updateCloud(data);
                },
                error: function(request, status, errorThrown) {
                    console.log('Erro na requisição ', errorThrown);
                }
            });
        }
    };

}

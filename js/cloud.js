function Cloud() {
    var self = this;

    var colorScale = d3.scale.category20b();
    var scale;
    var maxSize;

    var width = 500;
    var height = 800;
    var margin = 250;

    var weight = 20;

    var zoom = d3.behavior.zoom();
    zoom.translate();

    var container = d3.select('#cloud-content')
                    .append('svg')
                        .attr("width", width)
                        .attr("height", height)
                        .attr('class', 'cloud')
                        .call(zoom.on("zoom", function () {
                            container.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                        }))
                    .append('g')
                        .attr('transform', 'translate(' + margin + ',' + margin + ')');

    var drawCloud = function(words) {
        console.log('drawing words...');
        // console.log(words);
        var selection = container
                            .selectAll('text')
                            .data(words, function(d) { return d.text; });
        // update
        selection
            .transition()
                .ease('ease-out')
                .duration(200)
                .style('font-size', function(d) { return d.size + 'px'; })
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(1)';
                });
        // enter
        selection.enter()
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
        selection.exit()
            .transition()
                .ease('elastic-in')
                .duration(700)
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate+360 + ')scale(0)';
                })
                .style('opacity', 0)
                .remove();
    };

    var updateCloud = function(data) {
        var length = data.length;
        console.log('keywords:');
        var keywords = [];
        for (var i = 0; i < length; i++) {
            keywords.push(data[i].text);
        }
        console.dir(keywords);
        scale = d3.scale.pow()
                        .domain([0, length])
                        .range([10, 100]);
        maxSize = d3.max(data, function(d) { return d.size; });
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

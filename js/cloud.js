function Cloud() {
    var self = this;

    var colorScale = d3.scale.category10();

    this.width = 500;
    this.height = 800;

    this.weight = 20;

    this.container = d3.select('#cloud-content')
                    .append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height)
                        .attr('class', 'cloud')
                    .append('g')
                        .attr('transform', 'translate(200, 200)');

    var drawCloud = function(words) {
        console.log('drawing words...');
        console.log(words);
        self.container
            .selectAll('text')
            .data(words)
            .enter().append('text')
                .style('font-family', function(d) { return d.font; })
                .style('font-size', function(d) { return d.size + "px"; })
                .attr('text-anchor', 'middle')
                .text(function(d) { return d.text; })
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(0.5)';
                })
                .style('opacity', 0.1)
                .style('fill', function(d, i) { return colorScale(i); })
                // .style('fill', 'black')
                .transition()
                    .ease('elastic-in')
                    .duration(500)
                    .attr('transform', function(d) {
                        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(1)';
                    })
                    .style('opacity', 1);
        self.container
            .selectAll('text')
            .data(words)
            .exit().transition()
                .ease('elastic-in')
                .duration(500)
                .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(0)';
                })
                .style('opacity', 0)
                .remove();
    };

    var updateCloud = function(data) {
        this.cloud = d3.layout.cloud()
                        .size([400, 400])
                        .words(data)
                        .rotate(function() {
                            return ~~(Math.random() * 2) * 90;
                        })
                        .font('Impact')
                        .timeInterval(10)
                        .spiral('rectangular')
                        .padding(1)
                        .fontSize(function(d) { return d.size * self.weight; })
                        .on('end', drawCloud)
                        .start();
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
                    console.log('data');
                    console.dir(data);
                    updateCloud(data);
                },
                error: function(request, status, errorThrown) {
                    console.log('Erro na requisição ', errorThrown);
                }
            });
        }
    };

}

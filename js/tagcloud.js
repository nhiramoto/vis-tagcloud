var cloudWidth = 500,
    cloudHeight = 200,
    cloudData;

var container = d3.select('.right-pane')
                .append('svg')
                    .attr('width', cloudWidth)
                    .attr('height', cloudHeight)
                    .attr('class', 'tagcloud')
                .append('g')
                    .attr('transform', 'translate(200, 200)');

d3.json('data/cloudData.json', function(data) {

    this.drawCloud = function(words) {
        console.log('drawing words...');
        console.log(words);
        container
            .selectAll('text')
            .data(words)
            .enter().append('text')
                .style('font-family', d => d.font)
                .style('font-size', d => d.size + "px")
                .attr('text-anchor', 'middle')
                .text(d => d.text)
                .attr('transform', d =>
                    'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(0.5)')
                .style('opacity', 0.1)
                .style('fill', d => color(Math.sqrt(d.size)))
                // .style('fill', 'black')
                .transition()
                    .ease('elastic-in')
                    .duration(500)
                    .attr('transform', d =>
                        'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(1)')
                    .style('opacity', 1);
        container
            .selectAll('text')
            .data(words)
            .exit().transition()
                .ease('elastic-in')
                .duration(500)
                .attr('transform', d =>
                    'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')scale(0)')
                .style('opacity', 0)
                .remove();
    };

    this.updateCloud = function(id1, id2) {
        console.log('id1:' + id1 + ' id2:' + id2);
        console.log('creating cloud...');
        var cloud = d3.layout.cloud()
                        .size([400, 400])
                        .words(data.filter(d => d.nid===id1 || d.nid===id2))
                        .rotate(function() {
                            return ~~(Math.random() * 2) * 90;
                        })
                        .font('Impact')
                        .timeInterval(10)
                        .spiral('rectangular')
                        .padding(1)
                        .fontSize(d => d.size)
                        .on('end', drawCloud)
                        .start();
    };

});

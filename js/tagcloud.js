var cloudWidth = 500,
    cloudHeight = 200,
    cloudData;

var container = d3.select('.right-pane')
                .append('svg')
                    .attr('width', cloudWidth)
                    .attr('height', cloudHeight)
                .append('g')
                    .attr('transform', 'translate(50, 50)');

d3.json('data/cloudData.json', function(data) {
    cloudData = data;
});

var updateCloud = function(id1, id2) {
    var cloud = d3.layout.cloud()
                    .size([400, 400])
                    .words(cloudData)
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

var i = 0;

var drawCloud = function(words) {
    container
        .selectAll('text')
        .data(words)
        .enter().append('text')
            .style('font-family', word.font)
            .style('font-size', word.size + "px")
            .attr('text-anchor', 'middle')
            .text(word.text)
            .attr('transform',
                'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')scale(0.5)')
            .style('opacity', 0.1)
            .style('fill', colorScale(i++))
            .transition()
                .ease('elastic-in')
                .duration(500)
                .attr('transform',
                    'translate(' + [word.x, word.y] + ')rotate(' + word.rotate + ')scale(1)')
                .style('opacity', 1);
}

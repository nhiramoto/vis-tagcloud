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

var drawCloud = function(words) {
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


var updateCloud = function(data) {
    var cloud = d3.layout.cloud()
                    .size([400, 400])
                    .words(data)
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

var requestTags = function(nid1, nid2) {
    console.log('nid1:', nid1, 'nid2:', nid2);
    if (nid1 === undefined && nid2 == undefined) {
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

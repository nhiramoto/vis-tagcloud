var Graph = function() {

    var self = this;

    var colorScale = d3.scale.category10();
    var radius = 15;
    var padding = 1;    // collision

    var maxNodeSize = 50;

    this.width = 800;
    this.height = 500;

    this.cloud = new Cloud();

    this.force = d3.layout.force()
                    .size([this.width, this.height])
                    .charge(-220)
                    .gravity(0.08)
                    .friction(0.4)
                    .linkDistance(110);

    this.svg = d3.select('#content').append('svg');

    this.initGraph = function(data) {

        self.force
            .nodes(data.nodes)
            .links(data.links)
            .start();

        self.link = self.svg.selectAll('.link')
                        .data(data.links)
                        .enter().append('line')
                            .attr('class', 'link')
                            // .on('mouseover', link_mouseover)
                            // .on('mouseout', link_mouseout)
                            .on('click', link_click);

        self.node = self.svg.selectAll('.node')
                        .data(data.nodes)
                        .enter().append('g')
                            .attr('class', 'node')
                            .attr('transform', function(d) {
                                return 'translate(' + d.x + ',' + d.y + ')';
                            })
                            // .on('mouseover', node_mouseover)
                            // .on('mouseout', node_mouseout)
                            .on('click', node_click)
                            .call(self.force.drag);

        self.node
            .append('circle')
                .attr('r', radius)
                .style('fill', function(d, i) { return colorScale(i); });

        // self.node
        //     .append('svg:image')
        //         .attr('xlink:href', 'res/default-avatar.png')
        //         .attr('x', '-25px')
        //         .attr('y', '-25px')
        //         .attr('width', '50px')
        //         .attr('height', '50px')
        //         .style('pointer-events', 'none')
        //         .style('clip-path', function(d) {
        //             return d3.select(this).select('circle');
        //         });

        self.node.append('svg:text')
                .attr('class', 'label')
                .attr('dx', 18)
                .attr('dy', -8)
                .text(function(d) { return d.name; });

        self.node.append('title')
            .text(function(d) { return d.name; });

        self.force.on('tick', function() {
            // node
            //     .attr("cx", function(d) { return d.x; })
            //     .attr("cy", function(d) { return d.y; })
            self.node.attr('transform', function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

            self.link
                .attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });
            //node.each(collide(0.5));
        });

    };

    this.createGraph = function() {
        $.ajax({
            url: 'php/get_graph_data.php',
            type: 'POST',
            dataType: 'json',
            data: {fromApp: true},
            success: function(data) {
                // console.log('data:');
                // console.dir(data);
                // data.links devem referenciar os objetos nós
                for (var i = 0; i < data.links.length; i++) {
                    var source = data.links[i].source;
                    var target = data.links[i].target;
                    data.links[i].source = data.nodes[source-1];
                    data.links[i].target = data.nodes[target-1];
                }
                self.initGraph(data);
            },
            error: function(request, status, errorThrown) {
                console.error('Erro na requisição ', errorThrown);
            }
        });
    };

    // var node_mouseover = function() {
        //stroke = d3.select(this).select('circle').style('stroke');
        //d3.select(this).select('circle').transition()
            //.duration(400)
            //.attr('r', radius+8)
            //.style('box-shadow', '0 0 3px blue');
    // };
    //
    // var node_mouseout = function() {
        //d3.select(this).select('circle').transition()
            //.duration(400)
            //.attr('r', radius)
            //.style('box-shadow', '');
    // };

    var node_click = function(d) {
        console.log('node_click');
        console.dir(d);
        $('#autor-name').text(d.name).css('text-transform', 'capitalize');
        $('#coautor-name').text('');
        $('#photo1').removeClass('double');
        $('#photo2').removeClass('double');
        $('#photo1 > img').attr('src', d.photo);
        self.cloud.requestTags(d.id);
    };

    // var link_mouseover = function() {
    //     d3.select(this).transition()
    //         .duration(400)
    //         .style('stroke-width', 9)
    //         .style('stroke', 'blue');
    // };
    //
    // var link_mouseout = function() {
    //     d3.select(this).transition()
    //         .duration(400)
    //         .style('stroke-width', 7)
    //         .style('stroke', '#acacac');
    // };

    var link_click = function(d) {
        console.log('link:');
        console.dir(d);
        $('#autor-name').text(d.source.name).css('text-transform', 'capitalize');
        $('#coautor-name').text(d.target.name).css('text-transform', 'capitalize');
        if (!$('#photo1').hasClass('double'))
            $('#photo1').addClass('double');
        if (!$('#photo2').hasClass('double'))
            $('#photo2').addClass('double');
        $('#photo1 > img').attr('src', d.source.photo);
        $('#photo2 > img').attr('src', d.target.photo);
        self.cloud.requestTags(d.source.id, d.target.id);
    };

    // referência: http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
    var collide = function(alpha) {
        var quadtree = d3.geom.quadtree(graph.nodes);
        return function(d) {
            var rb = 2*radius + padding,
                nx1 = d.x - rb,
                nx2 = d.x + rb,
                ny1 = d.y - rb,
                ny2 = d.y + rb;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y);
                  if (l < rb) {
                  l = (l - rb) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    };

};

var Graph = function() {

    var self = this;

    var colorScale = d3.scale.category10();
    var radius = 15;
    var radiusScale;
    var linkWidthScale;

    var padding = 1;    // collision

    var maxNodeSize = 50;

    var minZoom = 0.1;
    var maxZoom = 7;
    var zoom = d3.behavior.zoom()
                    .scaleExtent([minZoom, maxZoom]);

    this.width = 800;
    this.height = 500;

    this.cloud = new Cloud();

    this.force = d3.layout.force()
                    .size([this.width, this.height])
                    .charge(-720)
                    .gravity(0.03)
                    .friction(0.7)
                    .linkDistance(150);

    var svg = d3.select('#content').append('svg')
                        .style('cursor', 'move')
                        .style('background', '#DDD');
    svg.call(zoom);

    var container = svg.append('g');
    var radialGradient = svg.append('defs')
                            .append('radialGradient')
                                .attr('id', 'radial-gradient');

    radialGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'white');
    radialGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#DDD');

    container.append('circle')
                .attr('r', 1000)
                .attr('cx', 400)
                .attr('cy', 300)
                .style('fill', 'url(#radial-gradient)');

    zoom.on('zoom', function() {
        container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    });

    this.initGraph = function(data) {

        // console.log('data:');
        // console.dir(data);

        self.force
            .nodes(data.nodes)
            .links(data.links)
            .start();

        self.link = container.selectAll('.link')
                        .data(data.links)
                        .enter().append('line')
                            .attr('class', 'link')
                            .style('stroke-width', function(d) { return linkWidthScale(parseInt(d.link_weight)); })
                            // .on('mouseover', link_mouseover)
                            // .on('mouseout', link_mouseout)
                            .on('click', link_click);

        self.node = container.selectAll('.node')
                        .data(data.nodes)
                        .enter().append('g')
                            .attr('class', 'node')
                            .attr('transform', function(d) {
                                return 'translate(' + d.x + ',' + d.y + ')';
                            })
                            .on('mouseover', node_mouseover)
                            .on('mouseout', node_mouseout)
                            .on('mousedown', function() {
                                d3.event.stopPropagation();
                            })
                            .on('click', node_click)
                            .call(self.force.drag);

        self.node
            .append('circle')
                .attr('r', function(d) { return radiusScale(parseInt(d.pub_weight)); })
                .style('fill', function(d, i) { return colorScale(i); });

        // self.node
        //     .append('svg:text')
        //         .attr('class', 'label')
        //         .attr('dx', -8)
        //         .attr('dy', 8)
        //         .text(function(d) { return d.name.charAt(0); });
        self.node
            .append('svg:text')
                .attr('class', 'label name')
                .attr('dx', -25)
                .attr('dy', function(d) { return -radiusScale(parseInt(d.pub_weight)) - 10; })
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

        // svg.on('mousemove', function() {
        //     fisheye.focus(d3.mouse(this));
        //
        //     self.node.each(function(d) { d.fisheye = fisheye(d); })
        //         .attr('cx', function(d) { return d.fisheye.x; })
        //         .attr('cy', function(d) { return d.fisheye.y; })
        //         .attr('r', function(d) { return d.fisheye.z * 4.5; });
        //     self.link
        //         .attr('x1', function(d) { return d.source.fisheye.x; })
        //         .attr('y1', function(d) { return d.source.fisheye.y; })
        //         .attr('x2', function(d) { return d.target.fisheye.x; })
        //         .attr('y2', function(d) { return d.target.fisheye.y; });
        // });

    };

    this.createGraph = function() {
        $.ajax({
            url: 'php/get_graph_data.php',
            type: 'POST',
            dataType: 'json',
            data: { fromApp: true },
            success: function(data) {

                // data.links devem referenciar os objetos (não índices)
                for (var i = 0; i < data.links.length; i++) {
                    var source = data.links[i].source;
                    var target = data.links[i].target;
                    data.links[i].source = data.nodes[source-1];
                    data.links[i].target = data.nodes[target-1];
                }
                var maxRad = 0;
                for (i = 0; i < data.nodes.length; i++) {
                    if (data.nodes[i].pub_weight > maxRad) {
                        maxRad = data.nodes[i].pub_weight;
                    }
                }
                radiusScale = d3.scale.pow().exponent(0.5)
                                        .domain([0, maxRad])
                                        .range([5, 30]);
                var maxLinkWidth = 0;
                for (i = 0; i < data.links.length; i++) {
                    if (data.links[i].link_weight > maxLinkWidth) {
                        maxLinkWidth = data.links[i].link_weight;
                    }
                }
                linkWidthScale = d3.scale.linear()
                                        .domain([0, maxLinkWidth])
                                        .range([1, 10]);
                self.initGraph(data);
            },
            error: function(request, status, errorThrown) {
                console.error('Erro na requisição ', errorThrown);
            }
        });
    };

    var node_mouseover = function() {
        d3.select(this).select('.name').transition()
            .duration(300)
            .style('opacity', '1');
    };

    var node_mouseout = function() {
        d3.select(this).select('.name').transition()
            .duration(500)
            .style('opacity', '0.6');
    };

    var node_click = function(d) {
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

    // fonte: http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
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

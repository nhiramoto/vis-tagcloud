var width = 800;
var height = 500;

var color = d3.scale.category20();
var radius = 40;
var padding = 1;    // collision

var force = d3.layout.force()
                .size([width, height])
                .charge(-120)
                .gravity(0.01)
                .friction(0.8)
                .linkDistance(180);

var svg = d3.select('#content').append('svg');

var maxNodeSize = 50;

d3.json('data/graphData.json', function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll('.link')
                    .data(graph.links)
                    .enter().append('line')
                        .attr('class', 'link')
                        .on('mouseover', link_mouseover)
                        .on('mouseout', link_mouseout)
                        .on('click', link_click);

    var node = svg.selectAll('.node')
                    .data(graph.nodes)
                    .enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        })
                        .on('mouseover', node_mouseover)
                        .on('mouseout', node_mouseout)
                        .on('click', node_click)
                        .call(force.drag);

    node
        .append('circle')
            .attr('r', radius)
            .style('fill', 'white');

    node
        .append('svg:image')
            .attr('xlink:href', 'res/default-avatar.png')
            .attr('x', '-25px')
            .attr('y', '-25px')
            .attr('width', '50px')
            .attr('height', '50px')
            .style('pointer-events', 'none')
            .style('clip-path', function(d) {
                return d3.select(this).select('circle');
            });

    node.append('title')
        .text(function(d) { return d.name; });

    force.on('tick', function() {
        // node
        //     .attr("cx", function(d) { return d.x; })
        //     .attr("cy", function(d) { return d.y; })
        node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        link
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
        node.each(collide(0.5));
    });

    // url: http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
    function collide(alpha) {
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
    }
});

var stroke;

var node_mouseover = function() {
    stroke = d3.select(this).select('circle').style('stroke');
    d3.select(this).select('circle').transition()
        .duration(400)
        .attr('r', radius+8)
        .style('box-shadow', '0 0 3px blue');
};

var node_mouseout = function() {
    d3.select(this).select('circle').transition()
        .duration(400)
        .attr('r', radius)
        .style('box-shadow', '');
};

var node_click = function(d) {
    console.log('id:', d.id, 'name: ', d.name);
    updateCloud(d.id);
};

var link_mouseover = function() {
    d3.select(this).transition()
        .duration(400)
        .style('stroke-width', 9)
        .style('stroke', 'blue');
};

var link_mouseout = function() {
    d3.select(this).transition()
        .duration(400)
        .style('stroke-width', 7)
        .style('stroke', '#acacac');
};

var link_click = function(d) {
    console.log('source:', d.source.id, 'target:', d.target.id);
};

var leVoronoi = d3.select('#leVoronoi');
console.debug(leVoronoi);
var width = parseInt(leVoronoi.style('width'), 10),
    height = parseInt(leVoronoi.style('height'), 10);

console.debug({
    width: width,
    height: height
});
/** Construct a responsive svg */
var svg = leVoronoi.append("svg")
    .attr("width", width)
    .attr("height", height);

d3.select(window).on('resize', resize);
var oldWidth, oldHeight;

function resize() {
    console.log('resize');
    oldWidth = width;
    oldHeight = height;
    // update width
    width = parseInt(leVoronoi.style('width'), 10);
    height = parseInt(leVoronoi.style('height'), 10);

    svg.attr("width", width)
        .attr("height", height);

    vertices = vertices.map(function(e) {
        return {
            point: [e.point[0] * width / oldWidth, e.point[1] * height / oldHeight],
            vx: 0,
            vy: 0
        };
    });
    verticesG.transition();
    drawVertices(verticesG, vertices);
}

function continousMoving() {
    vertices = vertices.map(function(e) {
        var p = e.point;
        p[0] += e.vx;
        if (p[0] < 0) p[0] = e.vx *= -1;
        else if (p[0] > width) p[0] = width + (e.vx *= -1);
        p[1] += e.vy;
        if (p[1] < 0) p[1] = e.vy *= -1;
        else if (p[1] > height) p[1] = height + (e.vy *= -1);

        return {
            point: p,
            vx: e.vx + (0.1 * (Math.random() - .5) - 0.0001 * e.vx),
            vy: e.vy + (0.1 * (Math.random() - .5) - 0.001 * e.vy)
        };
    });

    verticesG.selectAll("circle")
        .transition()
        .attr("transform", function(d, i) {
            d = vertices[i];
            return "translate(" + d.point + ")";
        })
        .duration(30)
        .attr("r", r)
        .each('end', function() {
            continousMoving();
        });
}

/* Build n points */
var n = 4,
    bloques = new Array(n);

var vertices = d3.range(n).map(function(d) {
    return {
        point: [Math.random() * width, Math.random() * height],
        vx: 0,
        vy: 0
    };
});

var verticesG = svg.append("g");
var r = 3;

function drawVertices(elem, verticesData) {
    console.log(elem, verticesData);
    elem.selectAll("circle")
        .attr("transform", function(d, i) {
            d = verticesData[i];
            return "translate(" + d.point + ")";
        })
        .duration(1000)
        .attr("r", r);
};

function moveCircles() {
    verticesG.selectAll("circle")
        .transition()
        .attr("transform", function(d, i) {
            d = verticesData[i];
            return "translate(" + d + ")";
        });
}

var orginialNodes = svg.append('g').attr('id', 'orginialNodes');

var nodes = orginialNodes.selectAll(".node")
    .data(vertices)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        console.debug(d);
        return "translate(" + d.point + ")";
    });

nodes.append("circle")
    .attr("r", r);

nodes.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d, i) {
        return i;
    });

/*verticesG.selectAll("circle")
	.data(vertices)
	.enter()
	.append("circle")
	.attr("transform", function(d) {
		console.debug(d);
		return "translate(" + d.point + ")";
	})
	.attr("r",r);
*/

var middles1 = [];
//for (var j = vertices.length - 1; j >= 0; j--) {
for (var j = vertices.length - 1; j >= vertices.length - 1; j--) {
    vertices[i]

    for (var i = vertices.length - 1; i >= 0; i--) {

        var dx, dy;
        dx = vertices[i].point[0] - vertices[j].point[0];
        dy = vertices[i].point[1] - vertices[j].point[1];
        var m = dy / dx;


        middles1[i] = {
            point: [
                (vertices[i].point[0] + vertices[j].point[0]) / 2,
                (vertices[i].point[1] + vertices[j].point[1]) / 2
            ],
            vx: 0,
            vy: 0
        };
        middles1[i].point[0]


        var xy0, xymax;

        xy0 = (-m * (0 - middles1[i].point[1])) + middles1[i].point[0];
        xymax = -m * (height - middles1[i].point[1]) + middles1[i].point[0];

        svg.append("line") // attach a line
            .style("stroke", "black") // colour the line
            .attr("x1", vertices[j].point[0]) // x position of the first end of the line
            .attr("y1", vertices[j].point[1]) // y position of the first end of the line
            .attr("x2", vertices[i].point[0]) // x position of the second end of the line
            .attr("y2", vertices[i].point[1]);

        svg.append("line") // attach a line
            .style("stroke", "blue") // colour the line
            .attr("x1", xy0) // x position of the first end of the line
            .attr("y1", 0) // y position of the first end of the line
            .attr("x2", xymax) // x position of the second end of the line
            .attr("y2", height);


    }
}
console.log(middles1);
var middles1Nodes = svg.append('g').attr('id', 'middles1Nodes');

var nodes1 = middles1Nodes.selectAll(".node")
    .data(middles1)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        console.debug(d);
        return "translate(" + d.point + ")";
    });

nodes1.append("circle")
    .attr("r", r);

nodes1.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d, i) {
        return 'm' + i;
    });



var voronoi = d3.geom.voronoi()
    .clipExtent([
        [0, 0],
        [width, height]
    ]);


console.debug('vertices', vertices);
continousMoving();

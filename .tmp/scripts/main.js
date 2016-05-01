'use strict';

var leVoronoi = d3.select('#leVoronoi');
console.debug(leVoronoi);
var width = parseInt(leVoronoi.style('width'), 10),
    height = parseInt(leVoronoi.style('height'), 10);

console.debug({
    width: width,
    height: height
});
/** Construct a responsive svg */
var svg = leVoronoi.append("svg").attr("width", width).attr("height", height);

d3.select(window).on('resize', resize);
var oldWidth, oldHeight;

function resize() {
    console.log('resize');
    oldWidth = width;
    oldHeight = height;
    // update width
    width = parseInt(leVoronoi.style('width'), 10);
    height = parseInt(leVoronoi.style('height'), 10);

    svg.attr("width", width).attr("height", height);

    vertices = vertices.map(function (e) {
        return {
            point: [e.point[0] * width / oldWidth, e.point[1] * height / oldHeight],
            vx: 0,
            vy: 0
        };
    });

    diagram = buildVoronoi(vertices);
    drawVoronoiDiagram(diagram);
}

function moveVertices(vertices) {
    vertices = vertices.map(function (e) {
        var p = e.point;
        p[0] += e.vx;
        if (p[0] < 0) p[0] = e.vx *= -1;else if (p[0] > width) p[0] = width + (e.vx *= -1);
        p[1] += e.vy;
        if (p[1] < 0) p[1] = e.vy *= -1;else if (p[1] > height) p[1] = height + (e.vy *= -1);

        return {
            point: p,
            vx: e.vx + (0.1 * (Math.random() - .5) - 0.001 * e.vx),
            vy: e.vy + (0.1 * (Math.random() - .5) - 0.001 * e.vy)
        };
    });
    return vertices;

    /*    verticesG.selectAll("circle")
            .transition()
            .attr("transform", function(d, i) {
                d = vertices[i];
                return "translate(" + d.point + ")";
            })
            .duration(30)
            .attr("r", r)
            .each('end', function() {
                continousMoving();
            });*/
}

/* Build n points */
var n = 6,
    bloques = new Array(n);

var vertices = d3.range(n).map(function (d) {
    return {
        point: [Math.random() * width, Math.random() * height],
        vx: 0,
        vy: 0
    };
});

var voronoi = new Voronoi();
var bbox, sites;

function buildVoronoi(vertices) {
    bbox = { xl: 0, xr: width, yt: 0, yb: height }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom

    sites = vertices.map(function (e) {
        return { x: e.point[0], y: e.point[1] };
    });
    var diagram = voronoi.compute(sites, bbox);

    return diagram;
}

//drawVerices(diagram.vertices);
var diagram = buildVoronoi(vertices);
drawVoronoiDiagram(diagram);

function drawVoronoiDiagram(diagram) {

    var polygons = [];

    diagram.cells.map(function (cell) {
        var p = [];
        var v = cell.halfedges[0].getStartpoint();
        p.push([v.x, v.y]);
        cell.halfedges.map(function (hE) {
            v = hE.getEndpoint();
            p.push([v.x, v.y]);
            return;
        });
        polygons.push(p);
    });
    drawPolygon(polygons);
    drawSites(sites);

    return polygons;
}

// drawPolygon(polygons);

function drawSites(sites) {
    var sitesG = svg.append("g");
    var r = 5;
    sitesG.selectAll(".sites").data(sites).enter().append("g").attr("transform", function (d, i) {
        return "translate(" + d.x + ',' + d.y + ")";
    }).append("circle").attr("fill", 'blue').attr("r", r);
}

function drawVerices(sites) {
    var sitesG = svg.append("g");
    var r = 3;
    sitesG.selectAll(".sites").data(sites).enter().append("g").attr("transform", function (d, i) {
        console.log(i, d);
        return "translate(" + d.x + ',' + d.y + ")";
    }).append("circle").attr("fill", 'green').attr("r", r);
}

//var path = svg.append("g").selectAll("path");

function drawPolygon(polygon) {
    var path = svg.append("g").selectAll("path");

    path = path.data(polygon, polygonF);
    path.exit();
    path.enter().append("path").attr("class", function (d, i) {
        return "celula q" + i % 9 + "-9";
    }).attr("d", polygonF);

    path.order();
}

function polygonF(d) {
    return "M" + d.join("L") + "Z";
}

/* Animación continua*/
function continousM(elapsed) {
    svg.selectAll("g").remove();
    // console.log(elapsed - total_time);
    console.log('c');
    total_time = elapsed;
    vertices = moveVertices(vertices);
    /*    sites = vertices.map(function(e) {
            return { x: e.point[0], y: e.point[1] }
        });
        drawSites(sites);
    */
    diagram = buildVoronoi(vertices);
    drawVoronoiDiagram(diagram);
}

var total_time;
var timer = d3_timer.timer(continousM);

svg.on("mouseenter", flash("mouseenter", "-1em")).on("mouseover", flash("mouseover", "0")).on("mouseout", flash("mouseout", "1em")).on("mouseleave", flash("mouseleave", "2em"));

function flash(name, dy) {
    // timer.stop();
    return function () {
        if (name === "mouseenter") {
            timer.stop();
        }
        if (name === "mouseleave") {
            timer.restart(continousM);
        }
        console.log(name, dy);
    };
}
//# sourceMappingURL=main.js.map

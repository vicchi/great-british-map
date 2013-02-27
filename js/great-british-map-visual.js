var width = 960;
var height = 750;

var projection = d3.geo.albers()
	.center([0, 55,4])
	.rotate([4.4, 0])
	.parallels([50, 60])
	.scale(3500)
	.translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height);

d3.json('data/great-british-map.json', function (error, uk) {
	svg.selectAll(".subunit")
		.data(topojson.object(uk, uk.objects.subunits).geometries)
		.enter().append('path')
		.attr('class', function(d) {
			return 'subunit ' + d.id;
		})
		.attr('d', path);
		
	svg.append("path")
		.datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) {
			return a !== b;
		}))
		.attr("d", path)
		.attr("class", "subunit-boundary");

	svg.append('path')
		.datum(topojson.object(uk, uk.objects.places))
		.attr('d', path)
		.attr('class', 'place');
		
	svg.selectAll(".place-label")
		.data(topojson.object(uk, uk.objects.places).geometries)
		.enter().append("text")
		.attr("class", "place-label")
		.attr("transform", function(d) { return "translate(" + projection(d.coordinates) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.name; });
		
	svg.selectAll('.place-label')
		.attr('x', function(d) {
			return d.coordinates[0] > -1 ? 6 : -6;
		})
		.style('text-anchor', function(d) {
			return d.coordinates[0] > -1 ? 'start' : 'end';
		});
});

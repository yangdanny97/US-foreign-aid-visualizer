var aidFilter = d3.select('#aidFilter');
var aidBtn = d3.select('#aidbtn');
var hdiBtn = d3.select('#hdibtn');
var democracyBtn = d3.select('#democracybtn');
var govtBtn = d3.select('#govtbtn');
var happinessBtn = d3.select('#happinessbtn');
var filterBtn = d3.select('#setFilter');
var metrics = d3.select('#metricForm');

filterBtn.on("click", function(){
	var filterAmt = document.getElementById("aidFilter").value;
	updatePaths(filterAmt);
});

aidBtn.on("click", function(){
	updateMap(aidScaleColor);
});

democracyBtn.on("click", function(){
	updateMap(democracyScaleColor);
});

hdiBtn.on("click", function(){
	updateMap(hdiScaleColor);
});

happinessBtn.on("click", function(){
	updateMap(happinessScaleColor);
});

govtBtn.on("click", function(){
	updateMap(govtScaleColor);
});

/*this function is borrowed from my game of thrones visualization, originally written by another group member*/
var click = "clicked";
function zoom(d) {
    if (d.properties.name==="") {
        return;
    }
    var x, y, k;

    if (click=="unclicked") {
        x = width/2;
        y = height/2;
        k = 1;
        click = "clicked";
    } else {
        var centroid = d.properties.centroid;
        x = centroid[0]-width/2;
        y = centroid[1]-height/2;
        k = 3;
        click = "unclicked";
    }

    svg.transition()
        .duration(1000)
        .style("transform", "matrix("+k+",0,0,"+k+","+(-x)*(k-1)+","+(-y)*(k-1)+")");
}



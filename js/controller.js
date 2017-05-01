//filtering the map
var aidFilter = d3.select('#aidFilter');
var aidFilter2 = d3.select('#aidFilter2');

var aidBtn = d3.select('#aidbtn');
var hdiBtn = d3.select('#hdibtn');
var democracyBtn = d3.select('#democracybtn');
var govtBtn = d3.select('#govtbtn');
var happinessBtn = d3.select('#happinessbtn');
var filterBtn = d3.select('#setFilter');

var svgWidth = 300;
var svgHeight = 300;

var xExtent = ["Happiness", "HDI", "Democracy"];
var xScale = d3.scaleBand().domain(xExtent).range([svgWidth * 0.1, svgWidth * 0.9]).padding(0.1);
var xAxis = d3.axisBottom(xScale);

var yScale = d3.scaleLinear().domain([0, 10]).range([svgHeight * 0.9, svgHeight * 0.05]);
var yAxis = d3.axisLeft(yScale);

var tooltip = d3.select("#tooltip")
.style("background-color","white")
.style("border","solid black 1px")
.style("padding","3px")
.style("color","black")
.style("display","inline-block")
.style("visibility","visible")
.style("z-value","9999");

filterBtn.on("click", function(){
	var filterAmt1 = document.getElementById("aidFilter").value;
    var filterAmt2 = document.getElementById("aidFilter2").value;
    var thresholds = [];
    if (filterAmt1==""||filterAmt1==undefined){
        thresholds.push(0);
    } else {thresholds.push(Number(filterAmt1));}
    if (filterAmt2==""||filterAmt2==undefined){
        thresholds.push(10000000000);
    } else {thresholds.push(Number(filterAmt2));}
	updatePaths(thresholds);
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

/*this function is adapted from my game of thrones visualization, originally written by a member of my group*/
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
        x = centroid[0];
        y = centroid[1];
        k = 3;
        click = "unclicked";
    }

    map_contents.transition()
        .duration(1000)
        .style("transform", "matrix("+k+",0,0,"+k+","+(-x)*(k-1)+","+(-y)*(k-1)+")");
}

/* source: http://cwestblog.com/2011/06/23/javascript-add-commas-to-numbers/ */
function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

//for displaying no bar on the tooltip if there is no value for that field
function getY(x, scale){
    if(x==undefined||x==""||x=="NA"||isNaN(x)){
        return scale(0);
    } else {
        return scale(x);
    }
}

//for displaying N/A on the tooltip if there is no value for that field
function getText(x){
    if(x==undefined||x==""||isNaN(x)||x=="NA"){
        return "N/A";
    } else {
        return (Math.round(x*100)/100).toString();
    }
}

function tooltipCountry (d){
	if (d.properties.name==undefined){
        tooltip.html("<p>No Information</p>");
        return tooltip.style("visibility", "visible");
	}
	tooltip.html("<p>Country: "+d.properties.name+"<br>Annual Aid: $"+addCommas(Number(d.properties.aid)).toString()+"<br>Government Type: "+d.properties.govt+"</p>");

    /*code for mini bar charts is modified from the static version of this project*/
    // set the x axis of the bar graph to show HDI, Happiness, and Democracy using scaleBand

    var minigraph = tooltip.append("svg").attr("width",svgWidth).attr("height",svgHeight);

    minigraph.append("g")
        .attr("transform", "translate(0," + (svgHeight * 0.9).toString() + ")")
        .call(xAxis).attr("class","graph");

    minigraph.append("g")
        .attr("transform", "translate(" + (svgWidth * 0.1).toString() + " 0)")
        .call(yAxis).attr("class","graph");

    //add the HDI bar to the graph based on the xScale and the hdiScale
    minigraph.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", xScale("HDI"))
        .attr("width", xScale.bandwidth())
        .attr("y", getY(d.properties.hdi*10, yScale))
        .attr("height", svgHeight * 0.9 - getY(d.properties.hdi*10, yScale))
        .style("fill", "#415D78");

    //add the HDI value on top of the bar, multiply value by 10 to scale it from 0 to 1 to 1 to 10
    minigraph.append("text")
        .attr("x", xScale("HDI") + .5 * xScale.bandwidth())
        .attr("y", getY(d.properties.hdi*10, yScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .style("font-family", "Cabin")
        .text(getText(d.properties.hdi));

    //add the Happiness bar
    minigraph.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", xScale("Happiness"))
        .attr("width", xScale.bandwidth())
        .attr("y", getY(d.properties.happiness, yScale))
        .attr("height", svgHeight * 0.9 - getY(d.properties.happiness, yScale))
        .style("fill", "#3D6E9E");

    //add the rounded happiness value to the bar
    minigraph.append("text")
        .attr("x", xScale("Happiness") + .5 * xScale.bandwidth())
        .attr("y", getY(d.properties.happiness, yScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .text(getText(d.properties.happiness));

    //add the Democracy bar
    minigraph.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", xScale("Democracy"))
        .attr("width", xScale.bandwidth())
        .attr("y", getY(d.properties.democracy, yScale))
        .attr("height", svgHeight * 0.9 - getY(d.properties.democracy, yScale))
        .style("fill", "#063C71");

    //add the rounded democracy value to the bar
    minigraph.append("text")
        .attr("x", xScale("Democracy") + .5 * xScale.bandwidth())
        .attr("y", getY(d.properties.democracy, yScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .style("font-family", "Cabin")
        .text(getText(d.properties.democracy));
	return tooltip.style("visibility", "visible");
}

function tooltipAid(d){
	tooltip.html("<p>Recipient: "+d[2]+"</p><div>Annual Aid: $"+addCommas(Number(d[1])).toString()+"</div>");
	return tooltip.style("visibility", "visible");
}

/*tooltipMove is borrowed from my game of thrones visualization, originally written by a member of my group*/
function tooltipMove (d){
    if(d.properties==undefined||d.properties.name==undefined){
        return tooltip.style("top", (event.pageY)+"px").style("left", (event.pageX)+10+"px")
    }

    if (event.pageX>width/2){
        tooltip.style("left",(event.pageX-310)+"px");        
    } else {
        tooltip.style("left",(event.pageX+10)+"px");
    }

    if (event.pageY>height*7/10){
        tooltip.style("top", (event.pageY)-250+"px")
    } else {
        tooltip.style("top", (event.pageY)-25+"px")
    }             
}

function tooltipOut(d){
    return tooltip.style("visibility", "hidden");
}


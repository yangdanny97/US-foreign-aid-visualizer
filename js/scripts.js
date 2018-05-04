//setting up map and svg
var height = width * 480 / 960;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

var projection = d3.geoEquirectangular()
    .scale(153 * width / 960)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

//used for features on math
var world;
var countries;
var features;
var centers;
var uscenter;
var country_borders;
var map_contents;
var paths;
var map;

//used for legends on map
var colorAxis;
var pathAxis=d3.axisBottom(flowScale);

var pathsLegend;
var colorLegend;
var legend;
var legendGradient;

//used for tooltips
var tooltipCountry;
var tooltipAid;
var tooltipMove;
var tooltipOut;

//autocomplete for comparison tool
var countriesList = [];

d3.queue()
.defer(d3.json,"data/world-50m.json")
.defer(d3.csv,"data/combinedData2.csv")
.await(function(error, raw, data){
world = raw;
clist = world.objects.countries.geometries;
    clist.forEach(function(x) {
        x.properties = {
            hdi: undefined,
            happiness: undefined,
            democracy: undefined,
            aid: undefined,
            govt: undefined
        };
        data.forEach(function(y) {
            if (x.id == y.country_id) {
                x.properties.hdi = y.hdi;
                x.properties.aid = y.current_amount;
                x.properties.happiness = y.happiness;
                x.properties.democracy = y.democracy_score
                x.properties.govt = y.government;
                x.properties.name = y.country;
                countriesList.push({
                    value: y.country.toString(),
                    data: {
                        aid: y.current_amount,
                        hdi: y.hdi,
                        happiness: y.happiness,
                        democracy: y.democracy_score,
                        govt: y.government,
                        name: y.country
                    }
                });
            }
        });
    });
drawMap(aidScaleColor);
drawPaths([320000000,10000000000]);
});   

function drawMap(scale) {
map_contents = svg.append("g");
countries = topojson.feature(world, world.objects.countries);
features = topojson.feature(world, world.objects.countries).features;

//this finds the centroid of the country
centers = features.map(function(x) {
    if (x.id == 840) {
        uscenter = path.centroid(x);
    }
    x.properties.centroid = path.centroid(x);
    return [path.centroid(x), x.properties.aid, x.properties.name];
}); 

country_borders = map_contents.selectAll("path.boundary")
    .data(features)
    .enter().append("path")
    .attr("class", "boundary")
    .attr("stroke", "white")
    .attr("stroke-width", "0.25px")
    .attr("d", path)
    .on("click",function(d){
        zoom(d);
    })
    .on("mouseover",function(d){return tooltipCountry(d);})
    .on("mousemove",function(d){return tooltipMove(d);})
    .on("mouseout",function(d){return tooltipOut(d);})
    .attr("fill", function(x) {
            if (x.properties.aid == 'NA' || x.properties.aid == undefined || x.properties.aid <= 0) {
                return "gray";
            } 
            return scale(aidScale0(Number(x.properties.aid)));
    }); 
    
legendGradient = svg.append("g");
  //sample gradients for axes
    for (var i=0;i<=width*0.2;i++){
      svg.append("path")
          .attr("stroke", "red")
          .attr("opacity", function(x){
            return 0.3+i/(0.2*width)*0.5;
          })
          .attr("d","M"+i.toString()+" 0 h 1")
          .attr("stroke-width", function(x){
            return 3+i/(width*0.2)*10;
          })
          .attr("transform", "translate(25,"+(height*.75).toString()+")");
        legendGradient.append("path")
        .attr("d","M"+i.toString()+" 0 h 1")
        .attr("stroke-width",15)
        .attr("stroke",function(x){
                return scale(i/(width*0.2)*10);
        })
        .attr("transform", "translate(25,"+(height*.75-65).toString()+")");
    }

    //axes and labels
        colorAxis = d3.axisBottom(aidScale);             
        colorLegend = svg.append("text")
        .attr("class","legendText")
        .attr("transform","translate(25,"+(height*.75-80).toString()+")")
        .text("Aid Recieved (millions USD)");
        legend = svg.append("g").attr("transform","translate(25,"+(height*.75-50).toString()+")").call(colorAxis).attr("class","axis");
    
  svg.append("g").attr("transform","translate(25,"+(height*.75+10).toString()+")").call(pathAxis).attr("class","axis");
  pathsLegend = svg.append("text")
  .attr("class","legendText")
  .attr("transform","translate(25,"+(height*.75-14).toString()+")")
  .style("font-family","Cabin")
  .text("Flow of Foreign Aid (millions USD)");
}

function updateMap(scale){
    country_borders.attr("fill", function(x) {
        //replace with other variables to view other data
        if (scale == aidScaleColor){
            if (x.properties.aid == 'NA' || x.properties.aid == undefined || x.properties.aid <= 0) {
                return "gray";
            } 
            return scale(aidScale0(Number(x.properties.aid)));
        } else if (scale == govtScaleColor){
            if (x.properties.govt == 'NA' || x.properties.govt == undefined) {
                return "gray";
            } 
            return scale(x.properties.govt);
        } else if (scale == hdiScaleColor){
            if (x.properties.hdi == 'NA' || x.properties.hdi == undefined) {
                return "gray";
            }                         
            return scale(Number(x.properties.hdi));
        } else if (scale == happinessScaleColor){
            if (x.properties.happiness == 'NA' || x.properties.happiness == undefined) {
                return "gray";
            }                         
            return scale(Number(x.properties.happiness));
        } else if (scale == democracyScaleColor){
            if (x.properties.democracy == 'NA' || x.properties.democracy == undefined) {
                return "gray";
            }                         
            return scale(Number(x.properties.democracy));
        }
    });

    //axes and labels
    if (scale == aidScaleColor){
        colorAxis = d3.axisBottom(aidScale);              
        colorLegend.text("Aid Recieved (millions USD)");
        legend.call(colorAxis);
    } else if (scale == govtScaleColor){
        colorAxis = d3.axisBottom(govtLabel);
        colorLegend.text("Type of Government");
        legend.call(colorAxis);
    } else if (scale == hdiScaleColor){
        colorAxis = d3.axisBottom(hdiScale);
        colorLegend.text("Human Development Index");
        legend.call(colorAxis);
    } else if (scale == happinessScaleColor){
        colorAxis = d3.axisBottom(happinessScale);
        colorLegend.text("Happiness Index");
        legend.call(colorAxis);
    } else if (scale == democracyScaleColor){
        colorAxis = d3.axisBottom(democracyScale);
        colorLegend.text("Democracy Score");
        legend.call(colorAxis);
    }
    
    legendGradient.selectAll().remove();
    for (var i=0;i<=width*0.2;i++){
        legendGradient.append("path")
        .attr("d","M"+i.toString()+" 0 h 1")
        .attr("stroke-width",15)
        .attr("stroke",function(x){
            if (scale == aidScaleColor){
                return scale(i/(width*0.2)*10);
            } else if (scale == govtScaleColor){
                return govtScale(i/(width*0.2)*4.0);
            } else if (scale == hdiScaleColor){
                return scale(i/(width*0.2));
            } else if (scale == happinessScaleColor){
                return scale(2+i/(width*0.2)*6);
            } else if (scale == democracyScaleColor){
                return scale(1+i/(width*0.2)*7);
            }
        })
        .attr("transform", "translate(25,"+(height*.75-65).toString()+")");              
}
}

function drawPaths(threshold){
paths = map_contents.selectAll("path.aid").data(centers)
    .enter().append("path")
    .attr("class", "aid flowline")
    .attr("stroke", "red")
    .style("stroke-linejoin", "round")
    .style("stroke-linecap", "round")
    .attr("stroke-width", function(x) {
        if (x[1] == 'NA' || x[1] <=0 || x[1] == undefined || x[1] < threshold[0] || x[1]>threshold[1]) {return 0;}
        return flowWidth(x[1]);
    })
    .attr("opacity", 0.5)
    .attr("fill", "none")
    .on("mouseover",function(d){return tooltipAid(d);})
    .on("mousemove",function(d){return tooltipMove(d);})
    .on("mouseout",function(d){return tooltipOut(d);})                
    .attr("d", function(x) {
        if (x[1] == 'NA' || x[1] <=0 || x[1] == undefined || x[1] < threshold[0] || x[1]>threshold[1]) {return;}
        x1 = uscenter[0]; y1 = uscenter[1];
        x2 = x[0][0]; y2 = x[0][1];
        d = "M"+x1.toString()+" "+y1.toString()+"Q"+(Math.abs(x1+x2)/2).toString()+' '+(y1-Math.abs(y1+y2)/2).toString()+','+x2.toString()+' '+ y2.toString();
        return d;
    });
}

function updatePaths(threshold){
paths.attr("stroke-width", function(x) {
        if (x[1] == 'NA' || x[1] <=0 ||x[1] == undefined || x[1] < threshold[0] ||x[1]>threshold[1]) {return 0;}
        return flowWidth(x[1]);
    })
    .attr("opacity", function(x) {
        return 0.5;
    })
    .attr("d", function(x) {
        if (x[1] == 'NA' || x[1] <=0 || x[1] == undefined || x[1] < threshold[0] || x[1]>threshold[1]) {return;}
        x1 = uscenter[0]; y1 = uscenter[1];
        x2 = x[0][0]; y2 = x[0][1];
        d = "M"+x1.toString()+" "+y1.toString()+"Q"+(Math.abs(x1+x2)/2).toString()+' '+(y1-Math.abs(y1+y2)/2).toString()+','+x2.toString()+' '+ y2.toString();
        return d;
    });
}
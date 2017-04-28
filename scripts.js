        var height = width * 480 / 960

        var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "map");

        var projection = d3.geoEquirectangular()
            .scale(153 * width / 960)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        var world;
        var countries;
        var features;
        var centers;
        var uscenter;
        var country_borders;

        var colorAxis;
        var pathAxis=d3.axisBottom(flowScale);

        var pathsLegend;
        var colorLegend;
        var legend;
        var legendGradient;

        var paths;
        var map;
        d3.queue()
        .defer(d3.json,"world-50m.json")
        .defer(d3.csv,"combinedData2.csv")
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
                        }
                    });
                });
            drawMap(aidScaleColor);
            drawPaths(300000000);
        });   

        function drawMap(scale) {
            countries = topojson.feature(world, world.objects.countries);
            features = topojson.feature(world, world.objects.countries).features;
            
            //this finds the centroid of the country
            centers = features.map(function(x) {
                if (x.id == 840) {
                    uscenter = path.centroid(x);
                }
                x.properties.centroid = path.centroid(x);
                return [path.centroid(x), x.properties.aid];
            }); 

            country_borders = svg.selectAll("path.boundary")
                .data(features)
                .enter().append("path")
                .attr("class", "boundary")
                .attr("stroke", "white")
                .attr("stroke-width", "0.25px")
                .attr("d", path)
                .on("click",function(d){
                    zoom(d);
                })
                .attr("fill", function(x) {
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
                }); // end country_borders creation
                legendGradient = svg.append("g");
              //sample gradients for axes
                for (var i=0;i<=width*0.2;i++){
                  svg.append("path")
                      .attr("stroke", "#063C71")
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

                //axes and labels
                if (scale == aidScaleColor){
                    colorAxis = d3.axisBottom(aidScale);              
                    colorLegend = svg.append("text")
                    .attr("class","legendText")
                    .attr("transform","translate(25,"+(height*.75-80).toString()+")")
                    .text("Aid Recieved (millions USD)");
                    legend = svg.append("g").attr("transform","translate(25,"+(height*.75-50).toString()+")").call(colorAxis);
                } else if (scale == govtScaleColor){
                    colorLegend = svg.append("text")
                    .attr("class","legendText")
                    .attr("transform","translate(25,"+(height*.75-80).toString()+")")
                    .text("Type of Government");
                } else if (scale == hdiScaleColor){
                    colorAxis = d3.axisBottom(hdiScale);
                    colorLegend = svg.append("text")
                    .attr("class","legendText")
                    .attr("transform","translate(25,"+(height*.75-80).toString()+")")
                    .text("Human Development Index");
                    legend = svg.append("g").attr("transform","translate(25,"+(height*.75-50).toString()+")").call(colorAxis);
                } else if (scale == happinessScaleColor){
                    colorAxis = d3.axisBottom(happinessScale);
                    colorLegend = svg.append("text")
                    .attr("class","legendText")
                    .attr("transform","translate(25,"+(height*.75-80).toString()+")")
                    .text("Happiness Index");
                    legend = svg.append("g").attr("transform","translate(25,"+(height*.75-50).toString()+")").call(colorAxis);
                } else if (scale == democracyScaleColor){
                    colorAxis = d3.axisBottom(democracyScale);
                    colorLegend = svg.append("text")
                    .attr("class","legendText")
                    .attr("transform","translate(25,"+(height*.75-80).toString()+")")
                    .text("Democracy Score");
                    legend = svg.append("g").attr("transform","translate(25,"+(height*.75-50).toString()+")").call(colorAxis);
                }
                
              svg.append("g").attr("transform","translate(25,"+(height*.75+10).toString()+")").call(pathAxis);
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
                    colorLegend.text("Type of Government");
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
            paths = svg.selectAll("path.aid").data(centers)
                .enter().append("path")
                .attr("class", "aid")
                .attr("stroke", "#063C71")
                .style("stroke-linejoin", "round")
                .style("stroke-linecap", "round")
                .attr("stroke-width", function(x) {
                    if (x[1] == 'NA' || x[1] == undefined || x[1] < threshold) {return 0;}
                    return flowWidth(x[1]);
                })
                .attr("opacity", function(x) {
                    return flowOpacity(x[1]);
                })
                .attr("fill", "none")
                .attr("d", function(x) {
                    if (x[1] == 'NA' || x[1] == undefined || x[1] < threshold) {return;}
                    x1 = uscenter[0]; y1 = uscenter[1];
                    x2 = x[0][0]; y2 = x[0][1];
                    d = "M"+x1.toString()+" "+y1.toString()+"Q"+(Math.abs(x1+x2)/2).toString()+' '+(y1-Math.abs(y1+y2)/2).toString()+','+x2.toString()+' '+ y2.toString();
                    return d;
                });
        }

        function updatePaths(threshold){
            paths.attr("stroke-width", function(x) {
                    if (x[1] == 'NA' || x[1] == undefined || x[1] < threshold) {return 0;}
                    return flowWidth(x[1]);
                })
                .attr("opacity", function(x) {
                    return flowOpacity(x[1]);
                })
                .attr("fill", "none")
                .attr("d", function(x) {
                    if (x[1] == 'NA' || x[1] == undefined || x[1] < threshold) {return;}
                    x1 = uscenter[0]; y1 = uscenter[1];
                    x2 = x[0][0]; y2 = x[0][1];
                    d = "M"+x1.toString()+" "+y1.toString()+"Q"+(Math.abs(x1+x2)/2).toString()+' '+(y1-Math.abs(y1+y2)/2).toString()+','+x2.toString()+' '+ y2.toString();
                    return d;
                });
        }

/*
        var outlineProjection = d3.geoMercator().scale(75);
        var makeOutlines = d3.geoPath().projection(outlineProjection);
        var countryData;
        var worldData;
        var outlineCountries;
        var svgHeight = width / 5;
        var svgWidth = width / 5;

        function showgraphs() {
            countryData = world.objects.countries.geometries;
            worldData = world;

            // set the x axis of the bar graph to show HDI, Hapiness, and Democracy using scaleBand
            var xExtent = ["Happiness", "HDI", "Democracy"];
            var xScale = d3.scaleBand().domain(xExtent).range([svgWidth * 0.2, svgHeight * 0.8]).padding(0.1);
            var xAxis = d3.axisBottom(xScale);
            //make Democracy, HDI, and Hapiness Scales based on their domains
            var demScale = d3.scaleLinear().domain([0, 10]).range([svgWidth * 0.8, svgHeight * 0.2]);
            var hapScale = d3.scaleLinear().domain([0, 10]).range([svgWidth * 0.8, svgHeight * 0.2]);
            var hdiScale = d3.scaleLinear().domain([0, 1]).range([svgWidth * 0.8, svgHeight * 0.2]);
            //make the y axis based on a 0-10 domain
            var indexAxis = d3.axisLeft(demScale);

            var topTen = [];
            //function below is used to sort the top 10 countries receiving aid
            function compareAid(country1, country2) {
                if (country1.properties.aid < country2.properties.aid) {
                    return 1;
                }
                if (country1.properties.aid > country2.properties.aid) {
                    return -1;
                }
                return 0;
            }

            //for each country, if the amount of aid is over 319000000, add it to the array of the top 10 countries
            countryData.forEach(function(country) {
                if (country.properties.aid >= 319000000 || country.properties.name == "United States") {
                    topTen.push(country);
                }
            });
            //sort the top 10 array based on aid
            topTen.sort(compareAid);


            var count = 1;
            topTen.forEach(function(country) {

                //round the democracy value and if it is null, set the value to N/A (for South Sudan)
                var democracyValue = Math.round(country.properties.democracy * 10) / 10;
                if (!(country.properties.democracy >= 0)) {
                    country.properties.democracy = 0;
                    democracyValue = "N/A"
                }

                //add an svg for each country with a class based on which # country it is (US is specially centered)
                var svg = d3.select("#d" + count.toString())
                    .append("svg")
                    .attr("class", "miniGraph")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("id", "s" + count.toString());

                //add title to each graph
                svg.append("text")
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "central")
                    .attr("x", svgWidth / 2)
                    .attr("y", svgHeight / 10)
                    .attr("font-size", "14")
                    .style("font-family", "Cabin")
                    .text(country.properties.name);

                //add the x axis to the graph
                svg.append("g")
                    .attr("transform", "translate(0," + (svgHeight * 0.8).toString() + ")")
                    .call(xAxis)
                    .style("font-family", "Cabin")
                    .style("font-size", "9");

                //add the y axis to the graph
                svg.append("g")
                    .attr("transform", "translate(" + (svgWidth * 0.2).toString() + " 0)")
                    .call(indexAxis)
                    .style("font-family", "Cabin")
                    .style("font-size", "8");


                //add the HDI bar to the graph based on the xScale and the hdiScale
                svg.append("rect")
                    .attr("rx", "3")
                    .attr("ry", "3")
                    .attr("x", xScale("HDI"))
                    .attr("width", xScale.bandwidth())
                    .attr("y", hdiScale(country.properties.hdi))
                    .attr("height", svgHeight * 0.8 - hdiScale(country.properties.hdi))
                    .style("fill", "#415D78");

                //add the HDI value on top of the bar, multiply value by 10 to scale it from 0 to 1 to 1 to 10
                svg.append("text")
                    .attr("x", xScale("HDI") + .5 * xScale.bandwidth())
                    .attr("y", hdiScale(country.properties.hdi) - 2)
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "bottom")
                    .style("font-family", "Cabin")
                    .attr("font-size", "10")
                    .text(Math.round(country.properties.hdi * 100) / 10);

                //add the Happiness bar to the graph based on the xScale and the hapScale
                svg.append("rect")
                    .attr("rx", "3")
                    .attr("ry", "3")
                    .attr("x", xScale("Happiness"))
                    .attr("width", xScale.bandwidth())
                    .attr("y", hapScale(country.properties.happiness))
                    .attr("height", svgHeight * 0.8 - hapScale(country.properties.happiness))
                    .style("fill", "#3D6E9E");

                //add the rounded happiness value to the bar
                svg.append("text")
                    .attr("x", xScale("Happiness") + .5 * xScale.bandwidth())
                    .attr("y", hapScale(country.properties.happiness) - 2)
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "bottom")
                    .style("font-family", "Cabin")
                    .attr("font-size", "10")
                    .text(Math.round(country.properties.happiness * 10) / 10);

                //add the Democracy bar to the graph based on the xScale and the demScale
                svg.append("rect")
                    .attr("rx", "3")
                    .attr("ry", "3")
                    .attr("x", xScale("Democracy"))
                    .attr("width", xScale.bandwidth())
                    .attr("y", demScale(country.properties.democracy))
                    .attr("height", svgHeight * 0.8 - demScale(country.properties.democracy))
                    .style("fill", "#063C71");

                //add the rounded democracy value to the bar
                svg.append("text")
                    .attr("x", xScale("Democracy") + .5 * xScale.bandwidth())
                    .attr("y", hapScale(country.properties.democracy) - 2)
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "bottom")
                    .style("font-family", "Cabin")
                    .attr("font-size", "10")
                    .text(democracyValue);

                //if the country isn't the United States we want a silhouette of it
                if (country.properties.name != "United States") {
                    //for each country in world-50m.json, if its id matches one of our top 10...
                    for (var i = 0; i < worldData.objects.countries.geometries.length; i++) {
                        if (worldData.objects.countries.geometries[i].id == country.id) {

                            //make the projection and a path generator for the silhouettes
                            outlineCountries = topojson.feature(worldData, worldData.objects.countries.geometries[i]);
                            outlineProjection.fitExtent([
                                [.6 * svgWidth, 0],
                                [.8 * svgWidth, (30 / 50) * svgHeight]
                            ], outlineCountries);
                            makeOutlines = d3.geoPath().projection(outlineProjection);

                            //add the silhouette by merging the paths to the svg for the country
                            var paths = svg.selectAll("path.country").data([outlineCountries]);
                            paths.enter().append("path").attr("class", "country")
                                .merge(paths)
                                .attr("d", function(country_outline) {
                                    return makeOutlines(country_outline);
                                });

                            //format the amount of aid and replace G with B for billion, add it to the svg
                            var text = d3.format(".2s")(country.properties.aid);
                            var newtext = text.replace(/G/, "B");
                            newtext = "$"+newtext;
                            svg.append("text")
                                .attr("x", svgWidth * .35)
                                .attr("y", svgHeight * .25)
                                .style("text-anchor", "middle")
                                .style("dominant-baseline", "central")
                                .style("font-family", "Cabin")
                                .style("fill", "#6785A2")
                                .attr("font-size", "10")
                                .text(newtext);

                        }
                    }
                }
                count++;
            });
        }*/

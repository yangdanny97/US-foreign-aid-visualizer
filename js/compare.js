//comparison tool
var countryLeft;
var countryRight;

var leftCompare = d3.select('#leftCompare');
var rightCompare = d3.select('#rightCompare');

var compareWidth = 450;
var compareHeight = 450;


var compareXExtent = ["Happiness", "HDI", "Democracy"];
var compareXScale = d3.scaleBand().domain(compareXExtent).range([compareWidth * 0.1, compareWidth * 0.9]).padding(0.1);
var compareXAxis = d3.axisBottom(compareXScale);

var compareYScale = d3.scaleLinear().domain([0, 10]).range([compareHeight * 0.9, compareHeight * 0.05]);
var compareYAxis = d3.axisLeft(compareYScale);

// referenced code from https://designshack.net/tutorialexamples/html5-autocomplete-suggestion/
var compareBtn = d3.select('#compareBtn');

compareBtn.on('click', function(d){
    if (countryLeft==undefined||countryRight==undefined){
        return alert("please enter a value for both fields")
    } else {
    	compareCountries(countryLeft.data, countryRight.data);
    }
});

$('#leftCountry').autocomplete({
    lookup: countriesList,
    onSelect: function (suggestion) {
      countryLeft = suggestion;
    }
});

$('#rightCountry').autocomplete({
    lookup: countriesList,
    onSelect: function (suggestion) {
      countryRight = suggestion;
    }
});

//draws a bar chart for the specified country on specified element on the page, country data input in JSON form, in the same structure as country.properties
function drawCompare(element, data){
	var countryChart = element.append("svg").attr("width",compareWidth).attr("height",compareWidth);
	console.log(data);
    countryChart.append("g")
        .attr("transform", "translate(0," + (compareWidth * 0.9).toString() + ")")
        .call(compareXAxis).attr("class","countryChart");

    countryChart.append("g")
        .attr("transform", "translate(" + (compareWidth * 0.1).toString() + " 0)")
        .call(compareYAxis).attr("class","countryChart");

    //add the HDI bar to the countryChart based on the compareXScale and the hdiScale
    countryChart.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", compareXScale("HDI"))
        .attr("width", compareXScale.bandwidth())
        .attr("y", getY(data.hdi*10, compareYScale))
        .attr("height", compareWidth * 0.9 - getY(data.hdi*10, compareYScale))
        .style("fill", "#415D78");

    //add the HDI value on top of the bar, multiply value by 10 to scale it from 0 to 1 to 1 to 10
    countryChart.append("text")
        .attr("x", compareXScale("HDI") + .5 * compareXScale.bandwidth())
        .attr("y", getY(data.hdi*10, compareYScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .style("font-family", "Cabin")
        .text(getText(data.hdi));

    //add the Happiness bar
    countryChart.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", compareXScale("Happiness"))
        .attr("width", compareXScale.bandwidth())
        .attr("y", getY(data.happiness, compareYScale))
        .attr("height", compareWidth * 0.9 - getY(data.happiness, compareYScale))
        .style("fill", "#3D6E9E");

    //add the rounded happiness value to the bar
    countryChart.append("text")
        .attr("x", compareXScale("Happiness") + .5 * compareXScale.bandwidth())
        .attr("y", getY(data.happiness, compareYScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .text(getText(data.happiness));

    //add the Democracy bar
    countryChart.append("rect")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("x", compareXScale("Democracy"))
        .attr("width", compareXScale.bandwidth())
        .attr("y", getY(data.democracy, compareYScale))
        .attr("height", compareWidth * 0.9 - getY(data.democracy, compareYScale))
        .style("fill", "#063C71");

    //add the rounded democracy value to the bar
    countryChart.append("text")
        .attr("x", compareXScale("Democracy") + .5 * compareXScale.bandwidth())
        .attr("y", getY(data.democracy, compareYScale) - 2)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "bottom")
        .style("font-family", "Cabin")
        .text(getText(data.democracy));
}

compareCountries =  function(left, right){
	leftCompare.html("<h3>Country: "+left.name+"<br>Annual Aid: $"+addCommas(Number(left.aid)).toString()+"<br>Government Type: "+left.govt+"</h3>");
	rightCompare.html("<h3>Country: "+right.name+"<br>Annual Aid: $"+addCommas(Number(right.aid)).toString()+"<br>Government Type: "+right.govt+"</h3>");
    drawCompare(leftCompare,left);
    drawCompare(rightCompare,right);
}


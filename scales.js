        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        var aidScale = d3.scaleLog()
            .domain([0.001,1300])
            .range([0,width*0.2]);

        var aidScaleColor = d3.scaleQuantize()
            .domain([1, 12])
            .range(["lightblue", "lightblue", "lightblue", "powderblue", "powderblue", "skyblue", "lightskyblue", "cornflowerblue", "royalblue", "blue", "blue", "blue"]);

        var hdiScale = d3.scaleLinear()
            .domain([0.0, 1.0])
            .range([0,width*0.2]);

        var hdiScaleColor = d3.scaleQuantize()
            .domain([0.0, 1.0])
            .range(["lightblue", "lightblue", "lightblue", "powderblue", "powderblue", "skyblue", "lightskyblue", "cornflowerblue", "royalblue", "blue"]);

        var happinessScale = d3.scaleLinear()
            .domain([0.001, 10])
            .range([0,width*0.2]);

        var happinessScaleColor = d3.scaleQuantize()
            .domain([2, 8])
            .range(["lightblue", "lightblue", "lightblue", "powderblue", "powderblue", "skyblue", "lightskyblue", "cornflowerblue", "royalblue", "blue"]);

        var democracyScale = d3.scaleLinear()
            .domain([0.001, 10])
            .range([0,width*0.2]);

        var democracyScaleColor = d3.scaleQuantize()
            .domain([1, 8])
            .range(["lightblue", "lightblue", "lightblue", "powderblue", "powderblue", "skyblue", "lightskyblue", "cornflowerblue", "royalblue", "blue"]);

        var govtScale = d3.scaleQuantize()
            .domain([0.001,4])
            .range(["red", "orange", 'yellow', 'limegreen']);

        var govtScaleColor = d3.scaleOrdinal()
            .domain(['Authoritarian', 'Hybrid regime', 'Flawed democracy', 'Full democracy'])
            .range(["red", "orange", 'yellow', 'limegreen']);

        var aidScale0 = d3.scaleLog() //outputs an approximation of the number of zeroes the aid figure has
            .domain([1, 1000000000000])
            .range([1, 12]); 

        var flowWidth = d3.scaleLinear() //used for path width, feel free to adjust
            .domain([10000, 1300000000])
            .range([0.1, 13]);

        var flowOpacity = d3.scaleLinear() //used for path opacity, feel free to adjust
            .domain([0, 1300000000])
            .range([0.3, 0.85]);

        var flowScale = d3.scaleLinear() //used for flow of aid legend
            .domain([1, 1300])
            .range([0, width*0.2]);
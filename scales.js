        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        var aidScale = d3.scaleLog()
            .domain([0.001,1300])
            .range([0,width*0.2]);

        var aidScaleColor = d3.scaleLinear()
            .domain([3, 9])
            .range(["black","dodgerblue"])
            //.range(["lightblue", "lightblue", "lightblue", "powderblue", "powderblue", "skyblue", "lightskyblue", "cornflowerblue", "royalblue", "blue", "blue", "blue"]);

        var hdiScale = d3.scaleLinear()
            .domain([0.0, 1.0])
            .range([0,width*0.2]);

        var hdiScaleColor = d3.scaleQuantize()
            .domain([0.0, 1.0])
            .range(["#190F00","#331F00","#4C2F00","#663E00","#7F4E00","#995E00","#B26E00","#CC7D00","#E58D00","#FF9D00"]);

        var happinessScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0,width*0.2]);

        var happinessScaleColor = d3.scaleLinear()
            .domain([2, 8])
            .range(["black","lime"]);

        var democracyScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0,width*0.2]);

        var democracyScaleColor = d3.scaleLinear()
            .domain([0, 10])
            .range(["red","dodgerblue"]);

        var govtScale = d3.scaleQuantize()
            .domain([0,4])
            .range(["tomato", "orange", 'yellow', 'limegreen']);

        var govtLabel = d3.scaleBand()
            .domain(['Authoritarian', 'Hybrid regime', 'Flawed democracy', 'Full democracy'])
            .range([0,width/5]);

        var govtScaleColor = d3.scaleOrdinal()
            .domain(['Authoritarian', 'Hybrid regime', 'Flawed democracy', 'Full democracy'])
            .range(["tomato", "orange", 'yellow', 'limegreen']);

        var aidScale0 = d3.scaleLog() //outputs an approximation of the number of zeroes the aid figure has
            .domain([1, 1000000000000])
            .range([1, 12]); 

        var flowWidth = d3.scaleLinear() //used for path width, feel free to adjust
            .domain([0, 1300000000])
            .range([3, 16]);

        var flowOpacity = d3.scaleLinear() //used for path opacity, feel free to adjust
            .domain([0, 1300000000])
            .range([0.5, 0.8]);

        var flowScale = d3.scaleLinear() //used for flow of aid legend
            .domain([1, 1300])
            .range([0, width*0.2]);
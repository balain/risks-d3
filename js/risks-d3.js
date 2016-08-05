function buildRiskMap() {
    // var scale = d3.scale.linear();

    var GREEN  = "#0f0",
        YELLOW = "#ff0",
        RED    = "#f00",
        FINAL_RADIUS = 10;

    var colorTable = [[GREEN,  GREEN,  GREEN,  GREEN,  YELLOW],
                      [GREEN,  GREEN,  YELLOW, YELLOW, YELLOW],
                      [GREEN,  YELLOW, YELLOW, RED,    RED],
                      [GREEN,  YELLOW, RED,    RED,    RED],
                      [YELLOW, YELLOW, RED,    RED,    RED]];
    var margin = 50;


    // var canvasWidth = (5 * cellWidth), // + (2 * margin),
    //     canvasHeight = canvasWidth;

    // Static width/height
    var width = 600 - (2 * margin),  // (cellWidth * 5) + (2 * margin);
        height = width; // (cellHeight * 5) + (2 * margin);

    var cellWidth = 100, // width/5 + (2 * margin),
        cellHeight = cellWidth;
    // console.log("cellWidth", cellWidth);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // var x = d3.scaleLinear().range([margin, width - margin]);
    // var y = d3.scaleLinear().range([(height - margin) - cellHeight/2, margin]);
    
    d3.json("./risks.json", function(json) {
    // d3.json("./risks-full.json", function(json) {
        x.domain([0, 5]); // d3.max(json, function(d) { return(d.likelihood); })]);
        y.domain([0, 5]);
        console.log(x(0));
        console.log(x(1));
        console.log(x(2));
        console.log(x(3));
        console.log(x(4));
        console.log(x(5));

        function getCellColor(risk) {
            return(colorTable[risk.likelihood-1][risk.impact-1]);
        }

        // // HTML Table - needs to be reoriented -- i.e. origin <> bottom left
        // var tbl = d3.select("body")
        //             .append("table")
        //             .style("border", "2px black solid")
        //             .selectAll("tr")
        //             .data(colorTable)
        //             .enter().append("tr")
        //             .selectAll("td")
        //             .data(function(d) {
        //                 return(d);
        //             })
        //             .enter().append("td")
        //             .style("background", function(d) { return(d); })
        //             .text(function(d) { return(d); });

        var riskTable = d3.select("#riskMap")
                          .append("svg")
                          .attr("width", width + (2 * margin))
                          .attr("height", height + (2 * margin))
                          .append("g")
                          .attr("transform", "translate(" + margin + "," + margin + ")")
                          .attr("class", "riskTable");
        
        var row = riskTable.selectAll(".row")
                    .data(colorTable)
                    .enter()
                    .append("svg:g")
                    .attr("class", "row");

        var counter = 0;
        var rowNum = 1;

        var getCellYbyIndex = function(ndx) {
            // console.log(ndx, (ndx - 1) % 5);
            // var rowNum = 1;
            if (ndx === 1) {
                rowNum = 1;
            } else if (ndx > 1 && ((ndx - 1) % 5) === 0) {
                // New row
                rowNum = ((ndx - 1) / 5) + 1;
                // console.log("rowNum", ((ndx - 1) / 5) + 1);
            // } else {
            //     rowNum = 1;
            }
            // console.log("rowNum", rowNum);
            result = y(rowNum); // - cellHeight/2;
            // var result = height - (margin + (rowNum * cellHeight));
            // console.log(ndx, rowNum, height, result);
            return(result);
        };

        var cell = row.selectAll(".cell")
                    .data(function(d){ 
                            // console.log(d, i); 
                            return d; })
                    .enter()
                    .append("svg:rect")
                    .attr("width", cellWidth)
                    .attr("height", cellHeight)
                    // .attr("ct", function(d, i) { 
                    //     return(d + " / " + i + " / " + colorTable[i]); 
                    // })
                    .attr("fill", function(d, i) { 
                            // console.log("fill", d, i);
                            return(d); })
                            // return("#aaf"); })
                    .attr("stroke", "#555")
                    .attr("x", function(d, i) {
                        // console.log("x", d, i, x(i), x(i+1), x(i+1)-cellWidth/2);
                        // return(i * cellWidth); })
                        return(x(i)); })
                        // return(x(i)); })
                    .attr("y", function(d, i) {
                        // console.log("y", colorTable[i][i], d, i, ++counter); 
                        // return(((i - 1) * cellHeight) + margin); })
                        return(getCellYbyIndex(++counter)); })
                    .text(function(d, i) { return(d); });

        // console.log(json);
        // var grid = d3.select("body").append("svg")
        //              .attr("width", width + (2 * margin))
        //              .attr("height", height + (2 * margin))
        //              .append("g")
        //              .attr("transform", "translate(" + margin + "," + margin + ")")
        //              .attr("class", "grid");

        // var row = grid.selectAll("riskTable")

        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        var risks = riskTable.selectAll("riskTable")
                             .data(json)
                             .enter()
                             .append("circle")
                             .attr("r", 0)
                             .attr("cx", 0)
                             .attr("cy", height)
                             .style("fill", "#0f0")
                             .style("stroke", "#fff")
                            // Start test tooltip area -- http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
                             .on("mouseover", function(d) {
                                // console.log("tooltip @ " + d3.event.pageX + " x " + d3.event.pageY);      
                                d3.select(this).style('fill', '#000');
                                div.transition()
                                   .duration(200)
                                   .style("opacity", 0.9);
                               div.html(d.name + "<br/><em>Likelihood:</em>"  + d.likelihood + "<br/><em>Impact:</em>" + d.impact)
                                  .style("left", (d3.event.pageX) + "px")
                                  .style("top", (d3.event.pageY - 28) + "px")
                                  .style("width", 200);
                             })
                             .on("mouseout", function(d) {
                               div.transition()
                                  .duration(500)
                                  .style("opacity", 0);
                               d3.select(this).style('fill', '#fff');
                              })
                             .transition()
                             .delay(250)
                             .duration(1000)
                             .style("fill", function(d) { 
                                 return("#fff");
                             })
                             .style("stroke", "#555")
                             .attr("r", FINAL_RADIUS)
                             .attr("cx", function(d) {
                                 // console.log(d.likelihood, x(1), x(2), x(3), x(4),  x(5), x(d.likelihood), (d.likelihood * cellWidth) - cellWidth/2 + margin, margin, width, cellWidth);
                                // return (d.likelihood * cellWidth) - cellWidth/2 + margin;
                                 return (x(d.likelihood) - margin);
                             })
                             .attr("cy", function(d) { 
                                // return (height - (d.impact * cellHeight) + cellHeight/2);
                                return (y(d.impact) + margin);
                             });
                             // .append("svg:title")
                             // .text(function(d) { return(d.name); });
    });
}
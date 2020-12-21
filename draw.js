async function loadData() {
  const voterData = await d3.csv("CSVs/voter-fraud.csv");
  const stealData = await d3.csv("CSVs/stop-the-steal.csv");
  const lamestreamData = await d3.csv("CSVs/lamestream-media.csv");
  const tangiblesData = await d3.csv("CSVs/tangibles2020.csv");
  const unsolicitedData = await d3.csv("CSVs/unsolicited-ballot.csv");
  const postData = await d3.csv("CSVs/fbtop10.csv");
  const gotNewsData = await d3.csv("CSVs/gotnews.csv");
  // const factData = await d3.csv("CSVs/factid.csv")
  // const opinionData = await d3.csv("CSVs/opinionid.csv")
  drawChart(voterData, '#voter-fraud');
  drawChart(stealData, '#stop-the-steal');
  drawChart(lamestreamData, '#lamestream-media');
  drawChart(tangiblesData, '#tangibles2020');
  drawChart(unsolicitedData, '#unsolicited-ballot');
  drawBarChart(postData, '#facebook-top10');
  drawBubbleChart(gotNewsData, '#gotnews');
}


function drawChart(voterData, container) {
  // set the dimensions and margins of the graph
  const margin = {top: 30, right: 30, bottom: 30, left: 60};
        width = 600 - margin.left - margin.right;
        height = 80 - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  
  const chart = svg.append('g')
    .attr('class', 'line-chart')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  chart.append("g")
    .attr('class', 'x axis')
    .call(d3.axisBottom(x).ticks(2));

  chart.selectAll("dot")
    .data(voterData.filter((d,i) => {return i < 100})) // the .filter part is just to keep a few dots on the chart, not all of them
    // .data(voterData.filter((d,i) => {
    //   if (d.subjectivity >= .2 && d.subjectivity <= .5) {return i < 500}
    //   else {return i < 50}
    //   }))
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.subjectivity); } )
    .attr("r", 7)
    .style("fill", "#571F4E")
    .style("opacity", 0.3)
    .style("stroke", "white")
    .on("mouseover", mouseover1)
    .on("mouseout", mouseout1);
}

//START FIRST TOOLTIP
const tooltip1 = d3.select('#voter-fraud')
  .append("div")
  .attr("class", "tooltip1")
  .style("opacity", 0);

function mouseover1(event, data) {
  tooltip1.style('left', `${event.clientX + 15}px`)
  .style('top', `${event.clientY}px`)
  .transition()
  .style('opacity', 0.98);
  
  tooltip1.join('p')
  .html(`<strong>Tweet:</strong> ${data.tweet}`);
}

function mousemove1(event, data) {
  tooltip1.style('left', `${event.clientX + 15}px`)
  .style('top', `${event.clientY}px`)
  .transition()
  .style('opacity', 0.98);
}

function mouseout1(event, data) {
  tooltip1.transition()
    .duration(300) // ms
    .style("opacity", 0);
}
//END FIRST TOOLTIP



function drawBarChart(postData, container2) {
  
  var xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05);
  
  xScale.domain(postData.map(function(d) {return d.user}));
  
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 150, left: 60}
        width = 800 - margin.left - margin.right
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select(container2)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  
  const chart = svg.append('g')
    .attr('class', 'line-chart')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, 27])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);

  chart.append("g")
    .attr('class', 'x axis')
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(${0},${height})`)
    .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", `rotate(-65)`);
    
  chart.append("g")
    .attr('class', 'y axis')
    .call(d3.axisLeft(y));

  
  chart.append("line")
    .attr("x1", 80)
    .attr("x2", 432)
    .attr("y1", 20)
    .attr("y2", 20)
    .style("stroke", "#aaa")
    .style("stroke-dasharray", ("3, 3"));

  
  // chart.append("rect")
  //   .attr("x", 32)
  //   .attr("y", 5)
  //   .attr("width", 243)
  //   .attr("height", 320)
  //   .style("opacity", 0.5)
  //   .attr("fill", "#95C9EE");

  chart.append("text")
    .attr("x", 14)
    .attr("y", 20)
    .attr("dy", ".35em")
    .text("Hard Left");
  
  chart.append("text")
    .attr("x", 438)
    .attr("y", 20)
    .attr("dy", ".35em")
    .text("Hard Right");

  chart.selectAll("dot")
    .data(postData)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d.user); } )
    .attr("cy", function (d) { return y(d.y); } )
    .attr("r", 7)
    .style("fill", function(d){
      if (d.lean === "Hard Left")
        return "#14507B";
      else if (d.lean === "Lean Left")
        return "#84C0EB";
      else if (d.lean === "Neutral")
        return "#FDE1C3";
      else if (d.lean === "Lean Right")
        return "#FF9185";
      else
        return "#A31000";
    })
    .style("opacity", 0.7)
    .attr("transform", `translate(13, 0)`)
    .on("mouseover", mouseover2)
    .on("mouseout", mouseout2);
}

//START SECOND TOOLTIP
const tooltip2 = d3.select('#facebook-top10')
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0);

function mouseover2(event, data) {
  tooltip2.style('left', `${event.clientX + 15}px`)
  .style('top', `${event.clientY}px`)
  .transition()
  .style('opacity', 0.98);
  
  tooltip2.join('p')
  .html(`<strong>User:</strong> ${data.user} <br /> <strong>Lean:</strong> ${data.lean}`);
}

// function mousemove2(event, data) {
//   tooltip2.style('left', `${event.clientX + 15}px`)
//   .style('top', `${event.clientY}px`)
//   .transition()
//   .style('opacity', 0.98);
// }

function mouseout2(event, data) {
  tooltip2.transition()
    .duration(300) // ms
    .style("opacity", 0);
}
//END SECOND TOOLTIP





function drawBubbleChart(gotNewsData, container3) {
  // set the dimensions and margins of the graph
  const margin = {top: 0, right: 10, bottom: 10, left: 10}
        width = 600 - margin.left - margin.right
        height = 400 - margin.top - margin.bottom;

  const svg = d3
  .select("#gotnews")
  .append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

  const graph = svg.append("g");

  const stratify = d3
    .stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent);

  const rootNode = stratify(gotNewsData).sum((d) => d.amount);

  const pack = d3.pack().size([600, 400]).padding(5);
  const bubbleData = pack(rootNode).descendants();
  const scheme = ["#ffffff", "#8000bf"];
  var bubbleColor = d3.scaleLinear().domain([0, 1, 2]).range(scheme);

  const nodes = graph
    .selectAll("g")
    .data(bubbleData)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  const circle = nodes
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", function(d){
      if (d.data.name === "Facebook")
        return "#4267B2";
      else if (d.data.name === "Instagram")
        return "#C13584";
      else if (d.data.name === "Twitter")
        return "#1DA1F2";
      else if (d.data.name === "Reddit")
        return "#FF5700";
      else if (d.data.name === "YouTube")
        return "#FF0000";
      else if (d.data.name === "LinkedIn")
        return "#2867B2";
      else
        return "#FFFFFF";
    })
    .style("opacity", 0.9)
    .on("mouseover", mouseover3)
    .on("mouseout", mouseout3);

  nodes
    .filter((node) => !node.children)
    .append("text")
    .text((d) => d.data.name)
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", (d) => d.value + 10)
    attr("dominant-baseline", "bottom");
}

//START THIRD TOOLTIP
const tooltip3 = d3.select('#gotnews')
  .append("div")
  .attr("class", "tooltip3")
  .style("opacity", 0);

function mouseover3(event, data) {
  tooltip3.style('left', `${event.clientX + 15}px`)
  .style('top', `${event.clientY}px`)
  .transition()
  .style('opacity', 0.98);
  
  tooltip3.join('p')
  .html(`<strong>${data.percent}</strong> of participants said they had received news from <strong>${data.name}</strong>`);
}

function mousemove3(event, data) {
  tooltip3.style('left', `${event.clientX}px`)
  .style('top', `${event.clientY}px`)
  .transition()
  .style('opacity', 0.98);
}

function mouseout3(event, data) {
  tooltip3.transition()
    .duration(300) // ms
    .style("opacity", 0);
}
//END THIRD TOOLTIP


var factData = [
  {name: 'Did', quantity: 26},
  {name: 'Did not', quantity: 74},
];

////
var opinionData = [
  {name: 'Did', quantity: 35},
  {name: 'Did not', quantity: 65},
];

function drawPieChart(data, container) {
  
  var pieGenerator = d3.pie()
    .value(function(d) {return d.quantity;})
    .sort(function(a, b) {
  return a.name.localeCompare(b.name);
  });
  
  // Create an arc generator with configuration
  var arcGenerator = d3.arc()
    .innerRadius(20)
    .outerRadius(100);

  var arcData = pieGenerator(data);

  const margin = {top: 30, right: 30, bottom: 30, left: 30};
    width = 200 - margin.left - margin.right;
    height = 200 - margin.top - margin.bottom;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const chart = svg.append('g')
    .attr('transform', `translate(100, 100)`);

  // Create a path element and set its d attribute
  d3.select('g')
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .style("fill", "#571F4E")
    .style("opacity", function(d){
      if (d.data.quantity === 26 || d.data.quantity === 35)
      return "0.8";
    else
      return "0.5";
    })
    .style("stroke", "white");

  // Labels
  d3.select('g')
    .selectAll('text')
    .data(arcData)
    .enter()
    .append('text')
    .each(function(d) {
      var centroid = arcGenerator.centroid(d);
      d3.select(this)
        .attr('x', centroid[0])
        .attr('y', centroid[1])
        .attr('dy', '0.33em')
        .text(d.data.name)
        .attr("fill", "white")
        .attr("text-anchor", "middle");
    });
}

drawPieChart(factData, '#factID');
drawPieChart(opinionData, '#opinionID');


loadData()
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = `/metadata/${sample}`;

  d3.json(url).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    let sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      let row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url = `/samples/${sample}`;

  d3.json(url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    let x_values = data.otu_ids;
    let y_values = data.sample_values;
    let buble_size = data.sample_values;
    let buble_colors = data.otu_ids;
    let label_values = data.otu_labels;

    let trace1 = {
      x: x_values,
      y: y_values,
      text: label_values,
      mode: 'markers',
      marker: {
        color: buble_colors,
        size: buble_size
      }
    };
  
    let bubleData = [trace1];

    let layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', bubleData, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {
      let pie_values = data.sample_values.slice(0,10);
      let pie_labels = data.otu_ids.slice(0,10);
      let pie_hover = data.otu_labels.slice(0,10);

      let pieData = [{
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hover,
        type: 'pie'
     }];

     Plotly.newPlot('pie', pieData);

   });
    
});
}

function init() {

  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

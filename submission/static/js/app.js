// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id == sample)[0];//[0] is used for dictionary, without it it will be list

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [key,value] of Object.entries(info)){
      panel.append("h6").text(`${key}:${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];
    console.log(info);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;



    // Build a Bubble Chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      mode:'markers',
      marker:{
        color: otu_ids,
        size : sample_values,
        colorscale: "RdBu"
      },
      text: otu_labels,
  
    };

    // Render the Bubble Chart
    let traces2 = [trace2];
    let layout1 = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria",
        automargin: true
      }
    };

    Plotly.newPlot('bubble', traces2, layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x=> `OUT: ${x}`);
    console.log(bar_y)
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: bar_y.slice(0,10).reverse(),
      type:'bar',
      marker:{
        color: "red"
      },
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    };

    // Render the Bar Chart
    let traces = [trace1];
    let layout ={
    title: "Top 10 Bacteria Cultures Found",
    xaxis: {
      title: "Number of Bacteria"
    },
    yaxis: {
      title: "Bacteria ID",
      automargin: true
    }

  };
  
  //Render the plot to the div tag
  Plotly.newPlot("bar",traces, layout)
  }
);
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);


    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_sample = names[0];
    console.log(default_sample);

    // Build charts and metadata panel with the first sample
    buildCharts(default_sample);
    buildMetadata(default_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();

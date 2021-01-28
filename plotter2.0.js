j = -100;
var pivl = [];
var pivltr = [];
while (j < 100) {
  vl = j * (math.pi) / 2;
  pivl.push(vl); //making a array containing values of n*pi/2
  vltr = parseFloat(vl.toFixed(2));
  pivltr.push(vltr);
  j++;
}
clcktm=0;

function plotgraph() {
  funcinp = document.getElementById("inputfunc").value;
  funcinp.trim();

  var dmnstart = parseFloat(document.getElementById("dmnstart").value);
  var dmnend = parseFloat(document.getElementById("dmnend").value);

  const expr = math.compile(funcinp);
  let xValues = math.range(dmnstart, dmnend, 0.01).toArray();
  xValues = xValues.map(a => parseFloat(a.toFixed(2)));
  i = 0;
  while (i < xValues.length) {
    if (pivltr.includes(xValues[i])) {
      j = pivltr.indexOf(xValues[i]);
      xValues[i] = pivl[j];
    }
    i++;
  }
  const yValues = xValues.map(function (x) {
    return expr.evaluate({
      x: x
    })
  })


  /*let i = 0;
  var dataset = [];
  nval = yValues.length;
  while (i < nval) {
    dataelement = {
      x: xValues[i],
      y: yValues[i]

    };
    dataset.push(dataelement);
    i++;

  }
  

  console.log(dataset)*/
  k = 0;
  while (k < yValues.length) {
    if (yValues[k] > (10 ** 15)) {
      yValues[k] = Infinity;
    };
    if (yValues[k] < -(10 ** 15)) {
      yValues[k] = -Infinity;
    }
    k++;
  }

  var plotline = {
    x: xValues,
    y: yValues,
    type: 'scatter',
  line: {
    color: 'rgb(219, 64, 82)'
  }
  };
  var layout = {
  
  width: 600,
  height: 600,
  margin: {
    l: 20,
    r: 20,
    b: 20,
    t: 20,
    pad: 4
  },
  paper_bgcolor: '#fcfcfc',
  plot_bgcolor: '#fcfcfc'
};

  var data = [plotline];
if(clcktm==0){
  Plotly.newPlot('plotarea', data,layout, {displaylogo: false},{responsive: true});
  clcktm=1;
}
else if(clcktm==1){
    Plotly.animate('plotarea', {
    data: data
  }, {
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
  })
}

}
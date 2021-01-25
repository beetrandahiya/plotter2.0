function plotgraph(){
    funcinp=document.getElementById("inputfunc").value;
    funcinp.trim();
    var dataset=[];
    var dmnstart=parseInt(document.getElementById("dmnstart").value);
     var dmnend=parseInt(document.getElementById("dmnend").value);

    const expr=math.compile(funcinp);
    const xValues = math.range(dmnstart, dmnend, 0.01).toArray()
      const yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
      })
      console.log(xValues);
      console.log(yValues);
      let i=0;
      nval=yValues.length;
      while(i<nval){
          dataelement={
              x:xValues[i],
              y:yValues[i]

          };
          dataset.push(dataelement);
          i++;

      }

    

      window.chart = new CanvasJS.Chart("plotarea",{
        animationEnabled: true,
        zoomEnabled: true,
        backgroundColor: 'rgba(255,255,255,0.3)',
        zoomType: 'xy',
        axisX: {
            gridThickness: 0.5,
            margin: 20
        },
        axisY: {
            gridThickness: 0.5,
            margin: 20
        },
        
        data: [{
            type: "spline",
            lineThickness: 2,
            color: "rgba(255,215,0,0.9)", //change later
            dataPoints: dataset
        }]

      })

      chart.render();


}
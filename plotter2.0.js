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
clcktm = 0;

function plotgraph() {
    funcinp = document.getElementById("inputfunc").value;
    funcinp.trim();

    var dmnstart = parseFloat(document.getElementById("dmnstart").value);
    var dmnend = parseFloat(document.getElementById("dmnend").value);

    const expr = math.compile(funcinp);
    xValues = math.range(dmnstart, dmnend, 0.01).toArray();
    xValues = xValues.map(a => parseFloat(a.toFixed(2)));
    i = 0;
    while (i < xValues.length) {
        if (pivltr.includes(xValues[i])) {
            j = pivltr.indexOf(xValues[i]);
            xValues[i] = pivl[j];
        }
        i++;
    }
    const yValues = xValues.map(function(x) {
        return expr.evaluate({
            x: x
        })
    });

    ///////////////////////   find infinities and roots ////////////////////////////////////////////////
    k = 0;
    rootsx = [];
    rootsy = [];
    while (k < yValues.length) {
        if (yValues[k] > (10 ** 15)) { //positive infinity
            yValues[k] = Infinity;
        };
        if (yValues[k] < -(10 ** 15)) { //negative infinity
            yValues[k] = -Infinity;
        }

        if (yValues[k] == 0) { //roots  --> y=0
            rootsx.push(xValues[k]);
            rootsy.push(yValues[k]);
        }
        if (Math.abs(yValues[k]) < (10 ** -12)) { //roots  ----> abs(y)< 10^-12
            yValues[k] = 0;
            rootsx.push(xValues[k]);
            rootsy.push(yValues[k]);
        }
        k++;
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////   continuity   /////////////////////////////////
    /*method of calculating limit is not very basic, but works 

    rhl= lim(a+)f(x)
    lhl= lim(a-)f(x)
    limvl=  (rhl+lhl)/2

    continous if =>  limvl = f(a)  [both rounded to 2 decimals]
    */
    /////////////todo------>> categorize among jump, removable, infinite discontinuity




    discntpoints = []; //to count discontinous points

    k = 0;
    while (k < yValues.length) {

        rhl = expr.evaluate({ x: xValues[k] + 0.000000001 });
        lhl = expr.evaluate({ x: xValues[k] - 0.000000001 });

        if (!(isNaN(rhl) || isNaN(lhl))) {


            limvl = parseFloat(((rhl + lhl) / 2).toFixed(2))
            fval = parseFloat(parseFloat(yValues[k]).toFixed(2))



            if (fval != limvl) {
                yValues[k] = NaN;
                discntpoints.push(xValues[k]);
            }



        }
        k++;
    }
    //console.log(discntpoints)

    /*known issue:
    discrete anomalies in floor function
    egs:  graph of floor(x^2) is not as expected

    */
    //////////////////////////////////////////////////////////////////////////////////////////
wrkwdth=$("#workspace").width();
wrkwdth=wrkwdth-50;
wrkrng=wrkwdth/60;

    var plotline = { //making plot dataset
        x: xValues,
        y: yValues,
        name: funcinp,
        type: 'scatter',
        showlegend: false,
        line: {
            color: 'rgba(255, 125, 184, 0.8)'
        }
    };

    var roots = { //making roots dataset
        x: rootsx,
        y: rootsy,
        name: 'root',
        type: 'scatter',
        mode: 'markers',
        marker: { color: 'rgba(255, 125, 184, 1)', size: 5 },
        showlegend: false
    };

    var layout = { //making layout
        xaxis: { range: [-wrkrng, wrkrng] },
        yaxis: { range: [-10, 10] },
        width: wrkwdth,
        height: 600,
        autosize: false,
        hovermode: 'closest',
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

    data = [plotline, roots];


    if (clcktm == 0) {
        Plotly.newPlot('plotarea', data, layout, { displaylogo: false , responsive: true,modeBarButtonsToRemove: ['select2d', 'lasso2d', 'toggleSpikelines', 'resetScale2d', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'] });
        clcktm = 1;
    } else if (clcktm == 1) {
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

//////////////////////////////////////// find derivative ////////////////////////////////////////

// using an internal funcion math.derivative(f(x),variable) of math.js
// example:  math.derivative('x^2-2x','x') // --> Node { 2*x-2 }
// then compile the node and then evaluate the compiled node 


////////////////////////////////////////////////////////////////////////////////////////////////
function findderivative() {
    deriv = math.derivative(funcinp, 'x');
    derivc = deriv.compile();
    // console.log(derivc.evaluate({x:0}));
    derivstr = deriv.toString();
    const derivValues = xValues.map(function(x) {
        return derivc.evaluate({
            x: x
        })
    });

    var derivline = { //making derivative plot dataset
        x: xValues,
        y: derivValues,
        name: derivstr,
        type: 'scatter',
        showlegend: false,
        line: {
            color: 'rgba(255, 125, 184, 0.4)'
        }
    };

    layout1 = {
       xaxis: { range: [-wrkrng, wrkrng] },
        yaxis: { range: [-10, 10] },
        width: wrkwdth, 
        height: 600,
        autosize: false,
        hovermode: 'closest',
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
    data.push(derivline); //adding it into main data
    //  console.log(derivValues);

    Plotly.react('plotarea', data, layout1, {displaylogo: false , responsive: true, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'resetScale2d', 'autoScale2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'] }); //using Plotly.react becoz its faster , it creates the plot again


}
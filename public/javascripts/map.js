class D3Map {
  constructor(width, height, margin) {

  };
};



function mapResize() {
  h = ($(window).height()*(1-screenPanel)) - 50 - $('#header').height();
  w = ($(window).width()) - 50;
  $("#map").height(h).width(w);
  map.invalidateSize();
};



function getMap() {
  map = L.map('map');

  map.setView([38, -100], 4);

  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 8,
        minZoom: 2,
      }).addTo(map);

  mapResize();

  map.doubleClickZoom.disable();

  return map;
};



//DEPRECIATED
async function populateMarkers(map) {
  data = await getData();

  //get relative ranking
  var arr = [];
  for (i in data) {
    arr.push(Number(data[i].score));
  };
  var sorted = arr.slice().sort(function(a,b) {
    return b-a;
  });
  var rank = arr.slice().map(function(v){
    return sorted.indexOf(v) + 1;
  });

  //get average score
  var sum = 0;
  var avg = 0;
  if (arr.length) {
    sum = arr.reduce(function(a, b) {
      return a + b;
    });
    avg = sum / arr.length;
  }

  // add marker
  var mark = [];

  var standing;

  for (i in data) {
    //get relative standing
    standing = Math.round(((data[i].score / avg) - 1) * 100)

    if (standing > 0) {
      standing = "<font color='green'>&#x25B2;" + standing + "% above average</font>";
    } else if (standing < 0) {
      standing = "<font color='red'>&#x25BC; " + standing + "% below average</font>";
    } else {
      standing = "No average standing available";
    };

    //create marker element
    mark[i] = addMarker(map, data[i].name, data[i].lat, data[i].lng,
      data[i].score, rank[i] + " (of " + rank.length + ")", standing);

    //attach array number to JSON object
    mark[i].id = i;
  };

  return mark;
};



//DEPRECIATED
function addMarker(map, name, lat, lng, score, rank, standing) {
  options = {
    radius: scl,
    stroke: false,
    color: "black",
    opacity: 1,
    fill: true,
    fillColor: "red",
    fillOpacity: 0,
  };

  var mark = L.circleMarker([lat, lng], options).addTo(map);

  mark.on("click", ()=> {
    //this is where hooks into .d3 should be made
    updateGraph(mark.id);
  });

  mark.on("mouseover", ()=> {
    //mark.setRadius(20);
  });

  mark.on("mouseout ", ()=> {
    //mark.setRadius(scl);
  });

  mark.bindTooltip(name, {direction: 'left'})
  mark.bindPopup(
    `<h1>` + name + `</h1>
    <table style="width:100%">
      <tr>
        <th>Score</th>
        <th>Ranking</th>
        <th>Standing</th>
      </tr>
      <tr>
        <td>` + score + `</td>
        <td>` + rank + `</td>
        <td>` + standing + `</td>
      </tr>
    </table>`
  );



  mark.name = name;
  return(mark);
};



/**********************
*** UPDATE BARCHART ***
**********************/

//updateGraph() is called when a leaflet marker is clicked

async function updateGraph(id) {
  data = await getData();

  dataArray = reduceData(data[id]);

  barplot.updatePlot(barplot.canvas, dataArray);
};



/* @reduceData(object)
  - provide JSON object, removes data not used in graph visualization (i.e name
    and coordinates) and returns an array ready for d3 to use.
*/
function reduceData(data) {

  rtn = [];
  for (key in data) {
    if (matches(key, ["name","lat","lng","score"]) == false) {
      rtn.push({"name": key, "value": data[key]})
    };
  };
  return rtn;
};



/* @matches(string, object)
  - if any item in the array 'search' is the key string, return true, else false
*/

function matches(key, search) {
  for (i in search) {
    if (key == search[i]) {
      return true;
    };
  };
  return false;
};



async function d3PopulateMarkers(map) {
  data = await getData();

    g.selectAll("circle")
      .data(data)
      .enter()
        .append("circle")
        .attr("id", function(d, i) {
          return i;
        })
        .attr("r", 0)
        .attr("cx", function(d) {
          return map.layerPointToLatLng([d.lat, d.lng]).x;
        })
        .attr('cy', function(d) {
          return map.layerPointToLatLng([d.lat, d.lng]).y;
        })
        .attr("stroke","white")
        .attr("stroke-width", 1)
        .attr("fill", markCol)
        .attr("pointer-events","visible")
        .on("mouseover", function() {

          var myCol = d3.select(this).attr("fill")

          d3.select(this)
            .style("cursor", "pointer")
            .call(attrTween, 100, "fill", setAlpha(myCol, .4))
        })
        .on("mouseout", function() {

          var myCol = d3.select(this).attr("fill")

          d3.select(this)
            .style("cursor", "default")
            .call(attrTween, 100, "fill", setAlpha(myCol, 1))
        })
        .on("click", function() {
          updateGraph(d3.select(this).attr("id"))
        })

    function mouseover(obj) {
      obj
        .style("cursor", "pointer")
        .transition()
        .duration(300)
          .style("opacity", .3)
    }

    function mouseout(obj) {
      obj
        .style("cursor", "default")
        .transition()
        .duration(600)
          .style("opacity", 1)
    }

    map.on("zoomend", update);
  	update();

    function update() {
      if (scaleToZoom) {
        //get pxl distance between two coords
        x1 = map.latLngToLayerPoint([0,1]).x
        x2 = map.latLngToLayerPoint([0,0]).x

        scl = (x1-x2);
      }

      g.selectAll("circle")
        .attr("r", scl)
        .attr("transform", function(d) {
          return "translate("+
            map.latLngToLayerPoint([d.lat, d.lng]).x +","+
            map.latLngToLayerPoint([d.lat, d.lng]).y +")";
          })

      for (i in mark) {
        mark[i].setStyle({radius: scl})
      };
    };
};

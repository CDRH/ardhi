window.addEventListener('load', function () {


  ////////////////
  // APPEARANCE //
  ////////////////

  function buildHtml(props) {
    html = "<div class='map_feature'>";

    // add a title if one exists
    if (props["title"]) {
      html += "<strong>" + props["title"] + "</strong>";
      var link = path + "/item/" + props["identifier"];
      html += "<p><a href='" + link + "'>" + props["document"] + "</a></p>";    }

    html += "</div>";
    return html;
  }

  var clusterSettings = {
    maxClusterRadius: 0,
    singleMarkerMode: true,
    spiderLegPolylineOptions: {
      // using a color that will match marker cluster
      color: "black",
      weight: 3,
      opacity: 1
    },
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: cluster.getChildCount(),
        className: 'marker_cluster',
        iconSize: L.point(18, 18)
      });
    }
  };

  // turns geojson properties into something the map can understand
  // map attributes on the left, geojson properties on the right
  function drawOptions(props) {
    return {
      radius: 6,
      color: "black",
      fillColor: "orange",
      fillOpacity: 0.7
    }
  }

  // for each feature (point, line, polygon) in the geojson,
  // build some HTML with the properties and add it as a popup
  function onEachFeature(feature, layer) {
    var html = buildHtml(feature.properties);
    layer.bindPopup(html);
  }

  // for each point (not lines / polygons), make a circle marker
  // styled with the properties defined in the geojson
  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, drawOptions(feature.properties));
  }

  // style all the lines / polygons using properties in the geojson
  function style(feature) {
    return drawOptions(feature.properties);
  }

  //////////////////////
  // BASIC MAP SETUP  //
  //  (do not change) //
  //////////////////////

  // Create a base layer (uses open street maps)
  var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attributionControl: false
  });

  // Create the actual map and start it zoomed in on Lincoln
  var map = L.map("map", {
      center: new L.LatLng(0, 13),
      zoom: 3,
      layers: [baseLayer]
  });

  // Adds an attribution for the map base layer
  L.control.attribution({
    position: 'bottomleft',
    prefix: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'

  }).addTo(map);

  // note this is using the TEAA basemaps
  function create_tile_layer(layer) {
    return new L.TileLayer.WMS("https://cdrhdev1.unl.edu/geoserver/gwc/service/wms", {
      layers: "teaa:"+layer,
      format: "image/png",
      transparent: true
    });
  };

  // add raster basemaps
  var s91 = create_tile_layer("stie_1891");
  var a95 = create_tile_layer("andre_1895");
  // only add one map to begin with
  // map.addLayer(s91);

  // primary layers control
  L.control.layers(
    {
      "1891" : s91,
      "1895" : a95,
      "current" : baseLayer
    },
    {},
    {
      collapsed: false, autoZIndex: false, sortLayers: false,
    }
  ).addTo(map);

  // read in geojson data
  // alter this code if you are switching to ajax
  var geojson = L.geoJSON(json, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: style
  });

  var markers = L.markerClusterGroup(clusterSettings);
  markers.addLayer(geojson);
  map.addLayer(markers);

  // zoom the map to fit whatever items are being displayed
  // commented out because some documents only have one location
  // and it looks a little disorienting to be that closely zoomed
  // map.fitBounds(geojson.getBounds());

});

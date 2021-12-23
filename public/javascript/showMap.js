

    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: campground.geometry.coordinates,
    zoom: 9 
    });
    map.addControl(new mapboxgl.NavigationControl());

    var marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);
    
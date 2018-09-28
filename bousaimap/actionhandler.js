$(function () {
    $("#getCurrent").click(function () {
        map.setCenter(currentLocation);
        map.setZoom(18);
    });

    // Go to location when click on location_item
    $('#location_list').on('click', '.location_item', function () {
        var latlng = parseLatLng($(this).attr('coordinate'));
        selectedLocation = latlng;
        map.setCenter(selectedLocation);
        map.setZoom(18);
    });

    $('#direction').click(function () {
        if (selectedLocation == null) {
            alert("場所を選択してください");
            return;
        }
        calcRoute();
    })

    $('#type').change(function () {
        getLocationsFromYahoo($(this).val());
    })

})
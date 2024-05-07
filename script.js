var cntry = document.getElementById("cnt")
var cityName = document.getElementById("cti")

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/AreaMeasurement2D",
    "esri/widgets/Expand",
    "esri/layers/FeatureLayer",
    "esri/WebMap",
    "esri/request",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Legend"
    
],
    function (esriConfig,Map,MapView, BasemapGallery, AreaMeasurement2D, Expand, FeatureLayer, WebMap, esriRequest, Graphic, GraphicsLayer, Legend) {

        esriConfig.apiKey = "AAPK1d2d85bfebac4fe4a7f684a32f1d9d0clLf_gEmnKk6-YVFwOy-fcQdrFFpvyQmiPbf-5BqA9oQXPsXDV9J4n8Y0dFS6g4PR";
        esriConfig.portalUrl = "https://iti51b4ea2045821.maps.arcgis.com"

        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);

        
        var myRenderer = {
            type: "class-breaks",
            field: "POP",
            classBreakInfos: [
                {
                    minValue: 0,
                    maxValue: 5000,
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        style: "circle",
                        color: "blue",
                        size: "8px",  // pixels
                        // outline: {  // autocasts as new SimpleLineSymbol()
                        //  color: [ 255, 255, 0 ],
                        //   width: 3  // points
                        // } 
                    }
                },
                {
                    minValue: 5000,
                    maxValue: 50000,
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        style: "circle",
                        color: "green",
                        size: "8px",  // pixels
                        // outline: {  // autocasts as new SimpleLineSymbol()
                        //   color: [ 255, 255, 0 ],
                        //   width: 3  // points
                        // }
                    }
                },
                {
                    minValue: 50000,
                    maxValue: 500000,
                    symbol: {
                        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                        style: "circle",
                        color: "orange",
                        size: "8px",  // pixels
                        // outline: {  // autocasts as new SimpleLineSymbol()
                        //   color: [ 255, 255, 0 ],
                        //   width: 3  // points
                        // }
                    }
                }
            ]
        }

        var myPopup2 = {
            // autocasts as new PopupTemplate()
            title: "Here a few information of {CITY_NAME}",

            // Set content elements in the order to display.
            // The first element displayed here is the fieldInfos.
            content: [
                {
                // It is also possible to set the fieldInfos outside of the content
                // directly in the popupTemplate. If no fieldInfos is specifically set
                // in the content, it defaults to whatever may be set within the popupTemplate.
                type: "fields", // FieldsContentElement
                fieldInfos: [
                    {
                        fieldName: "ObjectID",
                        visible: false,
                        label: "ObjectID",
                        // format: {
                        //     places: 0,
                        //     digitSeparator: true
                        // }
                    },
                    {
                        fieldName: "POP",
                        visible: true,
                        label: "Population",
                        // format: {
                        //     places: 0,
                        //     digitSeparator: true
                        // },
                        // statisticType: "sum"
                    },
                    {
                        fieldName: "CITY_NAME",
                        visible: false,
                        label: "CITY_NAME"
                    },
                    {
                        fieldName: "CNTRY_NAME",
                        visible: true,
                        label: "Country"
                    }
                ]
                },
                {
                    // You can also set a descriptive text element. This element
                    // uses an attribute from the featurelayer which displays a
                    // sentence giving the total amount of trees value within a
                    // specified census block. Text elements can only be set within the content.
                    type: "text", // TextContentElement
                    text: "There are {POP} people within {CITY_NAME}."
                },
                {
                    // You can set a media element within the popup as well. This
                    // can be either an image or a chart. You specify this within
                    // the mediaInfos. The following creates a pie chart in addition
                    // to two separate images. The chart is also set up to work with
                    // related tables. Similar to text elements, media can only be set within the content.
                    type: "media", // MediaContentElement
                    mediaInfos: [
                        {
                            title: "<b>City by population</b>",
                            type: "pie-chart",
                            // type: "bar-chart",
                            // type: "column-chart",
                            // type: "line-chart",
                            caption: "",
                            value: {
                                fields: ["POP"],
                                normalizeField: null,
                                tooltipField: "CITY_NAME"
                            }
                        },
                        {
                            title: "<b>City Palms</b>",
                            type: "image",
                            caption: "tree species",
                            value: {
                                sourceURL:
                                "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg"
                            }
                        }
                    ]
                },
                {
                    // You can set a attachment element(s) within the popup as well.
                    // Similar to text and media elements, attachments can only be set
                    // within the content. Any attachmentInfos associated with the feature
                    // will be listed in the popup.
                    type: "attachments" // AttachmentsContentElement
                }
            ]
        }

        var myLayer2 = new FeatureLayer ({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0",
            popupTemplate: myPopup2,
            outFields: ["*"],
            renderer: myRenderer,
        })

        // Add graphic when GraphicsLayer is constructed
        var graLayer = new GraphicsLayer({
        // graphics: [point]
        });

        var map = new Map ({
            basemap: "dark-gray-vector",
            layers: [myLayer2]
        })

        var view = new MapView ({
            map: map,
            container: "map",
            center: [31.554, 30.5689],
            zoom: 6
        })

        // view.on("click", function(event){
        //     console.log(event)
        //     view.goTo({
        //         target: event.mapPoint,
        //         zoom: 13
        //     }, {duration: 3500})
        // })

        var basMapGallery = new BasemapGallery ({
            view: view
        })

        var measurementWidget = new AreaMeasurement2D ({
            view: view
        })

        var Expand1 = new Expand ({
            view: view,
            content: basMapGallery,
            expandIcon: "basemap",
            group: "top-right",
            iconNumber: 27,
            // expanded: true,
            expandTooltip: "Choose your favorite basemap",
            collapseTooltip: "Close basemap gallery",
        })

        var Expand4 = new Expand ({
            view: view,
            content: measurementWidget,
            expandIcon: "measure",
            group: "top-right",
            // expanded: false,
            expandTooltip: "Expand to Measure",
            collapseTooltip: "Close Measure",
        })

        const legend = new Legend({
            view: view,
            layerInfos: [
                {
                    layer: myLayer2,
                    title: "World Cities"
                }
            ]
        });

        // Add widget to the bottom right corner of the view
        view.ui.add(legend, "bottom-right");


        view.ui.add([Expand1], {position: "top-right", index: 1});
        view.ui.add([Expand4], "top-left");

        view.ui.add(["queryy"], "top-right")
        view.ui.add(["quu"], "top-right")

        var reqURL = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0/query"

        var reqOpt = {
            responseType: "json",
            query: {
                where: "1=1",
                outFields: ["CITY_NAME, CNTRY_NAME, POP"],
                f: "json"
            }
        }

        esriRequest(reqURL, reqOpt).then(function(result){
            console.log(result)
            var cntarr = []
            for (let i = 0; i < result.data.features.length; i++) {
                if (!cntarr.includes(result.data.features[i].attributes.CNTRY_NAME)) {
                    cntarr.push(result.data.features[i].attributes.CNTRY_NAME)

                    var opt = document.createElement("option")
                    opt.value = result.data.features[i].attributes.CNTRY_NAME
                    opt.textContent = result.data.features[i].attributes.CNTRY_NAME

                    cntry.appendChild(opt)

                }
            }
        })

        cntry.addEventListener("change", function(){
            // alert(this.value)
            graLayer.removeAll()
            if (this.value == "all") {
                myLayer2.definitionExpression = ""
            } else {
                myLayer2.definitionExpression = "CNTRY_NAME = '"+this.value+"'"
            }
            myLayer2.queryExtent().then(function(result){
                // console.log(result)
                view.goTo({
                    target: result.extent,
                    // zoom: 13
                }, {duration: 4500})
            })

            reqOpt.query.where = "CNTRY_NAME = '"+this.value+"'"

            esriRequest(reqURL, reqOpt).then(function(result){
                // console.log(result.data)
                while(cityName.firstChild)
                {
                    cityName.removeChild(cityName.firstChild)
                }
                for (let i = 0; i < result.data.features.length; i++) {
                    
                    var opt = document.createElement("option")
                    opt.value = result.data.features[i].attributes.CITY_NAME
                    opt.textContent = result.data.features[i].attributes.CITY_NAME

                    cityName.appendChild(opt)
                    drawChart(result.data)
                }
            })
            
        })

        cityName.addEventListener("change", function(){
            // alert("changed")
            graLayer.removeAll()            
            myLayer2.definitionExpression = "CITY_NAME = '"+this.value+"'"

            myLayer2.queryExtent().then(function(result){
                // console.log(result)
    
                // First create a point geometry (this is the location of the city)
                var point = {
                    type: "point", // autocasts as new Point()
                    longitude: result.extent.center.longitude,
                    latitude: result.extent.center.latitude
                };

                var symbolPoint = {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    style: "circle",
                    // color: "blue",
                    size: 15,  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                      color: [ 0, 255, 0 ],
                      width: 3  // points
                    }
                }

                var stop = new Graphic({
                    geometry: point,
                    symbol: symbolPoint
                })

                
                graLayer.add(stop)
                map.add(graLayer)

                view.goTo({
                    target: result.extent,
                    zoom: 3
                }, {duration: 4500})
            })
        })

        //////////// chart chart chart chart chart chart chart chart chart chart chart chart chart chart chart chart chart chart 
        function drawChart(cities) {
            document.getElementById("chart").classList.remove('remov');
        
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'City Name');
            data.addColumn('number', 'POP');
            data.addRows([
                [cities.features[0].attributes.CITY_NAME, cities.features[0].attributes.POP],
            ]);

            for (let i = 1; i < cities.features.length; i++) {
                data.addRows([
                    [cities.features[i].attributes.CITY_NAME, cities.features[i].attributes.POP],
                ]);    
            }
            var options = {
                title: "There are Cities of "+cities.features[0].attributes.CNTRY_NAME+"",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: { position: "none" },
            };
            var chart = new google.visualization.BarChart(document.getElementById("chart"));
            chart.draw(data, options);
            view.ui.add(["chart"], "bottom-left");
            view.ui.add(["bb"], "bottom-left");
            document.getElementById("bb").classList.remove('btnnn');
        }

        var closebtnn = document.getElementsByClassName("btnn");
        for (const closee of closebtnn) {
            closee.addEventListener('click', function onClick() {
                // this.parentElement.style.display = 'none';
                document.getElementById("chart").classList.add('remov');
                document.getElementById("bb").classList.add('btnnn');
            });
        }
































    });


    

    










































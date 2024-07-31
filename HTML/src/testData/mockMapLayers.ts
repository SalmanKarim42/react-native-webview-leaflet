import { MapLayer } from "../models";

const mockMapLayers: MapLayer[] = [
  {
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: "CartoDB Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
  },
  {
    attribution:
      '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: "CartoDB Positron Only Labels",
    url: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    zIndex: 1000,
  },
  // {
  //   attribution:
  //     '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  //   baseLayerIsChecked: false,
  //   baseLayerName: "OpenStreetMap.BlackAndWhite",
  //   url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
  // },
  // {
  //   baseLayerName: "WMS Tile Layer",
  //   subLayer: "nasa:bluemarble",
  //   layerType: MapLayerType.WMS_TILE_LAYER,
  //   url: "https://demo.boundlessgeo.com/geoserver/ows"
  // },
  // {
  //   baseLayerName: "Image",
  //   layerType: MapLayerType.IMAGE_LAYER,
  //   url: "http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg",
  //   bounds: [
  //     [40.712216, -74.22655],
  //     [40.773941, -74.12544]
  //   ]
  // }
];

export default mockMapLayers;

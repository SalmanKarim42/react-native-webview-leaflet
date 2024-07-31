import * as React from "react";
import { LayerGroup, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { createDivIcon } from "./utilities";
import {
  WebViewLeafletEvents,
  MapMarker,
  OWN_POSTION_MARKER_ID
} from "./models";
import { LatLngExpression } from "leaflet";
require("react-leaflet-markercluster/dist/styles.min.css");



interface MapMarkersProps {
  mapMarkers: MapMarker[];
  onMapEvent: (mapEvent: WebViewLeafletEvents, payload: any) => void;
  useMarkerClustering?: boolean;
}

export default class MapMarkers extends React.Component<MapMarkersProps> {
  private MapMarker = ({ mapMarker }: { mapMarker: MapMarker }) => {
    return (
      <Marker
        key={mapMarker.id || Math.random().toString()}
        position={mapMarker.position as LatLngExpression}
        icon={createDivIcon(mapMarker)}
        onClick={() => {
          this.props.onMapEvent(WebViewLeafletEvents.ON_MAP_MARKER_CLICKED, {
            mapMarkerID: mapMarker.id
          });
        }}
      >
        {mapMarker.title && <Popup className="marker-popup">
          <div className="marker-popup-stack">
            <div className="marker-popup-avatar">
              <img src={mapMarker.iconPopup} alt="icon" className="marker-avatar-icon" />
            </div>
            <div className="text-content">
              <p className="marker-title">
                {mapMarker.title}
              </p>
              <div className="marker-chip" style={{ backgroundColor: mapMarker.badgeBgColor }}>
                <div className="marker-chip-dot" style={{ backgroundColor: mapMarker.badgeColor }}></div>
                <p className="marker-chip-label" style={{ color: mapMarker.badgeColor }}>{mapMarker.badgeLabel}</p>
              </div>
            </div>
          </div>
        </Popup>}
      </Marker>
    );
  };

  render() {
    const { mapMarkers, useMarkerClustering = true } = this.props;
    if (useMarkerClustering) {
      return (
        <LayerGroup>
          <MarkerClusterGroup>
            {mapMarkers.map((mapMarker: MapMarker) => {
              if (mapMarker.id !== OWN_POSTION_MARKER_ID) {
                return (
                  <this.MapMarker
                    key={mapMarker.id || Math.random().toString()}
                    mapMarker={mapMarker}
                  />
                );
              } else {
                return null;
              }
            })}
          </MarkerClusterGroup>
          {mapMarkers.map((mapMarker: MapMarker) => {
            if (mapMarker.id === OWN_POSTION_MARKER_ID) {
              return <this.MapMarker mapMarker={mapMarker} />;
            } else {
              return null;
            }
          })}
        </LayerGroup>
      );
    } else {
      return (
        <LayerGroup>
          {mapMarkers.map((mapMarker: MapMarker) => {
            return <this.MapMarker mapMarker={mapMarker} />;
          })}
        </LayerGroup>
      );
    }
  }
}

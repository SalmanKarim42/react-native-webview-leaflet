import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/images/layers-2x.png";
import "leaflet/dist/images/layers.png";
import "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import React, { Component } from "react";
import { LatLng, LeafletContext, Viewport } from "react-leaflet";
import MapComponentView from "./MapComponent.view";
import {
  // AnimationType,
  // INFINITE_ANIMATION_ITERATIONS,
  MapEventMessage,
  MapLayer,
  MapMarker,
  MapShape,
  WebViewLeafletEvents,
  WebviewLeafletMessagePayload,
} from "./models";
import "./styles/markerAnimations.css";
import "./styles/markers.css";
import mockMapLayers from "./testData/mockMapLayers";
// import mockMapMarkers from "./testData/mockMapMarkers";
// import mockMapShapes from "./testData/mockMapShapes";

export const SHOW_DEBUG_INFORMATION = false;
const ENABLE_BROWSER_TESTING = true;

interface State {
  debugMessages: string[];
  isFromNative: boolean;
  isMobile: boolean;
  mapCenterPosition: LatLngLiteral;
  mapLayers: MapLayer[];
  mapMarkers: MapMarker[];
  mapShapes: MapShape[];
  ownPositionMarker: MapMarker;
  mapRef: any;
  zoom: number;
  className?: string | null;
  contextValue?: LeafletContext | null;
  container?: HTMLDivElement | null;
  viewport?: Viewport | null;
  debugMap?: boolean
}

export default class MapComponent extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      debugMessages: ["test"],
      isFromNative: false,
      isMobile: null,
      mapCenterPosition: { lat: 36.56, lng: -76.17 },
      mapLayers: [],
      mapMarkers: [],
      mapShapes: [],
      mapRef: null,
      ownPositionMarker: null,
      zoom: 6,
      debugMap: false
    };
  }

  componentDidMount = () => {
    let DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    this.addEventListeners();
    this.sendMessage({
      msg: WebViewLeafletEvents.MAP_COMPONENT_MOUNTED,
    });
    if (ENABLE_BROWSER_TESTING) {
      this.loadMockData();
    }
  };

  componentDidUpdate = (prevProps: any, prevState: State) => {
    const { mapRef } = this.state;
    if (mapRef && !prevState.mapRef) {
      mapRef.current?.leafletElement.invalidateSize();
      this.sendMessage({
        msg: WebViewLeafletEvents.MAP_READY,
      });
    }
  };

  private addDebugMessage = (msg: any) => {
    if (typeof msg === "object") {
      this.addDebugMessage("STRINGIFIED");
      this.setState({
        debugMessages: [
          ...this.state.debugMessages,
          JSON.stringify(msg, null, 4),
        ],
      });
    } else {
      this.setState({ debugMessages: [...this.state.debugMessages, msg] });
    }
  };

  private addEventListeners = () => {
    if (document) {
      document.addEventListener("message", this.handleMessage);
      this.addDebugMessage("set document listeners");
      this.sendMessage({
        msg: WebViewLeafletEvents.DOCUMENT_EVENT_LISTENER_ADDED,
      });
    }
    if (window) {
      window.addEventListener("message", this.handleMessage);
      this.addDebugMessage("setting Window");
      this.sendMessage({
        msg: WebViewLeafletEvents.WINDOW_EVENT_LISTENER_ADDED,
      });
    }
    if (!document && !window) {
      this.sendMessage({
        error: WebViewLeafletEvents.UNABLE_TO_ADD_EVENT_LISTENER,
      });
      return;
    }
  };

  private handleMessage = (event: any & { data: State }) => {
    this.addDebugMessage(event.data);
    try {
      if (event.data.mapCenterPosition) {
        this.state.mapRef.leafletElement.flyTo([
          event.data.mapCenterPosition.lat,
          event.data.mapCenterPosition.lng,
        ]);
      }
      console.log(event, 'event')
      if (event.data.event === 'resetMapState') {
        const { mapCenterPosition, zoom } = this.state
        this.state.mapRef.leafletElement.flyTo([
          mapCenterPosition.lat,
          mapCenterPosition.lng,
        ], zoom);
      } else
        this.setState({ ...this.state, ...event.data });
      //  if( event.event === 'resetMapState'){
      //    console.log('event' , )
      //  } else { 
      //  }
    } catch (error) {
      this.addDebugMessage({ error: JSON.stringify(error) });
    }
  };

  protected sendMessage = (message: MapEventMessage) => {
    // @ts-ignore
    if (window.ReactNativeWebView) {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      console.log("sendMessage  ", JSON.stringify(message));
    }
  };

  private loadMockData = () => {
    this.addDebugMessage("loading mock data");
    this.setState({
      mapLayers: mockMapLayers,
      // mapMarkers: mockMapMarkers,
      // mapShapes: mockMapShapes,
      // ownPositionMarker: {
      //   id: "Own Position",
      //   position: { lat: 36.56, lng: -76.17 },
      //   icon: "❤️",
      //   size: [32, 32],
      //   // animation: {
      //   //   duration: 1,
      //   //   delay: 0,
      //   //   iterationCount: INFINITE_ANIMATION_ITERATIONS,
      //   //   type: AnimationType.BOUNCE,
      //   // },
      // },
    });
  };

  private onMapEvent = (
    webViewLeafletEvent: WebViewLeafletEvents,
    payload?: WebviewLeafletMessagePayload
  ) => {
    if (!payload && this.state.mapRef?.leafletElement) {
      debugger;
      const mapCenterPosition: LatLng = {
        lat: this.state.mapRef.leafletElement?.getCenter().lat,
        lng: this.state.mapRef.leafletElement?.getCenter().lng,
      };

      payload = {
        mapCenterPosition: mapCenterPosition,
        bounds: this.state.mapRef.leafletElement?.getBounds(),
        zoom: this.state.mapRef.leafletElement?.getZoom(),
      };
    }
    this.sendMessage({ event: webViewLeafletEvent, payload });
  };

  private setMapRef = (mapRef: any) => {
    if (!this.state.mapRef) {
      this.setState({ mapRef });
    }
  };


  render() {
    console.log('center', this.state.mapCenterPosition)
    return (
      <MapComponentView
        addDebugMessage={this.addDebugMessage}
        onMapEvent={this.onMapEvent}
        setMapRef={this.setMapRef}
        {...this.state}
      />
    );
  }
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState, useMemo, useCallback} from 'react';
import MapGL from 'react-map-gl';

const getEventsGeojson = (events) => {
  return {
    type: 'FeatureCollection',
    features: events.map(({id, lat, lon, authorizationStatus}) => {
      return {
        type: 'Feature',
        properties: {id, authorizationStatus},
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
      };
    }),
  };
};

const id = 'points';
export const EVENTS_COLORS = {
  encounter: '#FAE9A0',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#cfa9f9',
};

const encountersClusterColor = [
  'case',
  ['==', ['get', 'unmatched'], true],
  EVENTS_COLORS.unmatched,
  ['==', ['get', 'partially'], true],
  EVENTS_COLORS.partially,
  EVENTS_COLORS.encounter,
];
const encountersPointColor = [
  'case',
  ['==', ['get', 'authorizationStatus'], 'unmatched'],
  EVENTS_COLORS.unmatched,
  ['==', ['get', 'authorizationStatus'], 'partially'],
  EVENTS_COLORS.partially,
  EVENTS_COLORS.encounter,
];
const loiteringColor = EVENTS_COLORS.loitering;

export default function EventsMap({events, eventType}) {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const style = useMemo(
    () => ({
      version: 8,
      glyphs:
        'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-glyphs/master/_output/{fontstack}/{range}.pbf?raw=true',
      sprite:
        'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites',
      sources: {
        basemap: {
          type: 'vector',
          maxzoom: 9,
          attribution:
            '<a href="https://www.naturalearthdata.com">Natural Earth</a> | <a href="https://gadm.org/">GADM</a>',
          tiles: [
            'https://storage.googleapis.com/public-tiles/basemap/default/{z}/{x}/{y}.pbf',
          ],
        },
        bathymetry: {
          attribution:
            '<a href="https://visibleearth.nasa.gov/images/73963/bathymetry">NASA</a>',
          maxzoom: 8,
          tiles: [
            'https://storage.googleapis.com/public-tiles/basemap/bathymetry/{z}/{x}/{y}.png',
          ],
          type: 'raster',
        },
        [id]: {
          type: 'geojson',
          data: getEventsGeojson(events),
          cluster: true,
          clusterMaxZoom: 9, // Max zoom to cluster points on
          clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50),
          clusterProperties: {
            unmatched: [
              'any',
              ['==', ['get', 'authorizationStatus'], 'unmatched'],
            ],
            partially: [
              'any',
              ['==', ['get', 'authorizationStatus'], 'partially'],
            ],
          },
        },
      },
      layers: [
        {
          id: 'bathymetry',
          layout: {visibility: 'visible'},
          metadata: {group: 'basemap', generatorType: 'BASEMAP'},
          paint: {},
          source: 'bathymetry',
          type: 'raster',
        },
        {
          id: 'countries',
          paint: {'fill-color': '#274777', 'fill-opacity': 0.99},
          source: 'basemap',
          'source-layer': 'countries',
          type: 'fill',
        },
        {
          id: `${id}_cluster`,
          source: id,
          type: 'circle',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color':
              eventType === 'loitering'
                ? loiteringColor
                : encountersClusterColor,
            'circle-radius': [
              'interpolate',
              ['exponential', 0.9],
              ['get', 'point_count'],
              50,
              14,
              700,
              20,
              1200,
              26,
              3200,
              35,
              6000,
              40,
            ],
          },
        },
        {
          id: `${id}_cluster-number`,
          source: id,
          type: 'symbol',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Roboto Medium'],
            'text-size': 16,
            'text-offset': [0, 0.13],
          },
          paint: {
            'text-color': 'rgb(1, 37, 91)',
          },
        },
        {
          id: `${id}_event`,
          source: id,
          type: 'circle',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color':
              eventType === 'loitering' ? loiteringColor : encountersPointColor,
            'circle-radius': 12,
          },
        },
        {
          id: `${id}_event-icon`,
          source: id,
          type: 'symbol',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image':
              eventType === 'loitering'
                ? 'carrier_portal_loitering'
                : 'carrier_portal_encounter',
          },
        },
      ],
    }),
    [events]
  );
  const onClick = useCallback((e) => {
    console.log(e.features);
  }, []);
  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      mapStyle={style}
      onViewportChange={setViewport}
      interactiveLayerIds={[`${id}_cluster`, `${id}_event`]}
      onClick={onClick}
    />
  );
}

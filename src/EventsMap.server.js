/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import EventsMap from './EventsMap.client';

export default function Events({events, eventType}) {
  const eventsCoordinates = events.map((event) => {
    const authorizationStatus = event.encounter && event.encounter.authorizationStatus
    return {
      authorizationStatus,
      lat: event.position.lat.toFixed(4),
      lon: event.position.lon.toFixed(4),
      id: event.id
    }
  });

  return <EventsMap events={eventsCoordinates} eventType={eventType} />;
}

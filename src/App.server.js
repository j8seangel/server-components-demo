/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {fetch} from 'react-fetch';
import { Suspense } from 'react';
import { readFile } from 'react-fs';
import path from 'path';

import EventsMap from './EventsMap.server';
import VesselsList from './VesselsList.server';
import EventsTypeToggle from './EventsTypeToggle.client';
import Spinner from './Spinner';

export default function App({ eventType }) {
  const events = fetch(`http://localhost:4000/events/${eventType}`).json();
  // TODO: compare file reading vs api response performance
  // const events = JSON.parse(readFile(path.resolve(`./server/data/${eventType}.json`), 'utf8'));

  return (
    <div className="main">
      <section className="col sidebar">
        <section className="sidebar-header">
          <strong>{eventType}</strong>
        </section>
        <section className="sidebar-menu" role="menubar">
          <EventsTypeToggle />
          <Suspense fallback={<Spinner />}>
            <VesselsList events={events} />
          </Suspense>
        </section>
      </section>
      <section key={eventType} className="col note-viewer">
        <Suspense fallback={<Spinner />}>
          <EventsMap events={events} eventType={eventType} />
        </Suspense>
      </section>
    </div>
  );
}

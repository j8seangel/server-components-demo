/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {unstable_useTransition} from 'react';

import {useLocation} from './LocationContext.client';

export default function EventsTypeToggle() {
  const [startSearching] = unstable_useTransition(false);
  const [location, setLocation] = useLocation();

  return (
    <button
      onClick={() => {
        startSearching(() => {
          setLocation((loc) => {
            return {
              ...loc,
              eventType:
                loc.eventType === 'encounters' ? 'loitering' : 'encounters',
            };
          });
        });
      }}>
      Switch to{' '}
      {location.eventType === 'encounters' ? 'loitering' : 'encounters'}
    </button>
  );
}

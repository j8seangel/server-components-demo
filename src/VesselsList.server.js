/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Vessel from './Vessel.client';
import {groupBy, orderBy} from 'lodash';

export default function Events({events}) {
  const vesselsNames = events.map((event) => event.vessel.name);
  const vesselsGroupedByName = groupBy(vesselsNames);
  const vesselsList = orderBy(
    Object.keys(vesselsGroupedByName).map((vessel) => {
      return {name: vessel, events: vesselsGroupedByName[vessel].length};
    }),
    'events', 'desc'
  ).slice(0, 30);

  return vesselsList.map((vessel) => <Vessel vessel={vessel} />);
}

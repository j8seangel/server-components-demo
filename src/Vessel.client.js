/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function Vessel({vessel}) {
  return (
    <div>
      {vessel.name} - {vessel.events}
    </div>
  );
}

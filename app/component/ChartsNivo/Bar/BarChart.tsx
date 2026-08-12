import React from 'react'

import { ResponsiveBar } from '@nivo/bar'
import { barFixedProps } from './fixed-props'

export function BarChart({ data, props }: any) {

  return (
    <>
      <ResponsiveBar
        layers={['grid', 'axes', 'bars', 'markers', 'legends']}
        {...barFixedProps}
        {...props}
        data={data}
      />
    </>
  )
}

import React from 'react'

export const ChartToolTip = (data: any, showType: boolean) => {

  return (
    <div
      style={{
        padding: 12,
        background: 'rgb(238 238 238 / 95%)',
        color: 'black'
      }}
    >
      <div>
        {data.data.id} - {data.data.value} hours
      </div>
    </div>
  )
}

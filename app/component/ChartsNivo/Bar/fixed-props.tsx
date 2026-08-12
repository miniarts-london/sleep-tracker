import { ChartToolTip } from './ChartToolTip'

export const barFixedProps = {
  margin: { top: 50, right: 50, bottom: 50, left: 110 },
  padding: 0.3,
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: -15,
    legend: 'Date',
    legendPosition: 'middle',
    legendOffset: 40,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Hours',
    legendPosition: 'middle',
    legendOffset: -40,
  },
  enableLabel: true,
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: {
    from: 'color',
    modifiers: [['darker', 1.6]],
  },
  legends: [],
  valueFormat: (v: number) => Math.round(v * 10) / 10,
  role: 'application',
  tooltip: (d: any) => ChartToolTip(d, true),
}

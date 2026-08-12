import React from 'react'
import { BarChart } from './ChartsNivo/Bar/BarChart'
import { format, parseISO } from 'date-fns'
import { EntryDetail } from '../models/assets'

export function ViewChart({ data }: {data:EntryDetail[]}) {

    const chartData = data?.map((item:any) => {
        return {
            id: format(parseISO(item.date), "dd/MM/yy"),
            value: item.sleep_time,
        }
    })

    const barFixedProps: any = {
        legends: [],
        labelTextColor: {
          from: 'color',
          modifiers: [['darker', 1.6]],
        },
    }
      
    return (
        <>    

            <div className="p-4">
                <div className='grid place-content-center'>
                    <div style={{ width: '700px', height: '400px' }}>
                        {chartData && chartData.length ? (
                            <BarChart
                                data={chartData}
                                props={barFixedProps}
                            />
                            ) : (
                                <div className='p-4'>
                                    Loading ...
                                </div>
                        )}
                    </div>
                </div>
            </div>         
        </>
    )
}
import { BarChart } from './BarChart'
import { render, screen } from '@testing-library/react'

jest.mock('@nivo/bar', () => ({
  ResponsiveBar: (props) => (
    <div data-testid='mock-nivo'>{JSON.stringify(props)}</div>
  ),
}))

describe('BarChart', () => {
  const data = [
    {
      id: 'test 1',
      value: 1992,
    },
    {
      id: 'test 2',
      value: 365,
    },
    {
      id: 'test 3',
      value: 2102,
    },
    {
      id: 'test 4',
      value: 406,
    },
    {
      id: 'test 5',
      value: 1969,
    },
  ]

  test('should render a Bar chart', async () => {
    render(
        <BarChart data={data} props={null} />
    )

    const mockNivo = await screen.findByTestId('mock-nivo')
    expect(mockNivo).toBeInTheDocument()

    expect(await screen.findByText(/Metric 1/i)).toBeInTheDocument()
    expect(await screen.findByText(/1992/i)).toBeInTheDocument()
  })
})

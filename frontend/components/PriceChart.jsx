import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function PriceChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#4f46e5" />
    </LineChart>
  )
}

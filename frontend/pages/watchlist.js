import { useEffect, useState } from 'react'
import api from '../lib/apiClient'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [symbol, setSymbol] = useState('')

  useEffect(() => {
    api.get('/watchlist').then(res => setItems(res.data))
  }, [])

  const add = async () => {
    await api.post('/watchlist', { symbol })
    setItems([...items, { symbol }])
    setSymbol('')
  }

  return (
    <div className="p-6">
      <h1 className="text-xl">Watchlist</h1>
      <input value={symbol} onChange={e=>setSymbol(e.target.value)} />
      <button onClick={add}>Add</button>

      <ul className="mt-4">
        {items.map(i => <li key={i.symbol}>{i.symbol}</li>)}
      </ul>
    </div>
  )
}

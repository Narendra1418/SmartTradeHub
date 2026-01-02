import { useState } from 'react'
import api from '../lib/apiClient'

export default function TradeModal({ onClose }) {
  const [symbol, setSymbol] = useState('')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')
  const [action, setAction] = useState('BUY')
  

  const submit = async () => {
    await api.post('/portfolio/trade', {
      portfolioId: 'default',   // simplify for now
      symbol,
      action,
      quantity: Number(qty),
      price: Number(price)
    })
    onClose()
    window.location.reload()
  }
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded">
        <h2 className="mb-4">Buy Stock</h2>
        <input placeholder="Symbol" onChange={e=>setSymbol(e.target.value)} />
        <input placeholder="Quantity" onChange={e=>setQty(e.target.value)} />
        <input placeholder="Price" onChange={e=>setPrice(e.target.value)} />
        <div className="mt-4">
          <button onClick={submit} className="btn">Buy</button>
          <button onClick={onClose} className="btn ml-2">Cancel</button>
          <select onChange={e=>setAction(e.target.value)}>
            <option>BUY</option>
            <option>SELL</option>
            </select>

        </div>
      </div>
    </div>
  )
}

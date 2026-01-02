import { useState } from 'react'
import axios from 'axios'

export default function PredictionCard() {
  const [result, setResult] = useState(null)

  const predict = async () => {
    const res = await axios.get('http://localhost:8000/predict?symbol=RELIANCE')
    setResult(res.data)
  }

  return (
    <div className="mt-6 p-4 border">
      <button onClick={predict} className="btn">Predict RELIANCE</button>
      {result && (
        <p className="mt-2">
          Signal: <b>{result.signal}</b> ({result.confidence})
        </p>
      )}
    </div>
  )
}

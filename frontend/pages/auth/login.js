import { useState } from 'react'
import api from '../../lib/apiClient'
import { setToken } from '../../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async () => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.token)
    window.location.href = '/dashboard'
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      <input className="input" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="input mt-2" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit} className="btn mt-4">Login</button>
    </div>
  )
}

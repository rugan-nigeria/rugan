import { useState } from 'react'
import api from '../../services/api'

export default function DonateForm() {
  const [form, setForm] = useState({ name: '', email: '', amount: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    await api.post('/donations', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
      <button type="submit">Donate</button>
    </form>
  )
}

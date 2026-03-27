import { useState } from 'react'
import api from '../../services/api'

export default function VolunteerForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    await api.post('/volunteers', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <textarea name="message" placeholder="Why do you want to volunteer?" value={form.message} onChange={handleChange} />
      <button type="submit">Apply</button>
    </form>
  )
}

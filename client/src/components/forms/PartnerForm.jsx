import { useState } from 'react'
import api from '../../services/api'

export default function PartnerForm() {
  const [form, setForm] = useState({ organisation: '', name: '', email: '', message: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    await api.post('/partners', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="organisation" placeholder="Organisation name" value={form.organisation} onChange={handleChange} />
      <input name="name" placeholder="Contact person" value={form.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <textarea name="message" placeholder="Tell us about your organisation" value={form.message} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  )
}

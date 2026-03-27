export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}

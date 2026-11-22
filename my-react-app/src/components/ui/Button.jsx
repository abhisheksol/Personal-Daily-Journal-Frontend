import { LoaderCircle } from 'lucide-react'
export function Button({ children, variant = 'primary', loading, className = '', ...props }) {
  return <button className={`button button-${variant} ${className}`} disabled={loading || props.disabled} {...props}>{loading && <LoaderCircle className="spin" />} {children}</button>
}

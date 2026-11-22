import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { Button } from './Button'
export function Modal({ open, onClose, title, children, confirmLabel = 'Confirm', onConfirm, danger }) {
  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X /></button><h2 id="modal-title">{title}</h2><div className="modal-body">{children}</div><div className="modal-actions"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button></div></motion.div></div>
}

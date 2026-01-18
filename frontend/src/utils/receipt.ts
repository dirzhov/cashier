import jsPDF from 'jspdf'
import type { CashItem } from '../stores/cashbox'

export function generateReceipt(
  items: CashItem[],
  total: number
) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('POS ЧЕК', 105, 15, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Дата: ${new Date().toLocaleString()}`, 10, 25)

  let y = 40

  items.forEach(item => {
    doc.text(
      `${item.name} x${item.qty} — ${item.price * item.qty}`,
      10,
      y
    )
    y += 8
  })

  y += 10
  doc.setFontSize(12)
  doc.text(`ИТОГО: ${total}`, 10, y)

  doc.save(`receipt_${Date.now()}.pdf`)
}

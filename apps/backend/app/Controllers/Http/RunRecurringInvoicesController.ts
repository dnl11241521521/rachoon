import Document from 'App/Models/Document'
import RecurringInvoice from 'App/Models/RecurringInvoice'
import DocumentService from 'App/Services/Document'
import parser from 'cron-parser'
import { DateTime } from 'luxon'

export default class RunRecurringInvoicesController {
  public async index({ response }) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const recurrings = await RecurringInvoice.query()
      .where('startDate', '<=', today)
      .andWhere('nextRun', '<=', today)
      .andWhere('active', true)
      .preload('invoice')

    if (recurrings.length === 0) {
      response.json({ message: 'No recurring invoices to process' })
    }

    for (const recurring of recurrings) {
      const cron = parser.parse(recurring.cron)
      const cronDate = cron.next().toDate()
      cronDate.setHours(0, 0, 0, 0)

      const existing = await Document.query()
        .where('createdAt', '>=', new Date(recurring.nextRun.toString()))
        .andWhere('id', recurring.invoiceId)
        .andWhereNotNull('recurring_id')
        .first()

      if (existing) continue
      await DocumentService.duplicate(recurring.invoiceId, recurring.organizationId, recurring.id)
      recurring.nextRun = DateTime.fromISO(cronDate.toISOString())

      await recurring.save()
    }
  }
}

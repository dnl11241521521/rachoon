import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from 'App/Models/Document'
import { DocumentStatus, DocumentType } from '@repo/common'

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    const pendingInvoices = await Document.query()
      .where({
        type: DocumentType.Invoice,
        status: DocumentStatus.Pending,
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderByRaw(`data->>'dueDate' asc`)

      .limit(5)

    const pendingOffers = await Document.query()
      .where({
        type: DocumentType.Offer,
        status: DocumentStatus.Pending,
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderByRaw(`data->>'dueDate' asc`)
      .limit(5)

    const pendingReminders = await Document.query()
      .where({
        type: DocumentType.Reminder,
        status: DocumentStatus.Pending,
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderByRaw(`data->>'dueDate' asc`)

    const invoiceAmounts = await Document.query()
      .where({
        type: DocumentType.Invoice,
        organizationId: ctx.auth.user?.organization.id,
        status: DocumentStatus.Paid,
      })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    const offerAmounts = await Document.query()
      .where({
        type: DocumentType.Offer,
        organizationId: ctx.auth.user?.organization.id,
        status: DocumentStatus.Accepted,
      })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    const reminderAmounts = await Document.query()
      .where({
        type: DocumentType.Reminder,
        organizationId: ctx.auth.user?.organization.id,
        status: DocumentStatus.Pending,
      })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    return {
      invoices: {
        net: invoiceAmounts?.$extras.net,
        total: invoiceAmounts?.$extras.total,
        pending: pendingInvoices,
      },
      reminders: {
        pending: pendingReminders,
        total: reminderAmounts?.$extras.total,
        net: reminderAmounts?.$extras.net,
      },

      offers: {
        net: offerAmounts?.$extras.net,
        total: offerAmounts?.$extras.total,
        pending: pendingOffers,
      },
    }
  }
}

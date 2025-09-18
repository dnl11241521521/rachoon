import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceOrOffer from 'App/Models/InvoiceOrOffer'

export default class DashboardController {
  public async index(ctx: HttpContextContract) {
    const pendingInvoices = await InvoiceOrOffer.query()
      .where({
        type: 'invoice',
        status: 'pending',
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')

    const pendingOffers = await InvoiceOrOffer.query()
      .where({
        type: 'offer',
        status: 'pending',
        organizationId: ctx.auth.user?.organization.id,
      })
      .preload('client')
      .preload('offer')
      .preload('invoices')
      .orderBy('created_at', 'desc')

    const invoiceAmounts = await InvoiceOrOffer.query()
      .where({ type: 'invoice', organizationId: ctx.auth.user?.organization.id, status: 'paid' })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    const offerAmounts = await InvoiceOrOffer.query()
      .where({ type: 'offer', organizationId: ctx.auth.user?.organization.id, status: 'accepted' })
      .select(Database.raw(`sum((data->>'total')::float) as total`))
      .select(Database.raw(`sum((data->>'net')::float) as net`))
      .first()

    return {
      invoices: {
        net: invoiceAmounts?.$extras.net,
        total: invoiceAmounts?.$extras.total,
        pending: pendingInvoices,
      },
      offers: {
        net: offerAmounts?.$extras.net,
        total: offerAmounts?.$extras.total,
        pending: pendingOffers,
      },
    }
  }
}

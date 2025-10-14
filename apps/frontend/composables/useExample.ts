import { Example, Format } from "@repo/common";
import { DocumentType } from "@repo/common";

export default defineStore("example", () => {
  async function preview(templateId: string = "") {
    const invoice = Example.get(DocumentType.Invoice);
    const offer = Example.get(DocumentType.Offer);
    const reminder = Example.get(DocumentType.Reminder);
    invoice.number = Format.number(useSettings().settings.invoices.number, 0);
    offer.number = Format.number(useSettings().settings.offers.number, 0);
    reminder.number = Format.number(useSettings().settings.reminders.number, 0);


    const [invoicePreview, offerPreview, reminderPreview] = await Promise.all([
      useRender(invoice, true, templateId),
      useRender(offer, true, templateId),
      useRender(reminder, true, templateId),
    ]);

    return [...invoicePreview, ...offerPreview, ...reminderPreview];
  }

  return { preview };
});

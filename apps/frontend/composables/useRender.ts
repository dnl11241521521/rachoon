import nunjucks from "nunjucks";
import ioTemplates from "@/templates/invoiceOrOffer";

export default async function useRender(object: any, preview: boolean = false): Promise<string | string[]> {
  const t = (key: string, ...val: any): string => {
    return useLocale.t(key, val);
  };

  let tpl = "default";

  if (object.templateId) {
    tpl = object.templateId;
  }

  const template = await useTemplate().get(tpl);
  const html = template.html || ioTemplates.default;
  const final = nunjucks.renderString(html, {
    object: object,
    template: template,
    organization: useProfile().me.organization,
    user: useProfile().me,
    t: t,
    format: {
      currency: useFormat.toCurrency,
      date: useFormat.date,
      duration: useFormat.minutesToHM,
    },
  });

  return await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
    templateId: template.id,
    data: object,
  });
}

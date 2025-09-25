export default async function useRender(object: any, preview: boolean = false): Promise<string | string[]> {
  let tpl = "default";

  if (object.templateId) {
    tpl = object.templateId;
  }

  const template = await useTemplate().get(tpl);

  return await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
    templateId: template.id,
    data: object,
  });
}

export default async function useRender(object: any, preview: boolean = false): Promise<string | string[]> {
  let tpl = "";
  console.log(object.templateId);

  if (object.templateId) {
    tpl = object.templateId;
  }
  let template = useTemplate().defaultTemplate;
  if (tpl && tpl !== "null") {
    template = await useTemplate().get(tpl);
  }

  return (
    await useHttp.post(`/api/render${preview ? "?preview=true" : ""}`, {
      templateId: template.id,
      data: object,
    })
  ).body;
}

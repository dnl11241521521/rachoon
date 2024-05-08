import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HtmlRenderer from 'App/Services/HtmlRenderer'

export default class RenderController {
  public async store(ctx: HttpContextContract) {
    const data: any = ctx.request.body()

    const template = data.html

    const preview = ctx.request.qs()['preview'] || false

    const renderer = new HtmlRenderer()
    return await renderer.renderFromHtml(template, preview)
  }
}

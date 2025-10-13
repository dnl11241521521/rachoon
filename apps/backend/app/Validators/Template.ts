import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TemplateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string(),
    data: schema.object().members({
      colors: schema.object().anyMembers(),
      texts: schema.object().members({
        beforeTable: schema.string.optional({}),
        afterTable: schema.string.optional(),
      }),
      columns: schema.object().members({
        first: schema.string.optional(),
        second: schema.string.optional(),
        third: schema.string.optional(),
        fourth: schema.string.optional(),
      }),
    }),
    html: schema.string.optional(),
    default: schema.boolean(),
    premium: schema.boolean(),
  })

  public messages: CustomMessages = {}
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JsonError {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    await next()
    const code = response.response.statusCode
    const body = response.getBody()
    if (code >= 400) {
      response.json({
        error: body,
        code: code,
      })
    }
  }
}

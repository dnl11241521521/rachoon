import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PaginationHeaders {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
    const body = response.lazyBody

    if (body[0]['firstPage'] && body[0]['rows'] && body[0]['total']) {
      response.header('X-Total', body[0]['total'])
      response.header('X-Pages', body[0]['lastPage'])
      response.header('X-Page', body[0]['currentPage'])
      response.header('X-Per-Page', body[0]['perPage'])
      response.json(body[0]['rows'])
    }
  }
}

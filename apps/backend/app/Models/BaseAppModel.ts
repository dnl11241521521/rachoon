import { BaseModel, scope } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BaseAppModel extends compose(BaseModel, SoftDeletes) {
  public page = 1
  public perPage = 20

  private static fieldInColumns(field: string, columns: Map<string, any>): boolean {
    if (columns.get(field)) {
      return true
    }
    for (const [_, value] of columns.entries()) {
      if (value['columnName'] === field) {
        return true
      }
    }
    return false
  }

  public static sortBy = scope((query, ctx: HttpContextContract, columns: Map<string, any>) =>
    query.if(
      ctx.request.qs()['sort'],
      (query) => {
        //TODO: throw validation errors
        const sort = ctx.request.qs()['sort']
        if (typeof sort !== 'object') return
        for (const field in sort) {
          if (!this.fieldInColumns(field, columns)) continue
          let order = sort[field]
          if (!order || !['asc', 'desc'].includes(order.toLowerCase())) {
            order = 'asc'
          }
          query.orderBy(field, order)
        }
      },
      //default sort
      (query) => query.orderBy('createdAt', 'desc')
    )
  )

  public static filterBy = scope((query, ctx: HttpContextContract, columns: Map<string, any>) =>
    query.if(ctx.request.qs()['filter'], (query) => {
      //TODO: throw validation errors
      const filter = ctx.request.qs()['filter']
      if (typeof filter !== 'object') return
      console.log(filter)
      for (const field in filter) {
        const f = filter[field]
        if (typeof f !== 'object') continue
        if (!this.fieldInColumns(field, columns)) continue
        const op = Object.keys(f)[0]
        let value = f[op]
        if (!['=', '!=', '<', '<=', '>', '>=', 'like', 'in', 'not in'].includes(op)) continue
        if (!value) continue
        if (op === 'like' && !value.includes('%')) {
          value = `%${value}%`
        }
        query.where(field, op, value)
      }
    })
  )
}

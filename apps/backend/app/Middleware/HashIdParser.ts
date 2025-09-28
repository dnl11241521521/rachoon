import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HashIDs from '../Helpers/hashids'
import _ from 'lodash'

export default class HashIdParser {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    request.updateBody(this.traverse(request.body()))
    const p = request.params()
    const q = request.qs()
    Object.keys(p).forEach((k) => {
      if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
        p[k] = HashIDs.decode(p[k])
      }
    })
    Object.keys(q).forEach((k) => {
      if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
        q[k] = HashIDs.decode(q[k])
      }
    })
    if (q.filter) {
      Object.keys(q.filter).forEach((k) => {
        if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
          Object.keys(q.filter[k]).forEach((v) => {
            const nv = v.replace('%3D', '=')
            q.filter[k][nv] = HashIDs.decode(q.filter[k][v])
            if (nv !== v) {
              delete q.filter[k][v]
            }
          })
        }
      })
    }
    await next()
  }

  protected traverse(object: any) {
    const keys = Object.keys(object)

    keys.forEach((k) => {
      if (_.isObject(object[k])) {
        object[k] = this.traverse(object[k])
      } else {
        if ((k.endsWith('Id') || k === 'id') && _.isString(object[k])) {
          object[k] = HashIDs.decode(object[k])
        }
      }
    })
    return object
  }
}

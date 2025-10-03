import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HashIDs from '../Helpers/hashids'
import _ from 'lodash'

export default class HashIdParser {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    request.updateBody(this.traverse(request.body()))
    const p = request.params()
    const q = request.qs()
    const errors: string[] = []
    Object.keys(p).forEach((k) => {
      if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
        const hash = HashIDs.decode(p[k])
        if (!hash) {
          errors.push(`Parameter ${k} is not a valid ID`)
        }
        p[k] = HashIDs.decode(p[k])
      }
    })
    Object.keys(q).forEach((k) => {
      if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
        const hash = HashIDs.decode(q[k])
        if (!hash) {
          errors.push(`Query parameter ${k} is not a valid ID`)
        }
        q[k] = hash
      }
    })
    if (q.filter) {
      Object.keys(q.filter).forEach((k) => {
        if (k.endsWith('Id') || k.endsWith('_id') || k === 'id') {
          Object.keys(q.filter[k]).forEach((v) => {
            const nv = v.replace('%3D', '=')
            const hash = HashIDs.decode(q.filter[k][v])
            if (!hash) {
              errors.push(`Filter parameter ${q.filter[k]} is not a valid ID`)
            }
            q.filter[k][nv] = hash
            if (nv !== v) {
              delete q.filter[k][v]
            }
          })
        }
      })
    }
    if (errors.length > 0) {
      return response.status(400).send({ errors })
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

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'
import HashIDs from './hashids'

export default class OrganizationHelper {
  public static async getFromContext(ctx: HttpContextContract) {
    const fromOrigin = await this.getFromOrigin(ctx)
    const fromHeader = await this.getFromHeader(ctx)
    const fromParam = await this.getFromParam(ctx)

    if (fromParam === false) {
      return null
    }

    if (!process.env.CLOUD && !fromOrigin && !fromHeader) {
      const organization = await Organization.query().orderBy('createdAt', 'asc').firstOrFail()
      return {
        slug: organization.slug,
        name: organization.name,
        id: HashIDs.encode(organization.id),
        logo: organization.data.logo,
      }
    }

    return fromOrigin || fromHeader || fromParam
  }

  public static async getFromParam(ctx: HttpContextContract) {
    const slug = ctx.request.qs()['slug']

    if (!slug) {
      return null
    }
    const organization = await Organization.query().where({ slug: slug }).first()
    if (organization) {
      return {
        slug: slug,
        name: organization.name,
        id: HashIDs.encode(organization.id),
        logo: organization.data.logo,
      }
    }
    return false
  }

  public static async getFromHeader(ctx: HttpContextContract) {
    const slug = ctx.request.header('organization-slug')
    if (!slug) {
      return null
    }
    const organization = await Organization.query().where({ slug: slug }).first()
    if (organization) {
      return {
        slug: slug,
        name: organization.name,
        id: HashIDs.encode(organization.id),
        logo: organization.data.logo,
      }
    }
  }
  public static async getFromOrigin(ctx: HttpContextContract) {
    const getURIParts = (url) => {
      const matches = url.match(/^(\w+?:\/\/)?([\w-\.]+(?=\/?))?:?(\d*)?([^:]*)/)
      return matches
        ? {
            scheme: matches[1],
            host: matches[2],
            port: matches[3],
            pathname: matches[4],
          }
        : {
            scheme: 'https://',
            host: 'rachoon.work',
            port: '',
            pathname: '',
          }
    }

    const ref = ctx.request.header('origin') || ctx.request.header('host')
    if (!ref) {
      return null
    }

    const { host } = getURIParts(ref)
    const slug = host.split('.')[0]
    const organization = await Organization.query().where({ slug: slug }).first()
    if (!organization) {
      return null
    }
    return {
      slug: slug,
      name: organization.name,
      id: HashIDs.encode(organization.id),
      logo: organization.data.logo,
    }
  }
}

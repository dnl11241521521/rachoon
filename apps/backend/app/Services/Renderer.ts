import { PDFiumLibrary, PDFiumPageRenderOptions } from '@hyzyla/pdfium'
import { DocumentType, Locale } from '@repo/common'
import { Document as CommonDocument } from '@repo/common'
import Template from 'App/Models/Template'
import User from 'App/Models/User'
import { chromium } from 'playwright'
import sharp from 'sharp'
import nunjucks from 'nunjucks'
import { Format } from '@repo/common'

export default class Renderer {
  private static async renderFunction(
    options: PDFiumPageRenderOptions,
    downScaleFactor: number = 1
  ) {
    return await sharp(options.data, {
      raw: {
        width: options.width,
        height: options.height,
        channels: 4,
      },
    })
      .resize(
        Math.floor(options.width / downScaleFactor),
        Math.floor(options.height / downScaleFactor)
      )
      .png()
      .toBuffer()
  }

  public static prepareHtml(user: User, template: Template, data: any): string {
    const org = user.organization

    const loc = org.settings.general.locale
    const cur = org.settings.general.currency

    const t = (key: string, ...val: any): string => {
      return Locale.t(loc, key, val)
    }

    const currency = (value: any): string => Format.toCurrency(value, loc, cur)

    const date = (value: any): string => Format.date(new Date(value), loc)

    const longDate = (value: any): string => Format.longDate(new Date(value), loc)

    return nunjucks.renderString(template.html, {
      document: new CommonDocument(data),
      template: template,
      organization: org,
      user: user,
      t: t,
      format: {
        currency: currency,
        date: date,
        longDate: longDate,
      },
    })
  }

  public static async generatePDFOrImage(
    html: string,
    isImage: boolean = false,
    downScaleFactor: number = 1
  ): Promise<string[]> {
    const { browser, page } = await this.getBrowserAndPage()

    await page.setContent(html)
    await page.evaluateHandle('document.fonts.ready')

    const pdfOptions = {
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
    }
    try {
      const pdf = await page.pdf(pdfOptions)
      const buffer = Buffer.from(pdf)

      if (isImage) {
        const library = await PDFiumLibrary.init()
        const doc = await library.loadDocument(buffer)
        const images: any = []
        for (const page of doc.pages()) {
          const p = await page.render({
            scale: 3,
            render: (options) => this.renderFunction(options, downScaleFactor),
          })
          images.push('data:image/png;base64' + ',' + Buffer.from(p.data).toString('base64'))
        }
        return images
      }

      return ['data:application/pdf;base64,' + buffer.toString('base64')]
    } catch (e) {
      console.error(e)
    } finally {
      await browser.close()
    }
    return []
  }

  /**
   *
   * @param path The file path to save the PDF to. If path is a relative path, then it is resolved relative to current
   * working directory. If no path is provided, the PDF won't be saved to the disk.
   */
  public static async renderFromHtmlToFile(html: string, path: string) {
    const { browser, page } = await this.getBrowserAndPage()

    await page.setContent(html, {})

    const pdfOptions = {
      format: 'A4',
    }
    await page.pdf({
      ...pdfOptions,
      path,
    })
    await browser.close()
  }

  private static async getBrowserAndPage() {
    const minimalArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ]
    const browser = await chromium.launch({
      args: minimalArgs,
      executablePath: '/usr/bin/chromium-browser',
    })
    const page = await browser.newPage()

    return { browser, page }
  }
}

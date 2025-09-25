import * as dateFnsLocale from "date-fns/locale";
import * as dateFns from "date-fns";

export default class Format {
  static toCurrency(value: any, locale: string, currency: string) {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    });

    return formatter.format(Number(value));
  }

  static date(value: any, locale: string) {
    const loc = dateFnsLocale[locale || "enUS"];
    return dateFns.format(Date.parse(value), "P", { locale: loc });
    // const formatter = new Intl.DateTimeFormat(useSettings().settings.general.locale)
    // return formatter.format(Date.parse(value))
  }

  static longDate(value: any, locale: string) {
    const loc = dateFnsLocale[locale || "enUS"];
    return dateFns.format(Date.parse(value), "PPPP", { locale: loc });
  }

  static max100(val: string) {
    if (Number(val) > 100) val = "100";
    return val;
  }
}

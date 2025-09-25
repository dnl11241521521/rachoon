import * as locale from "date-fns/locale";
import * as dateFns from "date-fns";

function toCurrency(value: any) {
  const formatter = new Intl.NumberFormat(useSettings().settings.general.locale, {
    style: "currency",
    currency: useSettings().settings.general.currency,
  });

  return formatter.format(Number(value));
}

function getLocale() {
  const s = useProfile().me.organization.settings.general.locale.split("-");

  return s.length > 1 ? `${s[0]}${s[1].toUpperCase()}` : s[0];
}

function date(value: any) {
  const loc = locale[getLocale() || "enUS"];
  return dateFns.format(Date.parse(value), "P", { locale: loc });
  // const formatter = new Intl.DateTimeFormat(useSettings().settings.general.locale)
  // return formatter.format(Date.parse(value))
}

function longDate(value: any) {
  const loc = locale[getLocale() || "enUS"];
  return dateFns.format(Date.parse(value), "PPPP", { locale: loc });
}

function max100(val: string) {
  if (Number(val) > 100) val = "100";
  return val;
}

function durationToHM(val: string) {
  const split = val.split(":");
  const h = split[0];
  const m = split[1];
  return `${h.padStart(2, "0")}h:${m.padStart(2, "0")}m`;
}

function minutesToHM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}m`;
}

export default {
  toCurrency,
  date,
  longDate,
  max100,
  durationToHM,
  minutesToHM,
};

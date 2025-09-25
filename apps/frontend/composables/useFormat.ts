import * as locale from "date-fns/locale";
import * as dateFns from "date-fns";
import Format from "@repo/common/Format";

function toCurrency(value: any) {
  return Format.toCurrency(
    value,
    useProfile().me.organization.settings.general.locale,
    useProfile().me.organization.settings.general.currency,
  );
}

function getLocale() {
  const s = useProfile().me.organization.settings.general.locale.split("-");

  return s.length > 1 ? `${s[0]}${s[1].toUpperCase()}` : s[0];
}

function date(value: any) {
  return Format.date(value, useProfile().me.organization.settings.general.locale);
}

function longDate(value: any) {
  return Format.longDate(value, useProfile().me.organization.settings.general.locale);
}

function max100(val: string) {
  if (Number(val) > 100) val = "100";
  return val;
}

export default {
  toCurrency,
  date,
  longDate,
  max100,
};

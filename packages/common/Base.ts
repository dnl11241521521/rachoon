import _ from "lodash";
export interface IBase {
  errors: () => string[];
}
export class Base<T> {
  public constructor(json?: T) {
    if (json) {
      _.merge(this, json);
    }
  }
}

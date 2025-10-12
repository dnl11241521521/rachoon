import _ from "lodash";

export default class Helpers {
  static merge<T>(defaultObj: T, remoteObj: T): T {
    const result = defaultObj as T;

    // Override with remote values that are not empty
    const allKeys = new Set([
      ...Object.keys(defaultObj || {}),
      ...Object.keys(remoteObj || {}),
    ]);

    allKeys.forEach((key: any) => {
      const val1 = defaultObj?.[key];
      const val2 = remoteObj?.[key];

      // Check if values are "empty" (null, undefined, empty string, empty array, empty object)
      const isEmpty1 = this.isEmptyValue(val1);
      const isEmpty2 = this.isEmptyValue(val2);

      // If both are empty, use undefined
      if (isEmpty1 && isEmpty2) {
        result[key] = val1; // or val2, doesn't matter
      }
      // If only val1 is empty, use val2
      else if (isEmpty1) {
        result[key] = val2;
      }
      // If only val2 is empty, use val1
      else if (isEmpty2) {
        result[key] = val1;
      }
      // If neither is empty, prefer val2 (second object takes precedence)
      else {
        result[key] = val2;
      }
    });
    return result;
  }

  static isEmptyValue(value: any) {
    if (value === null || value === undefined) {
      return true;
    }

    if (value === "") {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return true;
    }

    if (typeof value === "function") {
      return false;
    }

    return false;
  }
}

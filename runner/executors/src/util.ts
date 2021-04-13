
/**
 * Custom ERROR serializer that will convert errors to JSON friendly errors
 */

const ErrorSerializer = (obj: any) => Object.defineProperty(obj, 'toJSON', {
  value: function () {
    let alt = {};
    Object.getOwnPropertyNames(this).forEach(function (key) {
      alt[key] = this[key];
    }, this);

    return alt;
  },
  configurable: true,
  writable: true
});

if (!('toJSON' in Error.prototype)) {
  ErrorSerializer(Error.prototype)
}

/**
 *
 * @param obj the object to sanitize
 */
function sanitize(obj: any | null): void {
  if (obj == null || obj == undefined) {
    return
  }

  // prevent circular dependenices
  delete obj["__parent__"]
  delete obj["__path__"]

  const keys = Object.getOwnPropertyNames(obj)

  for (const key in keys) {
    const name = keys[key]
    if (obj[name] && typeof obj[name] === "object") {
      sanitize(obj[name])
    }
  }
}

export default class Utils {
  static ErrorSerializer = (obj:any) => ErrorSerializer(obj)

  static toJson = (obj: unknown): string => {
    const clone = Object.assign({}, obj) // same as clone = {...obj};
    sanitize(clone)
    return JSON.stringify(
      clone,
      function replacer(key, value) {
        return value
      },
      "\t"
    )
  }
}





// /**
//  * Convert object to string
//  * https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
//  *
//  * @param obj
//  */
// const toJson = (obj: unknown): string => {
//     return JSON.stringify(obj, function replacer(key, value) {
//         return value
//     }

//     , '\t')
// };

// export { toJson }

export { Utils }

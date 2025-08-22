import fs from "node:fs";
import path from "node:path";
/**
 * 生成 root/utils.ts
 */
export default function generateRootUtilsFile(rootFolderPath) {
    const filePath = path.resolve(rootFolderPath, `utils.ts`);
    if (!fs.existsSync(filePath)) {
        const relativePath = filePath.split(path.sep).slice(-2).join(path.sep);
        console.log(`\x1b[41mNeed Modify\x1b[0m \x1b[32m${relativePath}\x1b[0m need confirm. please fix/confirm \x1b[43m todo \x1b[0m part`);
        fs.writeFileSync(filePath, utilsTsTemplate);
    }
}
export const utilsTsTemplate = `/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
// 修正下面带有todo注释的代码

// todo
type RequestPartOptions = Parameters<typeof request>[1];

type RequestInterceptor = <T>(params: T, cfg?: RequestPartOptions) => [T, RequestPartOptions?];

type ResponseInterceptor = <T, K>(res: T, params: K, cfg?: RequestPartOptions) => T;

const defaultReqInterceptor: RequestInterceptor = (params, options) => [params, options]
const identity = <T>(t: T) => t;

export default function defineAPIHOC(urlPrefix: string, interceptors?: Interceptors<any>) {
  return function defineAPI<Params, Response>(url: string, method: HTTPMethod, helper?: APIHelper) {
    const divider = parameterDividerHOC(url, method, helper?.divider);
    const { requestInterceptor = defaultReqInterceptor, responseInterceptor = identity } = interceptors?.get(\`\${method} \${url}\`) ?? {};
    // the return type is a trick, this can make callAPI get a correct type
    return (iParams: Params, iOptions?: RequestPartOptions) => {
      const [params, options] = requestInterceptor(iParams, iOptions);
      const { url: queryUrl, opt: dataPartOptions } = divider(params);
      // todo 按工程实际情况修正所要使用的请求方法
      const reqConfig = {
        url: \`\${urlPrefix}\${queryUrl}\`,
        method,
        ...dataPartOptions,
        ...options
      };
      return request(reqConfig)
        .then(res => {
          const modifiedRes = responseInterceptor(res, params, options);
          return modifiedRes;
        }) as Response
    }
  }
}



export class Interceptors<Group extends Record<any, [any, any]>> {
  private requestObserverMap: Map<keyof Group, RequestInterceptor> = new Map();
  private responseObserverMap: Map<keyof Group, ResponseInterceptor> = new Map();

  public add<IPath extends keyof Group>(key: IPath,
    requestInterceptor?: RequestInterceptor,
    responseInterceptor?: ResponseInterceptor,
  ) {
    if(this.requestObserverMap.has(key)) {
      console.warn(\`Request Interceptors: \${key as string} is exist\`);
    }
    requestInterceptor && this.requestObserverMap.set(key, requestInterceptor);
    if(this.responseObserverMap.has(key)) {
      console.warn(\`Response Interceptors: \${key as string} is exist\`);
    }
    responseInterceptor && this.responseObserverMap.set(key, responseInterceptor);
    return this;
  }

  public get(key: keyof Group) {
    return {
      requestInterceptor: this.requestObserverMap.get(key),
      responseInterceptor: this.responseObserverMap.get(key),
    }
  }
}

type APIHelper = {
  divider?: { path?: string[], query?: string[], body?: string[], formData?: string[] }
}

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function parameterDividerHOC(url: string, httpMethod: HTTPMethod, divider: APIHelper['divider']) {
  const sorterMap = Object.entries(divider || {}).reduce((acc, [key, value]) => {
    value.forEach((v) => {
      acc[v] = key;
    });
    return acc;
  }, {} as Record<string, string>);

  const defaultParameterStoreKey = httpMethod === 'GET' ? 'query' : 'body';

  return function divider(parameters?: Record<string, any> | Array<any>) {
    if (!parameters) {
      return { url };
    }
    if (Array.isArray(parameters)) {
      return { url, opt: { data: parameters } };
    }
    let queryUrl = url;
    const sortedStore: Record<string, any> = {};
    for (const key in parameters) {
      if (parameters[key] === undefined || parameters[key] === null) {
        continue;
      }
      const storeKey = sorterMap[key] ?? defaultParameterStoreKey;
      const value = parameters[key];

      if (storeKey === 'path') {
        queryUrl = queryUrl.replace(\`{\${key}}\`, value as string);
        continue;
      }
      if (!sortedStore[storeKey]) {
        sortedStore[storeKey] = storeKey === 'formData' ? new FormData() : {};
      }
      if (storeKey === 'formData') {
        (sortedStore[storeKey] as FormData).append(key, value as string | Blob);
      } else {
        sortedStore[storeKey][key] = value;
      }
    }
    const output: Record<string, any> = {};
    if (sortedStore.query) {
      output.params = sortedStore.query;
    }
    if (sortedStore.body) {
      output.data = sortedStore.body;
    }
    if (sortedStore.formData) {
      output.data = sortedStore.formData;
    }
    if (!sortedStore.body && !sortedStore.formData && httpMethod !== 'GET') {
      output.data = {};
    }
    return { url: queryUrl, opt: output };
  }

}
`;

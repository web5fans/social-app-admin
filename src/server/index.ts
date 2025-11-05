import dao from './dao'
import { defineDAOAPI } from "@/server/dao/defineAPI.ts";


const server = {
  dao,
}

export default server;

export function proxyRequest(
  url: string,
  params: Record<string, any> = {},
) {
  return defineDAOAPI(url, 'POST')(
    params,
    {
      getWholeBizData: true,
      useBiz: false,
      useAuth: false
    },
  )
}
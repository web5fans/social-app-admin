import { create } from 'zustand'
import createSelectors from '@/store/helper/createSelectors'
import server from '@/server'
import throttle from 'lodash/throttle'


interface TemplateStore {
  templates?: APIDao.WebEndpointsAdminTemplateAdminTemplateIdVo | null
  fetchTemplate: ReturnType<typeof throttle<() => Promise<void>>>
}

const useGetTemplate = createSelectors(
  create<TemplateStore>((set, get) => ({


    fetchTemplate: throttle(async () => {
      const templates = await server.dao('POST /admin/template/get');
      set(() => ({ templates }))
    }, 1000, { leading: true, trailing: false }),

  })),
)

export default useGetTemplate

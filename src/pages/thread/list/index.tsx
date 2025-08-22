import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import { Badge, Flex, message, Popconfirm, Typography } from 'antd'
import PostDetailDrawer from "./PostDetailDrawer.tsx";
import server, { proxyRequest } from "@/server";
import InitiatorAvatar from "@/pages/thread/proposal/InitiatorAvatar.tsx";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { getPostNameList, getPostTag } from "./utils.ts";
import S from './index.module.less'
import { ActionType } from "@ant-design/pro-table/es/typing";

const { Link } = Typography;

const tagValueEnum = {
  1: '任务',
  2: '商品',
  3: '活动'
}

const PostList = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }
  const [options, setOptions] = useState([]);

  const searchUser = async (words: string) => {
    const keyWords = words.trim()
    if (!keyWords) {
      setOptions([]);
      return
    }
    const result = await server.dao('POST /admin/user-manage/user/search-by-name', {
      nickName: keyWords
    })

    const options = result?.map((res) => ({
      label: <InitiatorAvatar avatar={res.avatar} name={res.nickName || res.domainName} />, value: res.did
    }))

    setOptions(options)
  }

  const takeOff = async (post: any) => {
    await server.dao('POST /admin/post/take-off-post', {
      uri: post.uri,
      cid: post.cid
    })
    message.success('下架成功')
    reload()
  }

  const columns = [
    proColumn('名称', 'key', { width: 328 })
      ._enableSearch()
      ._render((_, post) => {
        const list = getPostNameList(post)

        return <div className={'truncate'} style={{width: 328}}>
          {list.map(l => {
            if (l === '[图片]') return <span style={{color: '#6F869F'}}>{l}</span>
            return l
          })}
        </div>
      }),
    proColumn('发布方', 'repo', { width: 226 })
      ._enableSearch()
      ._extend({
        valueType: 'select',
        fieldProps: {
          showSearch: true,
          filterOption: false,
          onSearch: debounce(searchUser, 300),
          options: options,
        }
      })
      ._render((_, record) => {
        const author = record.author
        return <InitiatorAvatar avatar={author.avatar} name={author.displayName || author.handle} />
      }),
    proColumn('标签', 'tag', { width: 160 })
      ._enableSearch()
      ._valueEnum(tagValueEnum)
      ._extend({
        search: {
          transform: (value: number) => {
            return {
              tag: `#${tagValueEnum[value]}`
            }
          }
        }
      })
      ._render((_, record) => {
        const tags = getPostTag(record.record)
        if (!tags || tags.length === 0) return '-'
        return <div className={'flex items-center gap-[3px]'}>
          {tags.map(i => <span className={S.postTag}>{i}</span>)}
        </div>
      }),
    proColumn('上下架', 'onShelf', { width: 100 })
      ._render((_, post) => {
        return !post.is_banned ? <Badge status="success" text="已上架" /> : <Badge status="error" text="已下架" />
      }),
    proColumn('发布时间', 'indexed_at', { width: 226 })
      ._enableSearch()
      ._extend({
        valueType: 'dateRange',
        search: {
          transform: (value: any) => {
            const format = 'YYYY-MM-DD HH:mm:ss'
            return {
              indexed_at: [
                dayjs(value[0]).startOf('day').format(format),
                dayjs(value[1]).endOf('day').format(format)
              ]
            }
          }
        }
      })
      ._render((_, record) => {
        return dayjs(record.indexedAt).format('YYYY/MM/DD HH:mm:ss')
      }),
    proColumn('操作', '', { width: 226 })
      ._option()
      ._render((_, post) => {
        return <Flex gap={10}>
          <PostDetailDrawer post={post} takeOff={() => takeOff(post)} />
          {!post.is_banned && <Popconfirm title={'确定下架该帖子吗？'} onConfirm={() => takeOff(post)}>
            <Link>下架</Link>
          </Popconfirm>}
        </Flex>
      })
  ]

  return <Page title={'帖子'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'帖子列表'}
      columns={columns}
      options={false}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 'auto'
      }}
      request={async (params) => {
        console.log('params', params)
        const result = await proxyRequest('/api/posts/list', {
          ...params,
          per_page: 10,
          page: params.current,
          ban_labels: ['blacklist']
        })
        return {
          data: result.posts,
          total: result.total,
          success: true
        }
      }}
      pagination={{
        showTotal: false,
        pageSize: 10,
        showSizeChanger: false,
      }}
    />
  </Page>
}

export default PostList;
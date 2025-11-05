const postTags = ['任务','商品','活动']

export const getPostTag = (postRecord: Record<string, any>): string[]  => {
  if (!postRecord.facets) return []
  const allFeatures = postRecord.facets.reduce((acc, cur) => {
    const features = cur.features.filter(f => f.$type === "app.bsky.richtext.facet#tag")

    return acc.concat(features)
  }, [])

  const tags = allFeatures.filter(f => postTags.includes(f.tag)).map(f => f.tag)

  return tags
}

export const getPostNameList = (post: Record<string, any> = {}) => {
  const postTextArray = [post.record.text]

  if (post.embed && post.embed.$type === "app.bsky.embed.images#view") {
    const images = post.embed.images
    images.forEach(() => postTextArray.push('[图片]'))
  }
  if (post.embed && post.embed.$type === "app.bsky.embed.recordWithMedia#view") {
    const images = post.embed.media.images || []
    images.forEach(() => postTextArray.push('[图片]'))
  }

  return postTextArray
}
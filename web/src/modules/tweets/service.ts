import { Tweet, TweetJSONSchema } from './types'
import axios from '../../utils/axios'
import { ResponseItems } from '../../types'

function parseResponseTweetItem(data: TweetJSONSchema): Tweet {
  const repliedTo = data.replied_to
    ? {
        id: data.replied_to.id,
        content: data.replied_to.content,
        authorName: data.replied_to.author_name,
        authorHandle: data.replied_to.author_handle,
        authorPhotoURL: data.replied_to.author_photo_url,
        favoritesCount: data.replied_to.favorites_count,
        repliesCount: data.replied_to.replies_count,
        alreadyLiked: data.replied_to.already_liked,
      }
    : undefined
  return {
    authorHandle: data.author_handle,
    authorName: data.author_name,
    authorPhotoURL: data.author_photo_url,
    repliedTo,
    favoritesCount: data.favorites_count,
    repliesCount: data.replies_count,
    createdAt: data.created_at,
    alreadyLiked: data.already_liked,
    isReply: data.is_reply,
    ...data,
  }
}

export async function fetchTweet(tweetId: string): Promise<Tweet> {
  try {
    const { data } = await axios.get<TweetJSONSchema>(`/tweets/${tweetId}`)

    return parseResponseTweetItem(data)
  } catch (error) {
    throw error
  }
}

export async function fetchUserTweets(
  userId: string,
  cursor?: string
): Promise<Tweet[]> {
  try {
    const withCursor = cursor === '' || cursor === undefined
    const target = withCursor
      ? `/users/${userId}/tweets`
      : `/users/${userId}/tweets?cursor=${cursor}`

    const { data } = await axios.get<ResponseItems<TweetJSONSchema>>(target)

    const items = data.items.map((item) => parseResponseTweetItem(item))

    return items
  } catch (error) {
    throw error
  }
}

export async function fetchFeed(cursor?: string): Promise<Tweet[]> {
  try {
    const withCursor = cursor === '' || cursor === undefined
    const target = withCursor ? '/tweets/feed' : `/tweets/feed?cursor=${cursor}`

    const { data } = await axios.get<ResponseItems<TweetJSONSchema>>(target)

    if (data.items === null) {
      return []
    }

    const items = data.items.map((item) => parseResponseTweetItem(item))

    return items
  } catch (error) {
    throw error
  }
}

export async function fetchReplies(
  tweetId: string,
  cursor?: string
): Promise<Tweet[]> {
  try {
    const withCursor = cursor === '' || cursor === undefined
    const target = withCursor
      ? `/tweets/${tweetId}/replies`
      : `/tweets/${tweetId}/replies?cursor=${cursor}`

    const { data } = await axios.get<ResponseItems<TweetJSONSchema>>(target)

    if (data.items === null) {
      return []
    }

    const items = data.items.map((item) => parseResponseTweetItem(item))

    return items
  } catch (error) {
    throw error
  }
}

export async function searchTweets(query: string): Promise<Tweet[]> {
  try {
    const { data } = await axios.get<ResponseItems<TweetJSONSchema>>(
      `/tweets/search?query=${query}`
    )

    if (data.items === null) {
      return []
    }

    const items = data.items.map((item) => parseResponseTweetItem(item))

    return items
  } catch (error) {
    throw error
  }
}

export async function createTweet(content: string): Promise<void> {
  try {
    await axios.post('/tweets', { content })
  } catch (error) {
    throw error
  }
}

export async function createReply(
  tweetId: string,
  content: string
): Promise<void> {
  try {
    await axios.post(`/tweets/${tweetId}/reply`, { content })
  } catch (error) {
    throw error
  }
}

export async function favoriteTweet(tweetId: string): Promise<void> {
  try {
    await axios.post(`/tweets/${tweetId}/favorite`)
  } catch (error) {
    throw error
  }
}

import { Redis } from '@upstash/redis'

function getUpstashRedisInfo() {
    const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN

    if(!upstashRedisUrl || upstashRedisUrl.length === 0) throw new Error('Missing UPSTASH_REDIS_REST_URL')
    if(!upstashRedisToken || upstashRedisToken.length === 0) throw new Error('Missing UPSTASH_REDIS_REST_TOKEN')

    return { upstashRedisUrl, upstashRedisToken }
}

export const db = new Redis({ // @ts-ignore
    url: getUpstashRedisInfo().upstashRedisUrl,
    token: getUpstashRedisInfo().upstashRedisToken,
})

// export const db = Redis.fromEnv()
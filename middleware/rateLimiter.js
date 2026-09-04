import { Redis} from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Define Tier Limits (Requests per minute)
const TIER_LIMITS = {
    free: 10,
    premium: 100,
    enterprise: 10000
};

export const apiAuthAndRateLimit = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    // Restricted Demo Key Handling for Presentation
    if (apiKey === 'demo_public_key_for_presentations') {
        req.userTier = 'FREE';
        req.apiKeyId = 'demo-key';
        return next();
    }

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'API key is missing' }
        });
    }
    try {
        const keyRecord = await prisma.apiKey.findUnique({
            where: { key: apiKey },
            include: { user: true }
        });

        if (!keyRecord) {
            return res.status(401).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Invalid API key' }
            });
        }

        const userTier = keyRecord.user.tier || 'FREE';
        const limit = TIER_LIMITS[userTier] || 10;

        // Upstash Dynamic Rate Limiting
        const ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limit, '1 m'),
            analytics: true,
        });

        const {success, limit: maxLimit, remaining, reset} = await ratelimit.limit(apiKey);

        res.setHeader('X-RateLimit-Limit', maxLimit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);

        if (!success) {
            return res.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: `Rate limit exceeded for ${userTier} plan. Try again in a minute.`
                }
                });
            }

            req.user = keyRecord.user;
            req.apiKeyId = keyRecord.id;
            next();
    } catch (error) {
        console.error('Rate Limiter Error:', error);
        next();
    }
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auditLogger = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', async () => {
        const responseTime = Date.now() - startTime;
        const apiKeyId = req.apiKeyId && req.apiKeyId !== 'demo-key' ? req.apiKeyId : null;

        try {
            await prisma.apiLog.create({
                data: {
                    apiKeyId: apiKeyId,
                    endpoint: req.originalUrl || req.url,
                    method: req.method,
                    statusCode: res.statusCode,
                    responseTime: responseTime,
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
                }
            });
        } catch (error) {
            console.error('Audit Logging Error:', error);
        }
    });

    next();
};
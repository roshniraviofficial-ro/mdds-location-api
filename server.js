import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { PrismaClient } from '@prisma/client';
import { apiAuthAndRateLimit } from './middleware/rateLimiter.js';
import { auditLogger as apiAuditLogger } from './middleware/auditLogger.js';
dotenv.config();

const app = express();

//  1. Security Headers Configuration (As per Specification)
app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
    );

  
  const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dynamic Standard Response Helper Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  req.requestId = 'req_' + Math.random().toString(36).substr(2, 9);

  res.sendSuccess = (data, count = 0, rateLimitInfo = {}) => {
    const responseTime = Date.now() - startTime;

    // Set Specification Headers 
    res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit ||  5000);
    res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining || 4850);
    res.setHeader('X-RateLimit-Reset', rateLimitInfo.reset || Math.floor(Date.now() / 1000) + 3600);

    return res.json({
      success: true,
      count : count || (Array.isArray(data) ? data.length : 1),
      data: data,
      meta: {
        requestId: req.requestId,
        responseTime: responseTime,
      rateLimit: {
        remaining: rateLimitInfo.remaining || 4850,
        limit: rateLimitInfo.limit || 5000,
        reset: rateLimitInfo.resetIso || new Date(Date.now() + 3600000).toISOString()
      }    }
  });
};
next();
});

// 2. Sample Autocomple API Endpoint
app.get('/api/v1/autocomplete', (req, res) => {
  const query = req.query.q;
  if (!query || query.length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_QUERY',
        message: 'Search query too short or missing'
      }
    });
  }
  app.use('/api/v1/autocomplete', apiAuthAndRateLimit); // Apply Rate Limiting Middleware
  app.use(apiAuditLogger); // Apply Audit Logging Middleware

  // Sample Mock Response matching specification
  const mockResults = [
    {
      village_id: "525002",
      village_name: "Manibeli",
      full_address: "Manibeli, Akkalkuwa, Nandurbar, Maharashtra, India",
      sub_district: "Akkalkuwa",
      district: "Nandurbar",
      state: "Maharashtra",
      country: "India"
    }
  ];
  res.sendSuccess(mockResults);
});

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// B2B Autocomplete API Endpoint
app.get('/api/v1/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Query parameter "q" must be at least 2 characters long' 
      });
    }

    const villages = await prisma.village.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      take: 10,
      select: {
        id: true,
        name: true,
        subDistrict: {
          select: {
            name: true,
            district: {
              select: {
                name: true,
                state: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const results = villages.map(v => ({
      id: v.id,
      village: v.name,
      subDistrict: v.subDistrict.name,
      district: v.subDistrict.district.name,
      state: v.subDistrict.district.state.name,
      displayLabel: `${v.name} (${v.subDistrict.name}, ${v.subDistrict.district.name}, ${v.subDistrict.district.state.name})`
    }));

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Autocomplete Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during autocomplete search' });
  }
});

// Fallback route for Single Page Application (SPA) using Regex
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
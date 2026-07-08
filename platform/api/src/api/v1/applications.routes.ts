import { Router } from 'express';
import { z } from 'zod';
import { applicationService } from '../../services/application.service.js';
import { validateBody } from '../../middleware/validate.js';
import { applicationLimiter } from '../../middleware/rateLimit.js';
import { ah } from '../../lib/asyncHandler.js';

export const applicationsRouter = Router();

// Submit an application (PUBLIC — the founder /register wizard). Rate-limited to blunt
// spam. Listing + approval/rejection live on the ADMIN router (/admin/applications),
// gated by the internal admin realm (requireAdmin) — they are NOT exposed here, so no
// merely-authenticated user can list or approve applications.
applicationsRouter.post('/',
  applicationLimiter,
  validateBody(z.object({
    companyProfile: z.any(),
    product: z.any()
  })),
  ah(async (req, res) => {
    const app = await applicationService.submit({
      profile: req.body.companyProfile,
      product: req.body.product
    });
    res.status(201).json(app);
  })
);

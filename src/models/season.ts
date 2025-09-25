import { z } from 'zod';

export const SeasonSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().max(100).min(1),
  year: z.number().int().min(1900).max(3000),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  is_active: z.boolean().default(false),
  registration_start_date: z.coerce.date().optional(),
  registration_end_date: z.coerce.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateSeasonSchema = SeasonSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateSeasonSchema = SeasonSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Season = z.infer<typeof SeasonSchema>;
export type CreateSeason = z.infer<typeof CreateSeasonSchema>;
export type UpdateSeason = z.infer<typeof UpdateSeasonSchema>;

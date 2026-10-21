import { createClient } from '@supabase/supabase-js';
import type { Backend, BreakdownRow, Enquiry, TrafficPoint } from './types';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Null until the Supabase settings are added — the panel then runs in demo mode. */
export const supabase = url && key ? createClient(url, key) : null;

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';

const enquiryColumns =
  'id, created_at, name, email, phone, phone_country, company, country, interests, message, page, status, notes, ip_country, email_sent, is_test';

export function liveBackend(client: NonNullable<typeof supabase>): Backend {
  return {
    mode: 'live',

    async traffic(period, periods, includeTest) {
      const { data, error } = await client.rpc('admin_traffic', {
        p_bucket: period,
        p_periods: periods,
        p_tz: timeZone,
        p_include_test: includeTest,
      });
      if (error) throw error;
      return (data as TrafficPoint[]).map((row) => ({
        bucket: row.bucket,
        visits: Number(row.visits),
        visitors: Number(row.visitors),
        enquiries: Number(row.enquiries),
      }));
    },

    async breakdown(period, periods, includeTest) {
      const { data, error } = await client.rpc('admin_breakdown', {
        p_bucket: period,
        p_periods: periods,
        p_tz: timeZone,
        p_include_test: includeTest,
      });
      if (error) throw error;
      return (data as BreakdownRow[]).map((row) => ({ ...row, total: Number(row.total) }));
    },

    async enquiries(includeTest) {
      let query = client.from('enquiries').select(enquiryColumns).order('created_at', { ascending: false }).limit(1000);
      if (!includeTest) query = query.eq('is_test', false);
      const { data, error } = await query;
      if (error) throw error;
      return data as Enquiry[];
    },

    async updateEnquiry(id, patch) {
      const { error } = await client.from('enquiries').update(patch).eq('id', id);
      if (error) throw error;
    },
  };
}

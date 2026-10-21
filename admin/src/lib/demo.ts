import type { Backend, BreakdownRow, Dimension, Enquiry, EnquiryStatus, Period, TrafficPoint } from './types';

/**
 * Demo mode: realistic-looking sample data generated in the browser, so the panel can be explored
 * before the database is connected. Nothing here is real and nothing is saved.
 */

function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(2, '0');
const localKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;

function bucketStart(date: Date, period: Period): Date {
  if (period === 'month') return new Date(date.getFullYear(), date.getMonth(), 1);
  if (period === 'week') return new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7));
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const people: [name: string, company: string | null, domain: string, country: string, phoneCountry: string, phone: string][] = [
  ['Emma Visser', 'Visser Home BV', 'visserhome.example', 'Netherlands', 'NL', '+31 6 1234 5678'],
  ['Liam Carter', 'Carter & Co Interiors', 'carterco.example', 'Australia', 'AU', '+61 412 345 678'],
  ['Sofia Rossi', 'Casa Rossi Arredamenti', 'casarossi.example', 'Italy', 'IT', '+39 347 123 4567'],
  ['Ahmed Al-Farsi', 'Gulf Living Trading', 'gulfliving.example', 'United Arab Emirates', 'AE', '+971 50 123 4567'],
  ['Hannah Becker', 'Becker Wohnen GmbH', 'beckerwohnen.example', 'Germany', 'DE', '+49 151 2345 6789'],
  ['Daniel Kim', null, 'mail.example', 'South Korea', 'KR', '+82 10 1234 5678'],
  ['Chloé Martin', 'Maison Martin', 'maisonmartin.example', 'France', 'FR', '+33 6 12 34 56 78'],
  ['Rahul Mehta', 'Mehta Furnishings', 'mehtafurnishings.example', 'India', 'IN', '+91 98765 43210'],
  ['Olivia Brown', 'Brown Hospitality Group', 'brownhospitality.example', 'United States', 'US', '+1 415 555 0134'],
  ['Kenji Tanaka', 'Tanaka Living', 'tanakaliving.example', 'Japan', 'JP', '+81 90 1234 5678'],
  ['Isabella García', 'García Hogar', 'garciahogar.example', 'Spain', 'ES', '+34 612 345 678'],
  ['Budi Santoso', 'Santoso Property', 'santosoproperty.example', 'Indonesia', 'ID', '+62 812 3456 7890'],
  ['Noah Wilson', 'Wilson Developments', 'wilsondev.example', 'United Kingdom', 'GB', '+44 7700 900123'],
  ['Mei Lin', 'Lin Design Studio', 'lindesign.example', 'Singapore', 'SG', '+65 8123 4567'],
];

const requests: [interests: string[], message: string][] = [
  [['Furniture & Crafts'], 'We run three furniture stores and are looking for teak dining sets and outdoor lounge pieces. Please send your catalog and FOB prices for a 40ft container.'],
  [['Doors'], 'Interested in solid wood entry doors for a residential project of 120 units. Could you share sizes, finishes and lead times?'],
  [['Flooring'], 'Please send the flooring catalog with prices per m² for engineered teak, and the minimum order quantity.'],
  [['Doors', 'Flooring'], 'We are a developer in the region. Looking for a supplier for both interior doors and wood flooring for a hotel renovation.'],
  [['Custom / OEM & ODM'], 'Can you produce our own designs? We have drawings for a range of 8 chairs and 3 tables, roughly 500 pieces per model per year.'],
  [['Furniture & Crafts', 'Custom / OEM & ODM'], 'Looking for a long-term partner for rattan and teak chairs with our branding. Do you offer samples?'],
  [['Furniture & Crafts'], 'Hello, please send me the full catalog and price list. We import for the hospitality sector.'],
];

const countryWeights: [string, number][] = [['ID', 0.22], ['US', 0.14], ['AU', 0.1], ['NL', 0.08], ['GB', 0.07], ['DE', 0.06], ['AE', 0.06], ['IN', 0.05], ['SG', 0.04]];
const deviceWeights: [string, number][] = [['desktop', 0.58], ['mobile', 0.36], ['tablet', 0.06]];
const sourceWeights: [string, number][] = [['Direct', 0.46], ['google.com', 0.31], ['instagram.com', 0.09], ['linkedin.com', 0.06], ['facebook.com', 0.04], ['bing.com', 0.02]];
const sectionWeights: [string, number][] = [['explore/furniture-crafts', 0.38], ['explore/doors-flooring', 0.2], ['request-catalog', 0.12]];

type Day = { date: Date; visits: number; visitors: number; enquiries: number };

function generate() {
  const rand = random(20261021);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayShare = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
  const days: Day[] = [];
  const enquiries: Enquiry[] = [];

  for (let ago = 400; ago >= 0; ago--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ago);
    const weekday = date.getDay();
    const weekFactor = weekday === 0 || weekday === 6 ? 0.68 : weekday === 5 ? 0.92 : 1.06;
    const trend = 16 + (400 - ago) * 0.1;
    let visits = Math.round(trend * weekFactor * (0.72 + rand() * 0.56));
    if (ago === 0) visits = Math.round(visits * Math.max(dayShare, 0.05));
    const visitors = Math.round(visits * (0.66 + rand() * 0.12));

    // Roughly 3.5% of visitors send an enquiry.
    let count = 0;
    let budget = visitors * 0.035;
    while (rand() < budget) {
      count++;
      budget -= 1;
    }
    days.push({ date, visits, visitors, enquiries: count });

    for (let i = 0; i < count; i++) {
      const person = people[Math.floor(rand() * people.length)];
      const [interests, message] = requests[Math.floor(rand() * requests.length)];
      const minutes = Math.floor(rand() * (ago === 0 ? Math.max(dayShare, 0.05) : 1) * 24 * 60);
      const created = new Date(date.getTime() + minutes * 60_000);
      const status: EnquiryStatus = ago < 3 ? (rand() < 0.75 ? 'new' : 'contacted') : ago < 14 ? (rand() < 0.3 ? 'new' : 'contacted') : rand() < 0.6 ? 'closed' : 'contacted';
      const [name, company, domain, country, phoneCountry, phone] = person;
      enquiries.push({
        id: `demo-${days.length}-${i}`,
        created_at: created.toISOString(),
        name,
        email: `${name.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}@${domain}`,
        phone,
        phone_country: phoneCountry,
        company,
        country: rand() < 0.8 ? country : null,
        interests,
        message,
        page: 'https://golden-village.example/#request-catalog',
        status,
        notes: status === 'closed' && rand() < 0.4 ? 'Sent catalog and price list. Follow up next quarter.' : null,
        ip_country: phoneCountry,
        email_sent: true,
        is_test: false,
      });
    }
  }
  enquiries.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { days, enquiries };
}

const data = generate();
const wait = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 180));

function series(period: Period, periods: number): TrafficPoint[] {
  const buckets = new Map<string, TrafficPoint>();
  for (const day of data.days) {
    const key = localKey(bucketStart(day.date, period));
    const point = buckets.get(key) ?? { bucket: key, visits: 0, visitors: 0, enquiries: 0 };
    point.visits += day.visits;
    point.visitors += day.visitors;
    point.enquiries += day.enquiries;
    buckets.set(key, point);
  }
  return [...buckets.values()].slice(-periods);
}

export const demoBackend: Backend = {
  mode: 'demo',

  traffic: (period, periods) => wait(series(period, periods)),

  breakdown(period, periods) {
    const points = series(period, periods);
    const visits = points.reduce((sum, point) => sum + point.visits, 0);
    const rand = random(visits);
    const rows: BreakdownRow[] = [];
    const add = (dimension: Dimension, weights: [string, number][]) => {
      for (const [label, weight] of weights) {
        rows.push({ dimension, label, total: Math.max(0, Math.round(visits * weight * (0.85 + rand() * 0.3))) });
      }
    };
    add('country', countryWeights);
    add('device', deviceWeights);
    add('source', sourceWeights);
    add('section', sectionWeights);
    return wait(rows.sort((a, b) => b.total - a.total));
  },

  enquiries: () => wait(data.enquiries.map((enquiry) => ({ ...enquiry }))),

  async updateEnquiry(id, patch) {
    const enquiry = data.enquiries.find((item) => item.id === id);
    if (enquiry) Object.assign(enquiry, patch);
    await wait(null);
  },
};

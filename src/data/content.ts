import { createStore, reconcile } from 'solid-js/store';
import { z } from 'zod';
import * as initial from './portfolio';
import { experienceGroups, getExperienceGroup } from './experience';
export type { Project, ProjectCategory } from './portfolio';

const text = z.string();
const url = text.refine(v => !v || (!v.includes(':') && !v.startsWith('//') && !v.includes('\\')) || /^https?:\/\//i.test(v), 'Gunakan URL https:// atau path file lokal.');
export const contentSchema = z.object({
  profile: z.object({
    name: text.min(1), shortName: text, role: text, location: text, shortBio: text,
    about: text, aboutSecond: text, email: z.email(), photo: url,
    introPhoto: url, aboutPhoto: url, navbarPhoto: url, footerPhoto: url, resume: url,
    social: z.array(z.object({ label: text, url })),
  }),
  projects: z.array(z.object({
    id: z.number().int(), title: text.min(1), category: z.enum(['Web App', 'UI/UX', 'Desain Grafis', 'Publikasi']),
    year: text, summary: text, description: text, stack: z.array(text),
    visual: z.enum(['dashboard', 'mobile', 'branding', 'analytics', 'website']),
    image: url.optional(), gallery: z.array(z.object({ src: url, alt: text })).optional(),
    publication: text.optional(), link: url.optional(),
  })).refine(items => new Set(items.map(i => i.id)).size === items.length, 'ID proyek harus unik.'),
  experiences: z.array(z.object({ id: text, documentation: url, category: text, title: text,
    gallery: z.array(z.object({ src: url, alt: text })).default([]),
    group: z.enum(experienceGroups).optional(),
    organization: text, period: text, description: text, link: url, highlights: z.array(text) })
    .transform(item => ({ ...item, group: getExperienceGroup(item) }))),
  expertise: z.array(z.object({ number: text, title: text, desc: text, tags: z.array(text) })),
});
export type Content = z.infer<typeof contentSchema>;
export const defaults: Content = contentSchema.parse({ profile: initial.profile, projects: initial.projects, experiences: initial.experiences, expertise: initial.expertise });
const [content, setContent] = createStore<Content>(structuredClone(defaults));
export const profile = content.profile;
export const projects = content.projects;
export const experiences = content.experiences;
export const expertise = content.expertise;
export const updateContent = (value: unknown) => setContent(reconcile(contentSchema.parse(value)));

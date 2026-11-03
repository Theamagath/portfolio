export const experienceGroups = ['Profesional', 'Organisasi'] as const;
export type ExperienceGroup = (typeof experienceGroups)[number];

// Older Firestore documents only have a descriptive category.
export function getExperienceGroup(item: { group?: ExperienceGroup; category: string }): ExperienceGroup {
  return item.group ?? (/organisasi/i.test(item.category) ? 'Organisasi' : 'Profesional');
}

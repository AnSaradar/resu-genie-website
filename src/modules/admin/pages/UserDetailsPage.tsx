import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/admin/service';
import { useState } from 'react';

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border bg-card">
      <button
        className="flex w-full items-center justify-between px-4 py-3"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-sm font-medium">{title}</span>
        <span className={`transition ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function SkeletonLines({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 w-full max-w-[28rem] rounded bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export function UserDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-user-complete', id],
    queryFn: () => AdminService.getCompleteData(id as string),
    enabled: !!id,
    staleTime: 15_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-52 rounded bg-muted animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4"><SkeletonLines rows={5} /></div>
          <div className="rounded-xl border p-4"><SkeletonLines rows={5} /></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-red-500">Failed to load user details.</div>;
  }

  const user = data.user;
  const profile = data.profile;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{user.first_name} {user.last_name}</h1>
          <div className="text-muted-foreground">{user.email}</div>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'}`}>{user.role}</span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'}`}>{user.status}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Profile">
          <div className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Phone:</span> {user.phone || '-'}</div>
            {profile && (
              <>
                {'work_field' in profile && <div><span className="text-muted-foreground">Work Field:</span> {profile.work_field}</div>}
                {'job_title' in profile && <div><span className="text-muted-foreground">Job Title:</span> {profile.job_title}</div>}
                {'years_of_experience' in profile && <div><span className="text-muted-foreground">Experience:</span> {profile.years_of_experience} years</div>}
              </>
            )}
          </div>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {(data.skills || []).map((s: any, i: number) => (
              <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs">{s.name}{s.level ? ` • ${s.level}` : ''}</span>
            ))}
            {(!data.skills || data.skills.length === 0) && <div className="text-sm text-muted-foreground">No skills</div>}
          </div>
        </Section>

        <Section title="Education">
          <div className="space-y-3">
            {(data.education || []).map((e: any, i: number) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium">{e.degree} • {e.institution}</div>
                <div className="text-xs text-muted-foreground">{e.start_date} - {e.end_date || 'Present'}</div>
              </div>
            ))}
            {(!data.education || data.education.length === 0) && <div className="text-sm text-muted-foreground">No education records</div>}
          </div>
        </Section>

        <Section title="Experience">
          <div className="space-y-3">
            {(data.experiences || []).map((e: any, i: number) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium">{e.job_title} • {e.company}</div>
                <div className="text-xs text-muted-foreground">{e.start_date} - {e.end_date || 'Present'}</div>
                {e.description && <div className="mt-1 text-sm">{e.description}</div>}
              </div>
            ))}
            {(!data.experiences || data.experiences.length === 0) && <div className="text-sm text-muted-foreground">No experiences</div>}
          </div>
        </Section>

        <Section title="Certifications">
          <div className="space-y-3">
            {(data.certifications || []).map((c: any, i: number) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium">{c.name}</div>
                {c.issuer && <div className="text-xs text-muted-foreground">{c.issuer}</div>}
              </div>
            ))}
            {(!data.certifications || data.certifications.length === 0) && <div className="text-sm text-muted-foreground">No certifications</div>}
          </div>
        </Section>

        <Section title="Languages">
          <div className="flex flex-wrap gap-2">
            {(data.languages || []).map((l: any, i: number) => (
              <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs">{l.name}{l.level ? ` • ${l.level}` : ''}</span>
            ))}
            {(!data.languages || data.languages.length === 0) && <div className="text-sm text-muted-foreground">No languages</div>}
          </div>
        </Section>

        <Section title="Links">
          <div className="space-y-2">
            {(data.links || []).map((l: any, i: number) => (
              <a key={i} className="block text-sm text-primary underline" href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a>
            ))}
            {(!data.links || data.links.length === 0) && <div className="text-sm text-muted-foreground">No links</div>}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-3">
            {(data.projects || []).map((p: any, i: number) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium">{p.name}</div>
                {p.description && <div className="text-sm">{p.description}</div>}
              </div>
            ))}
            {(!data.projects || data.projects.length === 0) && <div className="text-sm text-muted-foreground">No projects</div>}
          </div>
        </Section>

        <Section title="Custom Sections">
          <div className="space-y-3">
            {(data.custom_sections || []).map((s: any, i: number) => (
              <div key={i} className="rounded-md border p-3">
                <div className="font-medium">{s.title}</div>
                {s.content && <div className="text-sm">{s.content}</div>}
              </div>
            ))}
            {(!data.custom_sections || data.custom_sections.length === 0) && <div className="text-sm text-muted-foreground">No custom sections</div>}
          </div>
        </Section>
      </div>
    </div>
  );
}



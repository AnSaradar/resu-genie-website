import { NavLink, Outlet, useLocation } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const crumbs = ['admin', ...parts];
  const hrefs = crumbs.map((_, i) => '/admin/' + parts.slice(0, i).join('/')).map(h => h.replace(/\/$/, ''));
  return (
    <div className="text-sm text-muted-foreground">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1">/</span>}
          <span className={i === crumbs.length - 1 ? 'text-foreground font-medium' : ''}>{c || 'overview'}</span>
        </span>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r bg-background">
        <div className="p-4 font-semibold">Admin</div>
        <nav className="flex flex-col gap-1 p-2">
          <NavLink to="/admin/overview" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Overview</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-primary text-white' : 'hover:bg-muted'}`}>Users</NavLink>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <Breadcrumbs />
              <div className="mt-1 text-xl font-semibold">Admin Panel</div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="h-9 rounded-md border px-3 text-sm hover:bg-muted">View Site</a>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/services/auth/hook';
import { UserIcon } from 'lucide-react';

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
  const { user, logout } = useAuth();
  const initials = `${user?.first_name?.[0] ?? "A"}${user?.last_name?.[0] ?? ""}`;

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
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 relative">
                  <Avatar>
                    <AvatarImage src="" alt="avatar" />
                    <AvatarFallback>
                      {user ? initials : <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user ? `${user.first_name} ${user.last_name}` : "Admin"}
                      </span>
                      {user?.email && (
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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



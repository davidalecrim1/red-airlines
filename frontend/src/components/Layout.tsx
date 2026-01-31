import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Red Airlines
          </Link>
          <nav className="header-nav">
            <Link to="/admin" className="btn btn-secondary btn-sm">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Red Airlines. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

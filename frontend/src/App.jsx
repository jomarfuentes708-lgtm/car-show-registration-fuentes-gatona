import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto min-h-screen max-w-[1600px] p-3 sm:p-5 lg:p-8">
        <DashboardPage />
      </div>
    </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PaymentPage } from './pages/PaymentPage';
import { MyPayments } from './pages/MyPayments';
import { CreateProfile } from './components/profile/CreateProfile';
import { Header, Footer } from '@/components/layout';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" richColors closeButton />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-payments" element={<MyPayments />} />
          <Route path="/profile/create" element={
            <div className="container mx-auto px-4 py-16 max-w-2xl">
              <CreateProfile />
            </div>
          } />
          <Route path="/:username" element={<PaymentPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

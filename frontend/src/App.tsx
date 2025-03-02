import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { LoginForm } from './pages/LoginForm';
import { SignUpForm } from './pages/SignUpForm';
import { WelcomePage } from './pages/WelcomePage';
import { SessionsManagement } from './pages/SessionsManagement';
import { ProtectedRoute } from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={<LoginForm />}
        />
        <Route
          path='/signup'
          element={<SignUpForm />}
        />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/sessions'
          element={
            <ProtectedRoute>
              <SessionsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={
            <Navigate
              to='/'
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { LoginForm } from '@pages/LoginForm';
import { ProtectedRoute } from '@pages/ProtectedRoute';
import { SessionsManagement } from '@pages/SessionsManagement';
import { SignUpForm } from '@pages/SignUpForm';
import { WelcomePage } from '@pages/WelcomePage';


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

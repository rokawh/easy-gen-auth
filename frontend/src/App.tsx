import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignUpForm } from './components/SignUpForm';
import { LoginForm } from './components/LoginForm';
import { WelcomePage } from './components/WelcomePage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

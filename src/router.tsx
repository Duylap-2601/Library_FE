import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { GalleryPage } from './pages/GalleryPage';
import { DocumentEditorPage } from './pages/DocumentEditorPage';
import { LoginPage } from './pages/LoginPage';
import { MyDocumentsPage } from './pages/MyDocumentsPage';
import { RegisterPage } from './pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <GalleryPage />,
      },
      {
        path: 'documents',
        element: <MyDocumentsPage />,
      },
      {
        path: 'documents/:id',
        element: <DocumentEditorPage />,
      },
    ],
  },
]);

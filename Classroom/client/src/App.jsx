import React, { useEffect, useState, Component } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Outlet, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { Toaster } from 'react-hot-toast';
import ClassStudents from './Pages/ClassStudents';
import UserLayout from './Layout/UserLayout';
import ClassAdmin from './Pages/ClassAdmin';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminLayout from './Layout/AdminLayout';
import Addstudents from './Components/Addstudents';
import ArchivedClass from './Pages/ArchivedClass';
import Classwork from './Pages/Classwork';
import ClassworkUs from './Pages/ClassworkUs';
import BootIntro from './Components/BootIntro';
import QuizAdmin from './Pages/QuizAdmin';
import QuizUser from './Pages/QuizUser';
import { useSelector } from 'react-redux';
import { BootIntroProvider, useBootIntro } from './context/BootIntroContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SidebarProvider } from './context/SidebarContext';
import StreamAdmin from './Pages/StreamAdmin';
import Students from './Pages/Students';
import Faculty from './Pages/Faculty';
import Mentor from './Pages/Mentor';
import Setting from './Pages/Setting';
import FacultyClasswork from './Pages/FacultyClasswork';
import UserDetails from './Pages/UserDetails';
import StudentPortal from './Pages/StudentPortal';
import Approval from './Pages/Approval';
import StudentAchives from './Pages/StudentAchives';
import Report from './Pages/Report';
import AddStudentMentor from './Pages/AddStudentMentor';
import StudentProfile from './Pages/StudentProfile';
import Leave from './Pages/Leave'; // Added import
import Academic from './Pages/Academic'; // Added import
import Achievements from './Pages/Achievements'; // Added import
import StudentDetailsMentor from './Pages/StudentDetail'; // Added import

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "690691222870-8fmk6jvbsp5mkujc28s1tivqvqito4be.apps.googleusercontent.com";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MentorLayout = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

const AppContent = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { showBootIntro, setShowBootIntro } = useBootIntro();
  const [hasBootIntroShown, setHasBootIntroShown] = useState(
    localStorage.getItem('hasBootIntroShown') === 'true'
  );

  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath');
    const currentPath = location.pathname;

    // Comment out or remove debug logs
    // console.log('Current Path:', currentPath);

    sessionStorage.setItem('previousPath', currentPath);

    if (
      user &&
      previousPath === '/' &&
      !hasBootIntroShown &&
      currentPath !== '/' &&
      currentPath !== '/register'
    ) {
      // console.log('Showing BootIntro');
      setShowBootIntro(true);
      document.body.style.overflow = 'hidden';
    }
  }, [location, user, hasBootIntroShown, setShowBootIntro]);

  const handleBootIntroComplete = () => {
    // console.log('BootIntro Complete');
    setShowBootIntro(false);
    setHasBootIntroShown(true);
    localStorage.setItem('hasBootIntroShown', 'true');
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (location.pathname === '/') {
      setHasBootIntroShown(false);
      localStorage.removeItem('hasBootIntroShown');
    }
  }, [location]);

  return (
    <>
      {showBootIntro && <BootIntro onComplete={handleBootIntroComplete} />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route 
          path='/home' 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super admin']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          
          {/* Add student profile route for regular users */}
          <Route 
            path='student-profile' 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="leave" replace />} />
            <Route path="leave" element={<Leave />} />
            <Route path="academic" element={<Academic />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>
          
          <Route
            path='classstudents/:id'
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ClassStudents />
              </ProtectedRoute>
            }
          />
          <Route path="classstudents/:id/classwork" element={<ClassworkUs />} />
          <Route 
            path="classstudents/:id/quiz" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <QuizUser />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route 
          path='/admin' 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super admin', 'faculty']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route 
            path='archived' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <ArchivedClass />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='userdetails' 
            element={ 
              <ProtectedRoute allowedRoles={['super admin']}>
                <UserDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='students' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='studentsportal' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <Navigate to="/mentor/classadmin/default/studentsportal" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='faculty' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin', 'faculty']}>
                <Faculty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='mentor' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <Navigate to="/mentor/classadmin/default/approval" replace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='setting' 
            element={ 
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <Setting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='faculty/class/:classId' 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super admin', 'faculty']}>
                <FacultyClasswork />
              </ProtectedRoute>
            }
          />
          <Route
            path='classadmin/:id'
            element={
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <ClassAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="classadmin/:id/addStudents" element={<Addstudents />} />
          <Route path="classadmin/:id/classwork" element={<Classwork />} />
          <Route path="classadmin/:id/stream" element={<StreamAdmin />} />
          <Route 
            path="classadmin/:id/quiz" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super admin']}>
                <QuizAdmin />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route 
          path='/mentor/classadmin/:classId' 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super admin']}>
              <MentorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="approval" replace />} />
          <Route path="studentsportal" element={<StudentPortal />} />
          <Route path="studentprofile" element={<StudentProfile />} >
            <Route index element={<Navigate to="leave" replace />} />
            <Route path="leave" element={<Leave />} />
            <Route path="academic" element={<Academic />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>
          <Route path="approval" element={<Approval />} />
          <Route path="achievement" element={<StudentAchives />} />
          <Route path="report" element={<Report />} />
          <Route path="addstudents" element={<AddStudentMentor />} />
          <Route path="studentdetail" element={<StudentDetailsMentor />} />
        </Route>

        {/* Student routes */}
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super admin']}>
              <Students />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/mentor/classadmin/:classId/studentprofile" 
          element={<Students />}
        >
          <Route index element={<Navigate to="leave" replace />} />
          <Route path="leave" element={<Leave />} />
          <Route path="academic" element={<Academic />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <SidebarProvider>
          <BootIntroProvider>
            <Toaster />
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </BootIntroProvider>
        </SidebarProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
import Link from 'next/link';

interface RegistrationClosedProps {
  onGoToLogin?: () => void;
}

const RegistrationClosed: React.FC<RegistrationClosedProps> = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registration Closed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            An admin account already exists. Registration is closed.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mt-6">
            <Link href="/" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all duration-200 transform hover:scale-[1.02]">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationClosed;
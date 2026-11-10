import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const ErrordontHaveAccesse = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-6">
        <h2 className="text-6xl font-bold text-red-500">Access Forbidden</h2>
        <h3 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white mb-3">
          Sorry, you don't have permission to access this page.
          <br /> Please contact your administrator if you need access.
        </h3>
        <Link to="/login">
          <Button variant="default" className="px-6 py-4">
            Go to Login Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrordontHaveAccesse;

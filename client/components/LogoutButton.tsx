'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/services/authService';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/apiTypes';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();

  const { mutate, isLoading } = useMutation<void, AxiosError<ApiError>>({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out successfully!");
      router.push('/login'); // redirect to login
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Are you sure you want to logout?
        </h2>

        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
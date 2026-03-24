'use client';

// import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/services/authService';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  // const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully!");

      // full refresh taake middleware dobara run ho
      window.location.href = "/login";
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <button
       onClick={() => {
    console.log("Logout clicked");
    mutate();
  }}
      disabled={isPending}
      // className="bg-card text-foreground px-5 py-2.5 rounded-xl font-bold border border-border hover:bg-border transition-colors"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
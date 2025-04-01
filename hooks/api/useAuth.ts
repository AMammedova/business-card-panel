import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful");
      setTimeout(() => {
        router.push("/employee");
      }, 100);
    },

    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

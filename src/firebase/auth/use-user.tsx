
"use client";
import { useFirebase } from "@/firebase/provider";

export const useUser = () => {
  const { user, roles, isUserLoading, userError } = useFirebase();
  return { user, roles, isUserLoading, userError };
};

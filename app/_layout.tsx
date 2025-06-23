import { ToastProvider } from "@/context/ToastContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack  />
    </ToastProvider>
  );
}

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p>Loading...</p>
    </div>
  );
}

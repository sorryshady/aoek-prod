import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({ subsets: ["latin"], weight: "600" });

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex flex-col w-full gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>AOEK</h1>
      <p className="text-muted-foreground text-lg font-semibold">{label}</p>
    </div>
  );
};

export default Header;

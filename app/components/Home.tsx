import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Form } from "@remix-run/react";

export function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </Form>
      </div>
    </div>
  );
}
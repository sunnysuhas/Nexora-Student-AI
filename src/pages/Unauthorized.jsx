import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-slate-950 dark:text-white">
      <Card className="max-w-md text-center">
        <ShieldAlert className="mx-auto mb-5 h-12 w-12 text-rose-500" />
        <h1 className="font-display text-3xl font-bold">Unauthorized Access</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Admin tools are restricted to platform administrators.
        </p>
        <Link to="/dashboard" className="mt-6 block">
          <Button className="w-full">Return to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}

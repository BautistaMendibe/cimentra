import EditProjectForm from "@/components/projects/EditProjectForm";
import { Toaster } from "sonner";

export default function EditProjectPage() {
  return (
    <div className="p-4">
      <EditProjectForm />
      <Toaster richColors position="top-center" />
    </div>
  );
}

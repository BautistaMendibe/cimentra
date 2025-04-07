import ProjectForm from "@/components/projects/ProjectForm";
import { Toaster } from "sonner";

export default function ProjectPage() {
    return (
        <div>
        <ProjectForm />
        <Toaster richColors position="top-center" />
        </div>
    );
}
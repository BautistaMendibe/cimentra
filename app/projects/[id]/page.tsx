import ProjectDetails from "@/components/projects/ProjectDetails";
import { Toaster } from "sonner";

export default function ProjectPage() {
    return (
        <div>
            <ProjectDetails />
            <Toaster richColors position="top-center" />
        </div>
    );
}
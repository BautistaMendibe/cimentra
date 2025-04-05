import ProjectsClient from "@/components/projects/ProjectClient";
import { proyectosMock } from "@/models/Project";

export default async function ProjectsPage() {

return (
    <ProjectsClient proyectos={proyectosMock} />
);
    
}
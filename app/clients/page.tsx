'use client';

import ClientsPageClient from "@/components/clients/ClientsPageClient";
import { Toaster } from "@/components/ui/sonner";
import Cliente from "@/models/Cliente";
import { createClient } from "@/utils/supabase/client";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientsPage() {

    const [loading, setLoading] = useState(true);
    const [clientes, setClientes] = useState<Cliente[]>([]);


    useEffect(() => {
        getClients();}, []);


    async function getClients() {
        const supabase = createClient();
        setLoading(true);

        const { data, error } = await supabase
            .from("cliente")
            .select(`*`)
            .order("id", { ascending: false });

        if (error) {
            toast.error("Error al cargar los clientes.");
            setLoading(false);
            return;
        }

        setClientes(data as Cliente[]);
        setLoading(false);
    }

    return (
        <>
            <ClientsPageClient 
                clientes={clientes} 
                loading={loading} 
                searchClients={getClients}
            />
            <Toaster richColors position="top-center" />
        </>
    );

}

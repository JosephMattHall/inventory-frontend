"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Archive,
    Search,
    Loader2,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface Inventory {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export default function SuperAdminInventoriesPage() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInventories();
    }, []);

    const fetchInventories = async () => {
        try {
            const res = await api.get("/admin/inventories");
            setInventories(res.data);
        } catch (error) {
            console.error("Failed to fetch inventories", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInventories = inventories.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                        <Archive className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Global Inventories</h1>
                        <p className="text-slate-400 text-sm">Monitor and manage all workspaces on the platform.</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search inventories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none w-64 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventories.map((inv) => (
                    <div key={inv.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all group shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                                <Archive size={24} />
                            </div>
                            <span className="text-xs font-mono text-slate-600 tracking-wider">ID: #{inv.id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{inv.name}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">{inv.description || "No description provided."}</p>

                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                                <Calendar size={14} /> {new Date(inv.created_at).toLocaleDateString()}
                            </div>
                            {/* In a real app, this would link to an admin view of that specific inventory */}
                            <button className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1 hover:gap-2 transition-all opacity-0 group-hover:opacity-100 italic">
                                VIEW DATA <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

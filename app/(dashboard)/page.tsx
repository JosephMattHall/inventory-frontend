"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import {
    LayoutDashboard,
    AlertTriangle,
    TrendingUp,
    Clock,
    Package,
    Activity,
    Brush,
    ArrowRight,
    Folder,
    PlusCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DashboardData {
    total_items: number;
    low_stock_items: any[];
    most_used_items: any[];
    recent_items: any[];
    recent_activity: any[];
    maintenance_items: any[];
    active_projects: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Overview of your inventory and activity.</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Package className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Items</p>
                            <p className="text-2xl font-bold text-white">{stats.total_items}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500/10 rounded-xl">
                            <AlertTriangle className="text-rose-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Low Stock</p>
                            <p className="text-2xl font-bold text-white">{stats.low_stock_items.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <Activity className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Recent Actions</p>
                            <p className="text-2xl font-bold text-white">{stats.recent_activity.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                            <Brush className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Maintenance</p>
                            <p className="text-2xl font-bold text-white">{stats.maintenance_items.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Projects */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Folder className="text-emerald-500" size={20} />
                                Active Projects
                            </h2>
                            <Link href="/projects" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="p-6">
                            {stats.active_projects && stats.active_projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stats.active_projects.map((project) => (
                                        <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded uppercase tracking-wider">
                                                    Active
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                                <Package size={14} />
                                                {project.items_count} Components
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 mb-4">No active projects right now.</p>
                                    <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors text-sm font-medium">
                                        <PlusCircle size={16} />
                                        Start a Project
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Most Used Items */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-emerald-500" size={20} />
                                Most Used Items
                            </h2>
                        </div>
                        <div className="p-6">
                            {stats.most_used_items.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.most_used_items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 font-bold">
                                                    #{item.id}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{item.name}</p>
                                                    <p className="text-xs text-slate-500">{item.count} transactions</p>
                                                </div>
                                            </div>
                                            <Link href={`/inventory/${item.id}`} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-center py-8">No activity yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock className="text-blue-500" size={20} />
                                Recent Activity
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {stats.recent_activity.length > 0 ? (
                                stats.recent_activity.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full ${log.action === "CREATE" ? "bg-emerald-500" :
                                                log.action === "DELETE" ? "bg-rose-500" :
                                                    log.action === "ADD_STOCK" ? "bg-blue-500" :
                                                        "bg-amber-500"
                                                }`} />
                                            <div>
                                                <p className="text-sm text-slate-300">
                                                    <span className="font-semibold text-white">{log.user_name}</span> {log.details}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-8">No recent activity.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar Column (1/3) */}
                <div className="space-y-8">

                    {/* Low Stock */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <AlertTriangle className="text-rose-500" size={20} />
                                Low Stock
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {stats.low_stock_items.length > 0 ? (
                                stats.low_stock_items.map((item) => (
                                    <Link key={item.id} href={`/inventory/${item.id}`}>
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-rose-500/50 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.name}</p>
                                                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-full">
                                                    {item.stock} left
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-rose-500 h-full rounded-full"
                                                    style={{ width: `${Math.min((item.stock / item.min_stock) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">Min: {item.min_stock}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">Stock levels look good!</p>
                            )}
                        </div>
                    </div>

                    {/* Recently Added */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Package className="text-purple-500" size={20} />
                                Recently Added
                            </h2>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {stats.recent_items.map((item) => (
                                <Link key={item.id} href={`/inventory/${item.id}`} className="group">
                                    <div className="aspect-square bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative mb-2">
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url.startsWith("/media") ? `http://localhost:8000${item.image_url}` : item.image_url}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 group-hover:text-white truncate text-center">{item.name}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Maintenance */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Brush className="text-amber-500" size={20} />
                                Maintenance
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">Items missing information</p>
                        </div>
                        <div className="p-4 space-y-2">
                            {stats.maintenance_items.length > 0 ? (
                                stats.maintenance_items.map((item) => (
                                    <Link key={item.id} href={`/inventory/${item.id}`} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
                                        <div>
                                            <p className="text-sm text-slate-300">{item.name}</p>
                                            <p className="text-xs text-rose-500">Missing: {item.missing_fields.join(", ")}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-600" />
                                    </Link>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">All items are complete!</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Users,
    Archive,
    Database,
    ShieldAlert,
    Trash2,
    UserPlus,
    Search,
    Loader2,
    Shield
} from "lucide-react";

interface GlobalStats {
    total_users: number;
    total_inventories: number;
    total_items: number;
}

interface User {
    id: number;
    username: string;
    is_superuser: boolean;
}

export default function SuperAdminPage() {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/users")
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (userId: number) => {
        if (!confirm("Promote this user to Super Admin? This is IRREVERSIBLE via UI.")) return;
        try {
            await api.post(`/admin/users/${userId}/promote`);
            fetchData();
        } catch (error) {
            alert("Failed to promote user");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Permanently delete this user? All their inventories will be orphaned or deleted.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/5">
                    <ShieldAlert className="text-rose-500" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Platform Administration</h1>
                    <p className="text-slate-400 text-sm">Global management and system-wide monitoring.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    label="Total Users"
                    value={stats?.total_users || 0}
                    icon={<Users className="text-blue-400" />}
                    color="blue"
                />
                <AdminStatCard
                    label="Active Inventories"
                    value={stats?.total_inventories || 0}
                    icon={<Archive className="text-emerald-400" />}
                    color="emerald"
                />
                <AdminStatCard
                    label="Global Item Count"
                    value={stats?.total_items || 0}
                    icon={<Database className="text-amber-400" />}
                    color="amber"
                />
            </div>

            {/* User Management */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-white">User Management</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 transition-colors">
                                                {u.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{u.username}</div>
                                                <div className="text-xs text-slate-500">ID: {u.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.is_superuser ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                                                <Shield size={12} /> Super Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                        {!u.is_superuser && (
                                            <button
                                                onClick={() => handlePromote(u.id)}
                                                className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                title="Promote to Super Admin"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AdminStatCard({ label, value, icon, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-500/10 border-blue-500/20",
        emerald: "bg-emerald-500/10 border-emerald-500/20",
        amber: "bg-amber-500/10 border-amber-500/20",
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400 font-medium">{label}</div>
        </div>
    );
}

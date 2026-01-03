"use client";

import { useEffect, useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { InventoryUser, getInventoryMembers, addInventoryMember, updateMemberRole, removeMember } from "@/lib/api";
import { UserPlus, Trash2, Shield, User as UserIcon, Loader2, Users } from "lucide-react";

export default function MembersPage() {
    const { activeInventory } = useInventory();
    const [members, setMembers] = useState<InventoryUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchMembers = async () => {
        if (!activeInventory) return;
        try {
            setLoading(true);
            const data = await getInventoryMembers(activeInventory.id);
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [activeInventory]);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeInventory || !newUsername) return;
        setError("");
        setSuccess("");
        try {
            await addInventoryMember(activeInventory.id, newUsername);
            setNewUsername("");
            setSuccess(`User ${newUsername} added successfully.`);
            fetchMembers();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to add member");
        }
    };

    const handleUpdateRole = async (userId: number, newRole: string) => {
        if (!activeInventory) return;
        try {
            await updateMemberRole(activeInventory.id, userId, newRole);
            fetchMembers();
        } catch (err) {
            console.error("Failed to update role", err);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!activeInventory || !confirm("Are you sure you want to remove this member?")) return;
        try {
            await removeMember(activeInventory.id, userId);
            fetchMembers();
        } catch (err) {
            console.error("Failed to remove member", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <Users className="text-emerald-500" size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Members</h1>
                    <p className="text-slate-400 text-sm">Control who has access to the {activeInventory?.name} inventory.</p>
                </div>
            </div>

            {/* Add Member Form */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
                <h2 className="mb-4 text-lg font-semibold text-white">Add New Member</h2>
                <form onSubmit={handleAddMember} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Member
                    </button>
                </form>
                {error && <p className="mt-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{error}</p>}
                {success && <p className="mt-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">{success}</p>}
            </div>

            {/* Members List */}
            <div className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Role
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {members.map((member) => (
                            <tr key={member.user_id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                                            <UserIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{member.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleUpdateRole(member.user_id, e.target.value)}
                                        className="rounded-lg border border-slate-700 bg-slate-800 py-1.5 px-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleRemoveMember(member.user_id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors"
                                        title="Remove Member"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

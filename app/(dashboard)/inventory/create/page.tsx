"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInventory } from "@/lib/api";
import { useInventory } from "@/context/InventoryContext";
import { Plus, Loader2 } from "lucide-react";

export default function CreateInventoryPage() {
    const router = useRouter();
    const { refreshInventories, setActiveInventory } = useInventory();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const newInv = await createInventory({ name, description });
            await refreshInventories();
            setActiveInventory(newInv);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create inventory");
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <Plus className="text-emerald-500" size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create New Inventory</h1>
                    <p className="text-slate-400 text-sm">Set up a new workspace for your items and projects.</p>
                </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl shadow-black/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                            Inventory Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-500"
                            placeholder="e.g. My Workspace, Main Lab, etc."
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-500 resize-none"
                            placeholder="Briefly describe what this inventory is for..."
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-emerald-500/50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

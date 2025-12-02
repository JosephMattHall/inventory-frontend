"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import AttachmentsSection from "@/components/AttachmentsSection";
import ImageUploader from "@/components/ImageUploader";

export default function CreateItemPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        category: "Misc",
        description: "",
        stock: 0,
        min_stock: 5,
        location: "",
        image_url: "",
        manufacturer_part_number: "",
        attachments: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/items", formData);
            router.push("/inventory");
        } catch (err: any) {
            console.error(err);
            setError("Failed to create item. Ensure you have admin privileges.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link
                    href="/inventory"
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Add New Component</h1>
                    <p className="text-slate-400 mt-1">Fill in the details below</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">
                            Component Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g., 10kΩ Resistor 1/4W"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="manufacturer_part_number" className="block text-sm font-medium text-slate-400 mb-1">
                            Manufacturer Part Number
                        </label>
                        <input
                            type="text"
                            name="manufacturer_part_number"
                            id="manufacturer_part_number"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                            placeholder="e.g., NE555P"
                            value={formData.manufacturer_part_number || ""}
                            onChange={(e) => setFormData({ ...formData, manufacturer_part_number: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-400 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                placeholder="e.g., Box A1"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-400 mb-1">
                                Initial Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                min="0"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label htmlFor="min_stock" className="block text-sm font-medium text-slate-400 mb-1">
                                Min Stock Alert
                            </label>
                            <input
                                type="number"
                                name="min_stock"
                                id="min_stock"
                                min="0"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                value={formData.min_stock}
                                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none resize-none"
                            placeholder="Additional details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>



                    <div>
                        <ImageUploader
                            onUploaded={(url) => setFormData({ ...formData, image_url: url })}
                            initialUrl={formData.image_url}
                        />
                    </div>

                    <div>
                        <AttachmentsSection
                            attachments={formData.attachments}
                            onUpdate={(newAttachments) => setFormData({ ...formData, attachments: newAttachments })}
                            isEditing={true}
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save size={20} />
                        {loading ? "Creating..." : "Save to Inventory"}
                    </button>
                </form>
            </div>
        </div>
    );
}

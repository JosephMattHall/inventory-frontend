"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Minus, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";

interface Item {
    id: number;
    name: string;
    description: string;
    stock: number;
    image_url?: string;
}

export default function ItemDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stockChange, setStockChange] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Item | null>(null);

    useEffect(() => {
        fetchItem();
    }, [params.id]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/items/${params.id}`);
            setItem(response.data);
            setEditForm(response.data);
        } catch (error) {
            console.error("Failed to fetch item", error);
            setError("Item not found");
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = async (type: "add" | "remove") => {
        if (!item) return;
        try {
            const response = await api.post(
                `/items/${item.id}/${type}/${stockChange}`
            );
            setItem(response.data);
            setEditForm(response.data);
        } catch (error) {
            console.error("Failed to update stock", error);
            alert("Failed to update stock. Ensure you have admin privileges.");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/items/${params.id}`);
            router.push("/inventory");
        } catch (error) {
            console.error("Failed to delete item", error);
            alert("Failed to delete item. Ensure you have admin privileges.");
        }
    };

    const handleSave = async () => {
        if (!editForm) return;
        try {
            const response = await api.put(`/items/${params.id}`, {
                name: editForm.name,
                description: editForm.description,
                image_url: editForm.image_url,
            });
            setItem(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update item", error);
            alert("Failed to update item. Ensure you have admin privileges.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error || !item) return <div>{error}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/inventory" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Edit Item" : item.name}
                    </h1>
                </div>
                <div className="flex space-x-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {isEditing ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="text"
                                className="w-full border rounded-md p-2"
                                value={editForm?.image_url || ""}
                                onChange={(e) => setEditForm({ ...editForm!, image_url: e.target.value })}
                            />
                            {editForm?.image_url && (
                                <img
                                    src={editForm.image_url}
                                    alt="Preview"
                                    className="w-full h-64 object-contain rounded-md bg-gray-50"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-full w-full object-contain object-center"
                                />
                            ) : (
                                <div className="flex h-64 items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2"
                                        value={editForm?.name || ""}
                                        onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full border rounded-md p-2"
                                        value={editForm?.description || ""}
                                        onChange={(e) => setEditForm({ ...editForm!, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm(item);
                                        }}
                                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                    <p className="mt-2 text-gray-500">{item.description || "No description provided."}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Management</h3>
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Current Stock</p>
                                            <p className={`text-3xl font-bold ${item.stock < 5 ? "text-red-600" : "text-gray-900"}`}>
                                                {item.stock}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border rounded-md bg-white">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-16 p-2 text-center border-none focus:ring-0"
                                                    value={stockChange}
                                                    onChange={(e) => setStockChange(Math.max(1, parseInt(e.target.value) || 1))}
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStockUpdate("remove")}
                                                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                                    title="Remove Stock"
                                                >
                                                    <Minus className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleStockUpdate("add")}
                                                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                                    title="Add Stock"
                                                >
                                                    <Plus className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

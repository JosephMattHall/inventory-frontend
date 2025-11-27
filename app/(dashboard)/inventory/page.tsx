"use client";

import { useState, useMemo, useEffect } from "react";
import { Item, CATEGORIES } from "@/lib/types";
import { Search, Filter, Plus, Minus, Trash2, MapPin, Zap } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get("/items");
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.location?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items, search, selectedCategory]);

    const handleUpdateQuantity = async (id: number, delta: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const newStock = Math.max(0, item.stock + delta);

        try {
            await api.put(`/items/${id}`, { stock: newStock });
            setItems(prev => prev.map(i =>
                i.id === id ? { ...i, stock: newStock } : i
            ));
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await api.delete(`/items/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500"></div>
        </div>;
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-white self-start md:self-center">Inventory</h2>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-xl border ${showFilters ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap gap-2 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 animate-fade-in shrink-0">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === "All" ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-1 pb-10">
                {filteredItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4 border-2 border-dashed border-slate-800 rounded-2xl">
                        <Zap size={48} className="text-slate-700" />
                        <p>No components found.</p>
                        <button
                            onClick={() => router.push('/inventory/new')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-medium rounded-lg transition-colors"
                        >
                            Add Your First Item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredItems.map(item => (
                            <InventoryCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface InventoryCardProps {
    item: Item;
    onUpdateQuantity: (id: number, delta: number) => void;
    onDelete: (id: number) => void;
}


const InventoryCard: React.FC<InventoryCardProps> = ({ item, onUpdateQuantity, onDelete }) => {
    const isLowStock = item.stock <= item.min_stock;

    const imageUrl = item.image_url?.startsWith("/media")
        ? `http://localhost:8000${item.image_url}`
        : item.image_url;

    return (
        <div className={`relative bg-slate-900 rounded-2xl p-5 border transition-all group hover:border-slate-600 ${isLowStock ? 'border-amber-900/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]' : 'border-slate-800 shadow-sm'}`}>
            <Link href={`/inventory/${item.id}`} className="block">
                <div className="flex justify-between items-start mb-3 cursor-pointer">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            {imageUrl && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                                    <Image
                                        src={imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-400 mb-2">
                                    {item.category}
                                </span>
                                <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                                {item.description && (
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col items-end ${isLowStock ? 'text-amber-500' : 'text-emerald-500'}`}>
                        <span className="text-2xl font-bold font-mono">{item.stock}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Count</span>
                    </div>
                </div>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <MapPin size={12} />
                <span>{item.location || 'Unassigned'}</span>
                {isLowStock && (
                    <span className="ml-auto text-amber-500 font-bold flex items-center gap-1">
                        <Zap size={10} /> Low Stock (Min: {item.min_stock})
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-rose-500/20 hover:text-rose-500 text-slate-400 transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-800 mx-1"></div>
                    <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-emerald-500/20 hover:text-emerald-500 text-slate-400 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-600 hover:text-rose-500 transition-colors p-2"
                    title="Delete Item"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

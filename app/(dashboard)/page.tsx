"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

interface Item {
    id: number;
    name: string;
    stock: number;
}

export default function DashboardPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchItems();
    }, []);

    const totalItems = items.length;
    const totalStock = items.reduce((acc, item) => acc + item.stock, 0);
    const lowStockItems = items.filter((item) => item.stock < 5).length;

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Items Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Items</p>
                            <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
                        </div>
                    </div>
                </div>

                {/* Total Stock Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Stock</p>
                            <p className="text-2xl font-semibold text-gray-900">{totalStock}</p>
                        </div>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                            <p className="text-2xl font-semibold text-gray-900">{lowStockItems}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Items or Low Stock List could go here */}
            <div className="rounded-lg bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium text-gray-900">Low Stock Alerts</h2>
                </div>
                <div className="p-6">
                    {items.filter(i => i.stock < 5).length === 0 ? (
                        <p className="text-gray-500">No items are low on stock.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.filter(i => i.stock < 5).map((item) => (
                                <li key={item.id} className="flex justify-between py-3">
                                    <span className="font-medium text-gray-900">{item.name}</span>
                                    <span className="text-red-600 font-medium">{item.stock} left</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Package, AlertTriangle, TrendingUp, BatteryWarning, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Item } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const stats = useMemo(() => {
        const totalItems = items.length;
        const totalQuantity = items.reduce((acc, item) => acc + item.stock, 0);
        const lowStockItems = items.filter(item => item.stock <= item.min_stock);

        const categoryData = items.reduce((acc: any, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        const chartData = Object.keys(categoryData).map(key => ({
            name: key,
            value: categoryData[key]
        })).sort((a, b) => b.value - a.value).slice(0, 5);

        return { totalItems, totalQuantity, lowStockItems, chartData };
    }, [items]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500"></div>
        </div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Workbench Overview</h1>
                <p className="text-slate-400">Welcome back. Here is the state of your inventory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Components"
                    value={stats.totalItems}
                    icon={<Package size={24} className="text-blue-400" />}
                    trend="Unique types"
                />
                <StatCard
                    title="Total Parts"
                    value={stats.totalQuantity}
                    icon={<TrendingUp size={24} className="text-emerald-400" />}
                    trend="Individual units"
                />
                <StatCard
                    title="Low Stock"
                    value={stats.lowStockItems.length}
                    icon={<AlertTriangle size={24} className="text-amber-400" />}
                    trend="Action needed"
                    urgent={stats.lowStockItems.length > 0}
                />
                <div
                    onClick={() => router.push('/inventory/new')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 cursor-pointer transition-all group flex flex-col justify-center items-center text-center gap-2"
                >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="text-slate-900" size={24} />
                    </div>
                    <span className="font-semibold text-emerald-400">Quick Add Item</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Alert Section */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BatteryWarning className="text-amber-500" size={20} />
                        Restock Required
                    </h2>
                    {stats.lowStockItems.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-slate-500 italic">
                            All stock levels are healthy.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-800">
                                        <th className="pb-3 pl-2">Component</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3 text-right">In Stock</th>
                                        <th className="pb-3 text-right">Min</th>
                                        <th className="pb-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {stats.lowStockItems.slice(0, 5).map(item => (
                                        <tr key={item.id} className="group hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 pl-2 font-medium text-slate-200">{item.name}</td>
                                            <td className="py-3 text-slate-400">{item.category}</td>
                                            <td className="py-3 text-right text-rose-400 font-bold">{item.stock}</td>
                                            <td className="py-3 text-right text-slate-500">{item.min_stock}</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-bold">Low</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stats.lowStockItems.length > 5 && (
                                <button
                                    onClick={() => router.push('/inventory')}
                                    className="w-full mt-4 text-center text-sm text-slate-400 hover:text-emerald-400 py-2"
                                >
                                    View {stats.lowStockItems.length - 5} more items...
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Distribution Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Inventory Breakdown</h2>
                    {stats.chartData.length > 0 ? (
                        <>
                            <div className="flex-1 min-h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {stats.chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {stats.chartData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-1 text-xs text-slate-400">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span>{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                            No data to display
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, trend, urgent }: any) => (
    <div className={`rounded-2xl p-6 border transition-all hover:shadow-lg ${urgent
            ? 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/10'
            : 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20'
        }`}>
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${urgent ? 'bg-amber-500/20' : 'bg-slate-800'}`}>
                {icon}
            </div>
        </div>
        <p className={`text-xs ${urgent ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{trend}</p>
    </div>
);

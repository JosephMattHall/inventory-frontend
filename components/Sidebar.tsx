"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, PlusCircle, LogOut, Folder, Users, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useInventory } from "@/context/InventoryContext";
import { useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const { inventories, activeInventory, setActiveInventory } = useInventory();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    const isAdmin = activeInventory?.role === "admin";

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Projects", href: "/projects", icon: Folder },
        { name: "Add Item", href: "/inventory/new", icon: PlusCircle, roles: ["admin"] },
        { name: "Manage Members", href: "/members", icon: Users, roles: ["admin"] },
    ];

    return (
        <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center flex-col justify-center border-b border-gray-800 px-4">
                <h1 className="text-xl font-bold">Maker Manager</h1>
            </div>

            {/* Inventory Switcher */}
            <div className="relative px-4 py-4">
                <button
                    onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                    className="flex w-full items-center justify-between rounded-md bg-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-700"
                >
                    <span className="truncate">{activeInventory ? activeInventory.name : "Select Inventory"}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>

                {isInventoryOpen && (
                    <div className="absolute left-4 right-4 z-10 mt-1 max-h-48 overflow-auto rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {inventories.map((inv) => (
                                <button
                                    key={inv.id}
                                    onClick={() => {
                                        setActiveInventory(inv);
                                        setIsInventoryOpen(false);
                                    }}
                                    className={cn(
                                        "block w-full px-4 py-2 text-left text-sm",
                                        activeInventory?.id === inv.id
                                            ? "bg-gray-700 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    )}
                                >
                                    {inv.name}
                                </button>
                            ))}
                            <Link
                                href="/inventory/create"
                                onClick={() => setIsInventoryOpen(false)}
                                className="block px-4 py-2 text-sm text-blue-400 hover:bg-gray-700"
                            >
                                + Create Inventory
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-1 px-2 py-2">
                {navigation.map((item) => {
                    // Filter based on roles
                    if (item.roles && !item.roles.includes(activeInventory?.role || "")) {
                        return null;
                    }

                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                                isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-6 w-6 flex-shrink-0",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                            {item.name === "Inventory" && activeInventory && (
                                <span className="ml-auto rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {activeInventory.role}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={logout}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    <LogOut
                        className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                        aria-hidden="true"
                    />
                    Logout
                </button>
            </div>
        </div>
    );
}

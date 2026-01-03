"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Inventory, getInventories } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface InventoryContextType {
    inventories: Inventory[];
    activeInventory: Inventory | null;
    setActiveInventory: (inventory: Inventory) => void;
    refreshInventories: () => Promise<void>;
    loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [activeInventory, setActiveInventoryState] = useState<Inventory | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshInventories = useCallback(async () => {
        if (!user) {
            setInventories([]);
            setActiveInventoryState(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getInventories();
            setInventories(data);

            const savedId = localStorage.getItem("activeInventoryId");
            if (savedId) {
                const found = data.find((inv) => inv.id === parseInt(savedId));
                if (found) {
                    setActiveInventoryState(found);
                } else if (data.length > 0) {
                    setActiveInventoryState(data[0]);
                    localStorage.setItem("activeInventoryId", data[0].id.toString());
                }
            } else if (data.length > 0) {
                setActiveInventoryState(data[0]);
                localStorage.setItem("activeInventoryId", data[0].id.toString());
            }
        } catch (error) {
            console.error("Failed to fetch inventories:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshInventories();
    }, [refreshInventories]);

    const setActiveInventory = (inventory: Inventory) => {
        setActiveInventoryState(inventory);
        localStorage.setItem("activeInventoryId", inventory.id.toString());
        // Force reload or update context dependent components
        window.location.reload(); // Simplest way to ensure all API interceptors and hooks pick up the new ID
    };

    return (
        <InventoryContext.Provider
            value={{
                inventories,
                activeInventory,
                setActiveInventory,
                refreshInventories,
                loading,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
}

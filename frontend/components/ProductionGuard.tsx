"use client";
import { useEffect } from 'react';

export default function ProductionGuard() {
    useEffect(() => {
        // Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Allow context menu only on inputs, textareas, code blocks
            const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName);
            const isCode = ['CODE', 'PRE'].includes(target.tagName) || target.closest('pre') || target.closest('code');
            const isContentEditable = target.isContentEditable;

            if (isInput || isCode || isContentEditable || target.classList.contains('allow-select')) {
                return;
            }
            e.preventDefault();
        };

        // Keep it production grade
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return null;
}
import AddDOEntryForm from '@/components/forms/AddDOEntryForm';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddDOEntry() {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create DO Entry</h1>
                </div>
            </div>
            <AddDOEntryForm />
        </div>
    );
}

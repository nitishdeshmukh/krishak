import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

/**
 * Generic EmptyState component for displaying when no records exist
 * @param {Object} props
 * @param {string} props.title - Main message to display
 * @param {string} props.description - Optional description text
 * @param {string} props.buttonText - Text for the action button
 * @param {string} props.addRoute - Route to navigate when "Add" button is clicked
 * @param {Function} props.onAddClick - Optional custom handler instead of routing
 * @param {React.Component} props.icon - Optional custom icon component
 */
export default function EmptyState({
    title = "You haven't added any records yet!",
    description,
    buttonText = "Add a Record",
    addRoute,
    onAddClick,
    icon: Icon = DocumentPlusIcon,
}) {
    const navigate = useNavigate();

    const handleAddClick = () => {
        if (onAddClick) {
            onAddClick();
        } else if (addRoute) {
            navigate(addRoute);
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center h-64 bg-card rounded-xl border">
            <div className="flex flex-col items-center gap-4 max-w-md text-center">
                {/* Icon/Illustration */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                    <div className="relative bg-background border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8">
                        <Icon className="h-16 w-16 text-muted-foreground/50" />
                        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                            <PlusCircleIcon className="h-6 w-6 text-primary-foreground" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <Button
                    onClick={handleAddClick}
                    size="lg"
                    className="mt-2"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}

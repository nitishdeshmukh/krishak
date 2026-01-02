import React from 'react';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserCircleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
    const { user } = useAuth();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (!user) {
        return <div className="p-4">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card className="shadow-lg border-border/50">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserCircleIcon className="h-16 w-16" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                    <CardDescription className="text-lg">{user.email}</CardDescription>
                    <div className="pt-2">
                        <Badge variant="secondary" className="capitalize">
                            {user.role}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">User ID</p>
                            <p className="font-medium">{user.id}</p>
                        </div>
                        {user.permissions && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                                <div className="flex flex-wrap gap-1">
                                    {user.permissions.map((perm) => (
                                        <Badge key={perm} variant="outline" className="text-xs">
                                            {perm}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center pt-6 pb-8 border-t bg-muted/20">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto gap-2">
                                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                                Sign Out
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to sign out of your account? You will need to log in again to access the dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Sign Out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}

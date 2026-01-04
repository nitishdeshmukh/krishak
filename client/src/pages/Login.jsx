import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BuildingOfficeIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useLogin } from '@/hooks/useAuth';

// Validation schema
const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
    const loginMutation = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md shadow-lg border-border/50 relative z-10">
                <CardHeader className="space-y-6 text-center pb-8">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-brand">
                            <BuildingOfficeIcon className="size-8" strokeWidth={2} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-foreground">
                            Krishak Enterprise
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Sign in to continue to your dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter your email"
                                                    className="pl-10 h-11 bg-background"
                                                    autoComplete="username"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    autoComplete="current-password"
                                                    className="pl-10 pr-10 h-11 bg-background"
                                                    {...field}
                                                    style={{
                                                        // Remove browser default password toggle
                                                        msReveal: 'none',
                                                        WebkitTextSecurity: 'none'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? (
                                                        <EyeSlashIcon className="size-5" />
                                                    ) : (
                                                        <EyeIcon className="size-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-brand transition-all mt-6"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
                © 2024 Krishak Enterprise
            </div>
        </div>
    );
}

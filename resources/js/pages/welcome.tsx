import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Check, ChevronRight, Code, Database, Globe, Layers, Lock, Rocket, Shield, Star, Users, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Building2,
            title: 'Multi-Tenant Architecture',
            description: 'Complete tenant isolation with dedicated databases and secure data separation.',
        },
        {
            icon: Users,
            title: 'User Management',
            description: 'Built-in authentication, roles, and permissions with Laravel Spatie.',
        },
        {
            icon: Database,
            title: 'Database Per Tenant',
            description: 'Automatic database provisioning and migration management for each tenant.',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Security-first approach with encrypted data and secure tenant isolation.',
        },
        {
            icon: Zap,
            title: 'Laravel Actions',
            description: 'Clean, testable business logic with Laravel Actions architecture.',
        },
        {
            icon: Globe,
            title: 'Modern Frontend',
            description: 'React + Inertia.js with TypeScript and Tailwind CSS for beautiful UIs.',
        },
    ];

    const techStack = [
        { name: 'Laravel 12', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
        { name: 'React 18', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
        { name: 'TypeScript', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
        { name: 'Inertia.js', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' },
        { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400' },
        { name: 'Shadcn/ui', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
        { name: 'Multi-Tenancy', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
        { name: 'Pest Testing', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    ];

    const steps = [
        {
            number: '01',
            title: 'Sign Up',
            description: 'Create your tenant account and get your dedicated subdomain instantly.',
        },
        {
            number: '02',
            title: 'Configure',
            description: 'Set up your application settings, users, and permissions.',
        },
        {
            number: '03',
            title: 'Launch',
            description: 'Go live with your fully isolated, secure multi-tenant application.',
        },
    ];

    return (
        <>
            <Head title="SaasBee - Multi-Tenant Laravel Boilerplate">
                <meta
                    name="description"
                    content="The most advanced Laravel multi-tenant boilerplate with React, TypeScript, and modern tooling. Build SaaS applications faster."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                {/* Navigation */}
                <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-xl font-bold text-transparent">
                                    SaasBee
                                </span>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={route('dashboard')}>
                                            Dashboard
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" asChild>
                                            <Link href={route('login')}>Log in</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('register-tenant')}>
                                                Start Free Trial
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 sm:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Badge variant="secondary" className="mb-4">
                                <Star className="mr-1 h-3 w-3" />
                                Enterprise-Grade Multi-Tenancy
                            </Badge>

                            <h1 className="mb-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
                                Build SaaS Apps
                                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                                    Lightning Fast
                                </span>
                            </h1>

                            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">
                                The most advanced Laravel multi-tenant boilerplate with React, TypeScript, and modern tooling. Get your SaaS
                                application up and running in minutes, not months.
                            </p>

                            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                                    <Link href={route('register-tenant')}>
                                        <Rocket className="mr-2 h-5 w-5" />
                                        Get Started Free
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                                    <a href="https://github.com/your-repo/saasbee" target="_blank">
                                        <Code className="mr-2 h-5 w-5" />
                                        View on GitHub
                                    </a>
                                </Button>
                            </div>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {techStack.map((tech) => (
                                    <Badge key={tech.name} variant="secondary" className={tech.color}>
                                        {tech.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white/50 py-20 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Everything You Need</h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                                Built with modern technologies and best practices for scalable SaaS applications.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">How It Works</h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                                Get your multi-tenant SaaS application running in three simple steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {steps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="mb-6 flex items-center justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xl font-bold text-white">
                                            {step.number}
                                        </div>
                                        {index < steps.length - 1 && <ChevronRight className="ml-4 hidden h-6 w-6 text-slate-400 md:block" />}
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Architecture Highlights */}
                <section className="bg-slate-50 py-20 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Enterprise-Grade Architecture</h2>
                                <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                                    Built with security, scalability, and maintainability in mind. Every component is carefully chosen and integrated
                                    to provide the best developer experience.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        'Complete tenant isolation with dedicated databases',
                                        'Automatic database migrations and seeding',
                                        'Role-based access control with Spatie Permissions',
                                        'Comprehensive test suite with Pest',
                                        'Modern React components with TypeScript',
                                        'Production-ready with Docker support',
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 opacity-20 blur-3xl"></div>
                                <Card className="relative border-0 bg-white/80 shadow-2xl backdrop-blur dark:bg-slate-900/80">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <Layers className="h-5 w-5 text-orange-600" />
                                            <CardTitle>Tech Stack</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Backend</span>
                                            <Badge>Laravel 12 + PHP 8.2</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span>Frontend</span>
                                            <Badge>React 18 + TypeScript</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span>Bridge</span>
                                            <Badge>Inertia.js</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span>Styling</span>
                                            <Badge>Tailwind + Shadcn/ui</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span>Testing</span>
                                            <Badge>Pest + React Testing</Badge>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span>Multi-Tenancy</span>
                                            <Badge>Stancl Tenancy</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-20">
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Ready to Build Your SaaS?</h2>
                        <p className="mx-auto mb-12 max-w-2xl text-xl text-orange-100">
                            Join thousands of developers who have chosen SaasBee to build their next big thing. Start your free trial today.
                        </p>

                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" asChild>
                                <Link href={route('register-tenant')}>
                                    <Lock className="mr-2 h-5 w-5" />
                                    Start Free Trial
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 px-8 py-6 text-lg text-white hover:bg-white/10" asChild>
                                <a href="https://docs.saasbee.com" target="_blank">
                                    Documentation
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 py-12 dark:bg-slate-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between md:flex-row">
                            <div className="mb-4 flex items-center space-x-2 md:mb-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-xl font-bold text-transparent">
                                    SaasBee
                                </span>
                            </div>

                            <div className="flex items-center space-x-6">
                                <a href="#" className="text-slate-400 transition-colors hover:text-white">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-slate-400 transition-colors hover:text-white">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-slate-400 transition-colors hover:text-white">
                                    Support
                                </a>
                            </div>
                        </div>

                        <Separator className="my-8 bg-slate-800" />

                        <div className="text-center text-slate-400">
                            <p>&copy; 2025 SaasBee. Built with ❤️ using Laravel + React. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

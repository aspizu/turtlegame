import {cn} from "@/lib/utils"
import {ReactNode} from "react"

interface PageLayoutProps {
    children: ReactNode
    className?: string
    containerClassName?: string
    showGradient?: boolean
    centered?: boolean
}

export function PageLayout({
    children,
    className,
    containerClassName,
    showGradient = true,
    centered = true,
}: PageLayoutProps) {
    return (
        <div
            className={cn(
                "min-h-screen p-4",
                showGradient &&
                    "from-background via-secondary/20 to-accent/30 bg-linear-to-br",
                centered && "flex items-center justify-center",
                className,
            )}
        >
            <div className={cn("w-full", containerClassName)}>{children}</div>
        </div>
    )
}

interface PageHeaderProps {
    title: string
    subtitle?: string
    icon?: string
    className?: string
}

export function PageHeader({title, subtitle, icon, className}: PageHeaderProps) {
    return (
        <div className={cn("mb-8 space-y-2 text-center", className)}>
            <h1 className="text-foreground text-4xl font-bold tracking-tight">
                {icon && `${icon} `}
                {title}
            </h1>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
        </div>
    )
}

interface PageCardProps {
    children: ReactNode
    className?: string
}

export function PageCard({children, className}: PageCardProps) {
    return (
        <div
            className={cn(
                "bg-card border-border space-y-6 rounded-xl border p-8 shadow-lg",
                className,
            )}
        >
            {children}
        </div>
    )
}

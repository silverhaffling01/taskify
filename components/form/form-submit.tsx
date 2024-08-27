"use client"

import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


interface FormSubmitProps {
    children: React.ReactNode
    disabled?: boolean
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}


export const FormSubmit = ({ children, disabled, className, variant = 'ghost' }: FormSubmitProps) => {
    const { pending } = useFormStatus()



    return (
        <Button
            type="submit"
            className={cn(className)}
            variant={variant}
            disabled={disabled || pending}
            size={"sm"}
        >
            {children}
        </Button>
    )

}
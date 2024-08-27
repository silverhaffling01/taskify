"use client"
import { ElementRef, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";

interface BoardTitleFormProps{
    data: Board;
}

export const BoardTitleForm = ({data}: BoardTitleFormProps) =>{
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const {execute} = useAction(updateBoard,{
        onSuccess:(data)=>{
            toast.success(`Board "${data.title}" updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError:(err)=>{
            toast.error(err);
        }
    });

    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    }

    const disableEditing = () =>{
        setIsEditing(false);
    }

    const onBlur = () =>{
        formRef.current?.requestSubmit();
    }

    function handleSubmit(formData: FormData){
        const title = formData.get("title") as string;
        execute({
            title,
            id: data.id,
        });
    }


    if(isEditing){
        return (
            <form action={handleSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput ref={inputRef} id="title" onBlur={onBlur} defaultValue={title} className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"/>
            </form>
        )
    }

    return (
        <Button onClick={enableEditing} className="font-bold text-lg h-auto w-auto p-1 px-2" variant={"ghost"}>
            {title}
        </Button>
    )
}
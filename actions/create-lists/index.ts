
"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();
    
    if(!userId || !orgId)
        return {
            error:"Unauthorized",
        };

    const {title, boardId} = data;

    let list;

    try {
        const board = await prisma.board.findUnique({
            where:{
                id: boardId,
                orgId,
            },
        });

        if(!board) return {
            error:"Board not found",
        };

        const lastList = await prisma.list.findFirst({
            where:{
                boardId,
            },
            orderBy:{order:"desc"},
            select:{order:true},
        });

        const newOrder = lastList ? lastList.order +1:1;

        const list = await prisma.list.create({
            data:{
                title,
                boardId,
                order:newOrder,
            },
        });

        await createAuditLog({entityTitle:list.title, entityId:list.id, entityType:ENTITY_TYPE.LIST, action:ACTION.CREATE})

    } catch (error) {
        return {
            error:"Failed to create",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {data: list};
}

export const createList = createSafeAction(CreateList, handler);

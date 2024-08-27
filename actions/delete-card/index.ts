"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId)
        return {
            error:"Unauthorized",
        };

    const {id,boardId} = data;
    let card;


    try {
        card = await prisma.card.delete({
            where:{
                id,
                list:{
                    board:{
                        orgId,
                    },
                },
            },
        });
        await createAuditLog({entityTitle:card.title, entityId:card.id, entityType:ENTITY_TYPE.CARD, action:ACTION.DELETE})

    } catch (error) {
        return {
            error:"Failed to delete",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {data: card}
}

export const deleteCard = createSafeAction(DeleteCard, handler);
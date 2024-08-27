"use server"
import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import  prisma  from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateBoard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ENTITY_TYPE, ACTION } from "@prisma/client"
import { checkSubscription } from "@/lib/subscription"


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }


    const canCreate = true
    const isPro = await checkSubscription()

    if (!canCreate && !isPro) return { error: "You have reached your limit of free boards. Please upgrate your plan" }
    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|")
    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Invalid image"
        }
    }

    let board;

    try {
        board = await prisma.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName,
            }
        })

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE
        })
    } catch (error) {
        return {
            error: "Something went wrong"
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board }
}


export const createBoard = createSafeAction(CreateBoard, handler);
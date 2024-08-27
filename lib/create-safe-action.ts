import { z } from 'zod';

export type FieldErrors<T> = {
    [K in keyof T]?: string[];
}

export type ActionState<Tinput, Toutput> = {
    fieldErrors?: FieldErrors<Tinput>;
    error?: string | null;
    data?: Toutput;
}


export const createSafeAction = <Tinput, Toutput>(schema: z.Schema<Tinput>, handler: (validateData: Tinput) => Promise<ActionState<Tinput, Toutput>>) => {

    return async (data: Tinput): Promise<ActionState<Tinput, Toutput>> => {
        const validationResult = schema.safeParse(data);

        if (!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<Tinput>
            };
        }

        return handler(validationResult.data);
    }
}
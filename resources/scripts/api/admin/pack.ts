import { Model, UUID } from '@/api/admin/index';
import { Egg } from '@/api/admin/egg';
import http, { QueryBuilderParams, withQueryBuilderParams } from '@/api/http';
import { Transformers } from '@definitions/admin';

export interface Pack extends Model {
    id: number;
    uuid: UUID;
    author: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    relationships: {
        eggs?: Egg[];
    };
}

export const searchPacks = async (params: QueryBuilderParams<'name'>): Promise<Pack[]> => {
    const { data } = await http.get('/api/application/packs', {
        params: withQueryBuilderParams(params),
    });

    return data.data.map(Transformers.toPack);
};

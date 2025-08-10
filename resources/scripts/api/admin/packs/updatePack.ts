import http from '@/api/http';
import { Pack, rawDataToPack } from '@/api/admin/packs/getPacks';

export default (id: number, name: string, description: string | null, include: string[] = []): Promise<Pack> => {
    return new Promise((resolve, reject) => {
        http.patch(
            `/api/application/packs/${id}`,
            {
                name,
                description,
            },
            { params: { include: include.join(',') } },
        )
            .then(({ data }) => resolve(rawDataToPack(data)))
            .catch(reject);
    });
};

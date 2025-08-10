import http from '@/api/http';
import { Pack, rawDataToPack } from '@/api/admin/packs/getPacks';

export default (name: string, description: string | null, author: string, include: string[] = []): Promise<Pack> => {
    return new Promise((resolve, reject) => {
        http.post(
            '/api/application/packs',
            {
                name,
                description,
                author,
            },
            { params: { include: include.join(',') } },
        )
            .then(({ data }) => resolve(rawDataToPack(data)))
            .catch(reject);
    });
};

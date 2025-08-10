import http from '@/api/http';
import { Pack, rawDataToPack } from '@/api/admin/packs/getPacks';

export default (id: number, include: string[]): Promise<Pack> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/application/packs/${id}`, { params: { include: include.join(',') } })
            .then(({ data }) => resolve(rawDataToPack(data)))
            .catch(reject);
    });
};

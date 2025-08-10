import { useEffect, useState } from 'react';

import type { Pack } from '@/api/admin/pack';
import { searchPacks } from '@/api/admin/pack';
import Label from '@elements/Label';
import Select from '@elements/Select';

interface Props {
    selectedPackId?: number;
    onPackSelect: (pack: number) => void;
}

export default ({ selectedPackId, onPackSelect }: Props) => {
    const [packs, setPacks] = useState<Pack[] | null>(null);

    useEffect(() => {
        searchPacks({})
            .then(packs => {
                setPacks(packs);
                if (selectedPackId === 0 && packs.length > 0) {
                    // @ts-expect-error go away
                    onPackSelect(packs[0].id);
                }
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <>
            <Label>Pack</Label>
            <Select value={selectedPackId} onChange={e => onPackSelect(Number(e.currentTarget.value))}>
                {!packs ? (
                    <option disabled>Loading...</option>
                ) : (
                    packs?.map(v => (
                        <option key={v.uuid} value={v.id.toString()}>
                            {v.name}
                        </option>
                    ))
                )}
            </Select>
        </>
    );
};

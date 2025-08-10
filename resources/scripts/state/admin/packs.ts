import type { Action } from 'easy-peasy';
import { action } from 'easy-peasy';

interface AdminPackStore {
    selectedPacks: number[];

    setSelectedPacks: Action<AdminPackStore, number[]>;
    appendSelectedPack: Action<AdminPackStore, number>;
    removeSelectedPack: Action<AdminPackStore, number>;
}

const packs: AdminPackStore = {
    selectedPacks: [],

    setSelectedPacks: action((state, payload) => {
        state.selectedPacks = payload;
    }),

    appendSelectedPack: action((state, payload) => {
        state.selectedPacks = state.selectedPacks.filter(id => id !== payload).concat(payload);
    }),

    removeSelectedPack: action((state, payload) => {
        state.selectedPacks = state.selectedPacks.filter(id => id !== payload);
    }),
};

export type { AdminPackStore };
export default packs;

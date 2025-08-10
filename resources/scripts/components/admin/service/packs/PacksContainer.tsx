import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';
import type { Filters } from '@/api/admin/packs/getPacks';
import getPacks, { Context as PacksContext } from '@/api/admin/packs/getPacks';
import AdminContentBlock from '@elements/AdminContentBlock';
import AdminTable, {
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    Pagination,
    Loading,
    NoItems,
    ContentWrapper,
    useTableHooks,
} from '@elements/AdminTable';
import CopyOnClick from '@elements/CopyOnClick';
import NewPackButton from '@admin/service/packs/NewPackButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from '@/state/hooks';

const PacksContainer = () => {
    const { setPage, setFilters, sort, setSort, sortDirection } = useContext(PacksContext);
    const { colors } = useStoreState(state => state.theme.data!);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: packs, error, isValidating } = getPacks();

    useEffect(() => {
        if (!error) {
            clearFlashes('packs');
            return;
        }

        clearAndAddHttpError({ key: 'packs', error });
    }, [error]);

    const length = packs?.items?.length || 0;

    const onSearch = (query: string): Promise<void> => {
        return new Promise(resolve => {
            if (query.length < 2) {
                setFilters(null);
            } else {
                setFilters({ name: query });
            }
            return resolve();
        });
    };

    return (
        <AdminContentBlock title={'Packs'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>Packs</h2>
                    <p
                        css={tw`hidden md:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}
                    >
                        All packs currently available on this system.
                    </p>
                </div>

                <div css={tw`flex ml-auto pl-4`}>
                    <NewPackButton />
                </div>
            </div>

            <FlashMessageRender byKey={'packs'} css={tw`mb-4`} />

            <AdminTable>
                <ContentWrapper onSearch={onSearch}>
                    <Pagination data={packs} onPageSelect={setPage}>
                        <div css={tw`overflow-x-auto`}>
                            <table css={tw`w-full table-auto`}>
                                <TableHead>
                                    <TableHeader
                                        name={'ID'}
                                        direction={sort === 'id' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('id')}
                                    />
                                    <TableHeader
                                        name={'Name'}
                                        direction={sort === 'name' ? (sortDirection ? 1 : 2) : null}
                                        onClick={() => setSort('name')}
                                    />
                                    <TableHeader name={'Description'} />
                                </TableHead>

                                <TableBody>
                                    {packs !== undefined &&
                                        !error &&
                                        !isValidating &&
                                        length > 0 &&
                                        packs.items.map(pack => (
                                            <TableRow key={pack.id}>
                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    <CopyOnClick text={pack.id.toString()}>
                                                        <code css={tw`font-mono bg-neutral-900 rounded py-1 px-2`}>
                                                            {pack.id}
                                                        </code>
                                                    </CopyOnClick>
                                                </td>

                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    <NavLink
                                                        to={`/admin/packs/${pack.id}`}
                                                        style={{ color: colors.primary }}
                                                        className={'hover:brightness-125 duration-300'}
                                                    >
                                                        {pack.name}
                                                    </NavLink>
                                                </td>

                                                <td css={tw`px-6 text-sm text-neutral-200 text-left whitespace-nowrap`}>
                                                    {pack.description}
                                                </td>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </table>

                            {packs === undefined || (error && isValidating) ? (
                                <Loading />
                            ) : length < 1 ? (
                                <NoItems />
                            ) : null}
                        </div>
                    </Pagination>
                </ContentWrapper>
            </AdminTable>
        </AdminContentBlock>
    );
};

export default () => {
    const hooks = useTableHooks<Filters>();

    return (
        <PacksContext.Provider value={hooks}>
            <PacksContainer />
        </PacksContext.Provider>
    );
};

import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';

import FlashMessageRender from '@/components/FlashMessageRender';
import AdminContentBlock from '@elements/AdminContentBlock';
import ServersTable from '@admin/management/servers/ServersTable';
import { Button } from '@elements/button';
import { useTranslation } from 'react-i18next';

function ServersContainer() {
    const { t } = useTranslation('admin');

    return (
        <AdminContentBlock title={t('servers.title', 'Servers') as string}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>{t('servers.title', 'Servers')}</h2>
                    <p
                        css={tw`hidden md:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}
                    >
                        {t('servers.description', 'All servers available on the system.')}
                    </p>
                </div>

                <div css={tw`flex ml-auto pl-4`}>
                    <NavLink to={`/admin/servers/new`}>
                        <Button type={'button'} size={'large'} css={tw`h-10 px-4 py-0 whitespace-nowrap`}>
                            {t('servers.newServer', 'New Server')}
                        </Button>
                    </NavLink>
                </div>
            </div>

            <FlashMessageRender byKey={'servers'} css={tw`mb-4`} />

            <ServersTable />
        </AdminContentBlock>
    );
}

export default ServersContainer;

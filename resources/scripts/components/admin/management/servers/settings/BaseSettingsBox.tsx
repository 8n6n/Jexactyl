import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import type { ReactNode } from 'react';
import tw from 'twin.macro';

import { useServerFromRoute } from '@/api/admin/server';
import AdminBox from '@elements/AdminBox';
import OwnerSelect from '@admin/management/servers/OwnerSelect';
import Field from '@elements/Field';
import { useTranslation } from 'react-i18next';

export default ({ children }: { children?: ReactNode }) => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faCogs} title={t('servers.settings', 'Settings') as string} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field
                    id={'name'}
                    name={'name'}
                    label={t('servers.serverName', 'Server Name') as string}
                    type={'text'}
                    placeholder={t('servers.serverNamePlaceholder', 'My Amazing Server') as string}
                />
                <Field id={'externalId'} name={'externalId'} label={t('servers.externalId', 'External Identifier') as string} type={'text'} />
                <OwnerSelect selected={server?.relationships.user} />
                {children}
            </div>
        </AdminBox>
    );
};

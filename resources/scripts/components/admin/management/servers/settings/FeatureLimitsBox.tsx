import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@elements/AdminBox';
import Field from '@elements/Field';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faConciergeBell} title={t('servers.featureLimits', 'Feature Limits') as string} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field
                    id={'featureLimits.allocations'}
                    name={'featureLimits.allocations'}
                    label={t('servers.allocationLimit', 'Allocation Limit') as string}
                    type={'number'}
                    description={t('servers.allocationLimitDesc', 'The total number of allocations a user is allowed to create for this server.') as string}
                />
                <Field
                    id={'featureLimits.backups'}
                    name={'featureLimits.backups'}
                    label={t('servers.backupLimit', 'Backup Limit') as string}
                    type={'number'}
                    description={t('servers.backupLimitDesc', 'The total number of backups that can be created for this server.') as string}
                />
                <Field
                    id={'featureLimits.databases'}
                    name={'featureLimits.databases'}
                    label={t('servers.databaseLimit', 'Database Limit') as string}
                    type={'number'}
                    description={t('servers.databaseLimitDesc', 'The total number of databases a user is allowed to create for this server.') as string}
                />
                <Field
                    id={'featureLimits.subusers'}
                    name={'featureLimits.subusers'}
                    label={t('servers.subuserLimit', 'Subuser Limit') as string}
                    type={'number'}
                    description={t('servers.subuserLimitDesc', 'The total number of subusers that can be added to this server.') as string}
                />
            </div>
        </AdminBox>
    );
};

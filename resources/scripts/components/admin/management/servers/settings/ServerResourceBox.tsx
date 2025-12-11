import { faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@elements/AdminBox';
import Field from '@elements/Field';
import FormikSwitch from '@elements/FormikSwitch';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faBalanceScale} title={t('servers.resources', 'Resources') as string} isLoading={isSubmitting}>
            <div css={tw`grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6`}>
                <Field
                    id={'limits.cpu'}
                    name={'limits.cpu'}
                    label={t('servers.cpuLimit', 'CPU Limit') as string}
                    type={'text'}
                    description={t('servers.cpuLimitDesc', 'Each thread on the system is considered to be 100%. Setting this value to 0 will allow the server to use CPU time without restriction.') as string}
                />
                <Field
                    id={'limits.threads'}
                    name={'limits.threads'}
                    label={t('servers.cpuPinning', 'CPU Pinning') as string}
                    type={'text'}
                    description={t('servers.cpuPinningDesc', 'Advanced: Enter the specific CPU cores that this server can run on, or leave blank to allow all cores. This can be a single number, and or a comma seperated list, and or a dashed range. Example: 0, 0-1,3, or 0,1,3,4. It is recommended to leave this value blank and let the CPU handle balancing the load.') as string}
                />
                <Field
                    id={'limits.memory'}
                    name={'limits.memory'}
                    label={t('servers.memoryLimit', 'Memory Limit') as string}
                    type={'number'}
                    description={t('servers.memoryLimitDesc', 'The maximum amount of memory allowed for this container. Setting this to 0 will allow unlimited memory in a container.') as string}
                />
                <Field id={'limits.swap'} name={'limits.swap'} label={t('servers.swapLimit', 'Swap Limit') as string} type={'number'} />
                <Field
                    id={'limits.disk'}
                    name={'limits.disk'}
                    label={t('servers.diskLimit', 'Disk Limit') as string}
                    type={'number'}
                    description={t('servers.diskLimitDesc', 'This server will not be allowed to boot if it is using more than this amount of space. If a server goes over this limit while running it will be safely stopped and locked until enough space is available. Set to 0 to allow unlimited disk usage.') as string}
                />
                <Field
                    id={'limits.io'}
                    name={'limits.io'}
                    label={t('servers.blockIO', 'Block IO Proportion') as string}
                    type={'number'}
                    description={t('servers.blockIODesc', 'Advanced: The IO performance of this server relative to other running containers on the system. Value should be between 10 and 1000.') as string}
                />
                <div css={tw`xl:col-span-2 bg-neutral-800 border border-neutral-900 shadow-inner p-4 rounded`}>
                    <FormikSwitch
                        name={'limits.oomKiller'}
                        label={t('servers.oomKiller', 'Out of Memory Killer') as string}
                        description={t('servers.oomKillerDesc', 'Enabling the Out of Memory Killer may cause server processes to exit unexpectedly.') as string}
                    />
                </div>
            </div>
        </AdminBox>
    );
};

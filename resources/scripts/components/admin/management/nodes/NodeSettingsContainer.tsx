import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { Field as FormikField, useFormikContext } from 'formik';
import tw from 'twin.macro';

import type { Node } from '@/api/admin/nodes/getNodes';
import AdminBox from '@elements/AdminBox';
import DatabaseSelect from '@admin/management/nodes/DatabaseSelect';
import Label from '@elements/Label';
import Field from '@elements/Field';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { useTranslation } from 'react-i18next';

export default function NodeSettingsContainer({ node }: { node?: Node }) {
    const { t } = useTranslation('admin');
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faDatabase} title={t('nodes.settings', 'Settings') as string} css={tw`w-full relative`}>
            <SpinnerOverlay visible={isSubmitting} />

            <div css={tw`mb-6`}>
                <Field id={'name'} name={'name'} label={t('common:name', 'Name') as string} type={'text'} />
            </div>

            <div css={tw`mb-6`}>
                <DatabaseSelect selected={node?.databaseHostId || null} />
            </div>

            <div css={tw`mb-6`}>
                <Field id={'fqdn'} name={'fqdn'} label={'FQDN'} type={'text'} />
            </div>

            <div css={tw`mb-6`}>
                <Field
                    id={'daemonBase'}
                    name={'daemonBase'}
                    label={t('nodes.dataDirectory', 'Data Directory') as string}
                    type={'text'}
                    disabled={node !== undefined}
                />
            </div>

            <div css={tw`mt-6`}>
                <Label htmlFor={'scheme'}>SSL</Label>

                <div>
                    <label css={tw`inline-flex items-center mr-2`}>
                        <FormikField name={'scheme'} type={'radio'} value={'https'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:enabled', 'Enabled')}</span>
                    </label>

                    <label css={tw`inline-flex items-center ml-2`}>
                        <FormikField name={'scheme'} type={'radio'} value={'http'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:disabled', 'Disabled')}</span>
                    </label>
                </div>
            </div>

            <div css={tw`mt-6`}>
                <Label htmlFor={'behindProxy'}>{t('nodes.behindProxy', 'Behind Proxy')}</Label>

                <div>
                    <label css={tw`inline-flex items-center mr-2`}>
                        <FormikField name={'behindProxy'} type={'radio'} value={'false'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:no', 'No')}</span>
                    </label>

                    <label css={tw`inline-flex items-center ml-2`}>
                        <FormikField name={'behindProxy'} type={'radio'} value={'true'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:yes', 'Yes')}</span>
                    </label>
                </div>
            </div>

            <div css={tw`mt-6`}>
                <Label htmlFor={'public'}>{t('nodes.automaticAllocation', 'Automatic Allocation')}</Label>

                <div>
                    <label css={tw`inline-flex items-center mr-2`}>
                        <FormikField name={'public'} type={'radio'} value={'false'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:disabled', 'Disabled')}</span>
                    </label>

                    <label css={tw`inline-flex items-center ml-2`}>
                        <FormikField name={'public'} type={'radio'} value={'true'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:enabled', 'Enabled')}</span>
                    </label>
                </div>
            </div>
        </AdminBox>
    );
}

import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { Field as FormikField, useFormikContext } from 'formik';
import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import Label from '@elements/Label';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faCashRegister} title={t('nodes.billingConfiguration', 'Billing Configuration') as string} css={tw`w-full relative`}>
            <SpinnerOverlay visible={isSubmitting} />
            <div>
                <Label htmlFor={'deployable'}>{t('nodes.deployablePaid', 'Deployable for paid servers')}</Label>
                <div>
                    <label css={tw`inline-flex items-center mr-2`}>
                        <FormikField name={'deployable'} type={'radio'} value={'true'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:enabled', 'Enabled')}</span>
                    </label>

                    <label css={tw`inline-flex items-center ml-2`}>
                        <FormikField name={'deployable'} type={'radio'} value={'false'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:disabled', 'Disabled')}</span>
                    </label>
                </div>
                <p className={'text-sm text-gray-400 mt-1'}>
                    {t('nodes.deployablePaidDesc', 'Allows users to deploy servers to this node via the Billing system if it is enabled.')}
                </p>
            </div>
            <div className={'mt-6'}>
                <Label htmlFor={'deployableFree'}>{t('nodes.deployableFree', 'Deployable for free servers')}</Label>
                <div>
                    <label css={tw`inline-flex items-center mr-2`}>
                        <FormikField name={'deployableFree'} type={'radio'} value={'true'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:enabled', 'Enabled')}</span>
                    </label>

                    <label css={tw`inline-flex items-center ml-2`}>
                        <FormikField name={'deployableFree'} type={'radio'} value={'false'} />
                        <span css={tw`text-neutral-300 ml-2`}>{t('common:disabled', 'Disabled')}</span>
                    </label>
                </div>
                <p className={'text-sm text-gray-400 mt-1'}>
                    {t('nodes.deployableFreeDesc', 'Allows users to deploy free servers to this node via the billing system.')}
                </p>
            </div>
        </AdminBox>
    );
};

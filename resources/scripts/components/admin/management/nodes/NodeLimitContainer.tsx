import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { useFormikContext } from 'formik';
import tw from 'twin.macro';

import AdminBox from '@elements/AdminBox';
import Field from '@elements/Field';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { isSubmitting } = useFormikContext();

    return (
        <AdminBox icon={faMicrochip} title={t('nodes.limits', 'Limits') as string} css={tw`w-full relative`}>
            <SpinnerOverlay visible={isSubmitting} />

            <div css={tw`md:w-full md:flex md:flex-row mb-6`}>
                <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mb-6 md:mb-0`}>
                    <Field id={'memory'} name={'memory'} label={t('nodes.memory', 'Memory') as string} type={'number'} />
                </div>

                <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mb-6 md:mb-0`}>
                    <Field
                        id={'memoryOverallocate'}
                        name={'memoryOverallocate'}
                        label={t('nodes.memoryOverallocate', 'Memory Overallocate') as string}
                        type={'number'}
                    />
                </div>
            </div>

            <div css={tw`md:w-full md:flex md:flex-row mb-6`}>
                <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mb-6 md:mb-0`}>
                    <Field id={'disk'} name={'disk'} label={t('nodes.disk', 'Disk') as string} type={'number'} />
                </div>

                <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mb-6 md:mb-0`}>
                    <Field
                        id={'diskOverallocate'}
                        name={'diskOverallocate'}
                        label={t('nodes.diskOverallocate', 'Disk Overallocate') as string}
                        type={'number'}
                    />
                </div>
            </div>
        </AdminBox>
    );
};

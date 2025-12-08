import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import FormikFieldWrapper from '@elements/FormikFieldWrapper';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import tw from 'twin.macro';
import { Button } from '@elements/button';
import Input, { Textarea } from '@elements/Input';
import styled from 'styled-components';
import { useFlashKey } from '@/plugins/useFlash';
import { createSSHKey, useSSHKeys } from '@/api/account/ssh-keys';
import { useTranslation } from 'react-i18next';

interface Values {
    name: string;
    publicKey: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32`}
`;

export default () => {
    const { t } = useTranslation('dashboard');
    const { t: tc } = useTranslation('common');
    const { clearAndAddHttpError } = useFlashKey('account');
    const { mutate } = useSSHKeys();

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearAndAddHttpError();

        createSSHKey(values.name, values.publicKey)
            .then(key => {
                resetForm();
                mutate(data => (data || []).concat(key));
            })
            .catch(error => clearAndAddHttpError(error))
            .then(() => setSubmitting(false));
    };

    return (
        <>
            <Formik
                onSubmit={submit}
                initialValues={{ name: '', publicKey: '' }}
                validationSchema={object().shape({
                    name: string().required(),
                    publicKey: string().required(),
                })}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <SpinnerOverlay visible={isSubmitting} />
                        <FormikFieldWrapper label={t('ssh.keyName') as string} name={'name'} css={tw`mb-6`}>
                            <Field name={'name'} as={Input} />
                        </FormikFieldWrapper>
                        <FormikFieldWrapper
                            label={t('ssh.publicKey') as string}
                            name={'publicKey'}
                            description={t('ssh.publicKeyDescription') as string}
                        >
                            <Field name={'publicKey'} as={CustomTextarea} />
                        </FormikFieldWrapper>
                        <div css={tw`flex justify-end mt-6`}>
                            <Button>{tc('save')}</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

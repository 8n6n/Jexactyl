import { useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import FormikFieldWrapper from '@elements/FormikFieldWrapper';
import { createApiKey } from '@/api/account/api-keys';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { type ApiKey } from '@definitions/user';
import tw from 'twin.macro';
import { Button } from '@elements/button';
import Input, { Textarea } from '@elements/Input';
import styled from 'styled-components';
import ApiKeyModal from '@/components/dashboard/ApiKeyModal';
import { useTranslation } from 'react-i18next';

interface Values {
    description: string;
    allowedIps: string;
}

const CustomTextarea = styled(Textarea)`
    ${tw`h-32`}
`;

export default ({ onKeyCreated }: { onKeyCreated: (key: ApiKey) => void }) => {
    const { t } = useTranslation('dashboard');
    const { t: tc } = useTranslation('common');
    const [apiKey, setApiKey] = useState('');
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes('account');
        createApiKey(values.description, values.allowedIps)
            .then(({ secretToken, ...key }) => {
                resetForm();
                setSubmitting(false);
                setApiKey(`${key.identifier}${secretToken}`);
                onKeyCreated(key);
            })
            .catch(error => {
                console.error(error);

                addError({ key: 'account', message: httpErrorToHuman(error) });
                setSubmitting(false);
            });
    };

    return (
        <>
            <ApiKeyModal visible={apiKey.length > 0} onModalDismissed={() => setApiKey('')} apiKey={apiKey} />
            <Formik
                onSubmit={submit}
                initialValues={{ description: '', allowedIps: '' }}
                validationSchema={object().shape({
                    allowedIps: string(),
                    description: string().required().min(4),
                })}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <SpinnerOverlay visible={isSubmitting} />
                        <FormikFieldWrapper
                            label={tc('description') as string}
                            name={'description'}
                            description={t('api.descriptionHelp') as string}
                            css={tw`mb-6`}
                        >
                            <Field name={'description'} as={Input} />
                        </FormikFieldWrapper>
                        <FormikFieldWrapper
                            label={t('api.allowedIps') as string}
                            name={'allowedIps'}
                            description={t('api.allowedIpsDescription') as string}
                        >
                            <Field name={'allowedIps'} as={CustomTextarea} />
                        </FormikFieldWrapper>
                        <div css={tw`flex justify-end mt-6`}>
                            <Button>{tc('create')}</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

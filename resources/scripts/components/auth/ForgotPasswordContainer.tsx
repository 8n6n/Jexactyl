import { useStoreState } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reaptcha from 'reaptcha';
import tw from 'twin.macro';
import { object, string } from 'yup';
import { requestPasswordReset } from '@/api/auth/password-reset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Button } from '@elements/button';
import Field from '@elements/Field';
import useFlash from '@/plugins/useFlash';
import { useTranslation } from 'react-i18next';

interface Values {
    email: string;
    code: string;
    password: string;
    password_confirm: string;
}

function ForgotPasswordContainer() {
    const { t } = useTranslation('auth');
    const { t: tc } = useTranslation('common');
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState(state => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = (
        { email, code, password, password_confirm }: Values,
        { setSubmitting, resetForm }: FormikHelpers<Values>,
    ) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch(error => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: tc('error'), message: httpErrorToHuman(error) });
            });

            return;
        }

        requestPasswordReset(email, code, password, password_confirm, token)
            .then(response => {
                resetForm();
                addFlash({ type: 'success', title: tc('success'), message: response });
            })
            .catch(error => {
                console.error(error);
                addFlash({ type: 'error', title: tc('error'), message: httpErrorToHuman(error) });
            })
            .then(() => {
                setToken('');
                if (ref.current !== null) {
                    void ref.current.reset();
                }

                setSubmitting(false);
            });
    };

    return (
        <Formik
            onSubmit={handleSubmission}
            initialValues={{ email: '', code: '', password: '', password_confirm: '' }}
            validationSchema={object().shape({
                email: string()
                    .email(t('emailRequired') as string)
                    .required(t('emailRequired') as string),
                code: string().required(t('recoveryCodeRequired') as string),
                password: string().min(8).required(),
                password_confirm: string().min(8).required(),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={t('resetPassword') as string} css={tw`w-full flex`}>
                    <Field
                        label={tc('email') as string}
                        description={t('emailDescription') as string}
                        name={'email'}
                        type={'email'}
                    />
                    <div className={'mt-6'}>
                        <Field
                            label={t('recoveryCode') as string}
                            description={t('recoveryCodeDescription') as string}
                            name={'code'}
                            type={'text'}
                        />
                    </div>
                    <div className={'my-6'}>
                        <Field
                            label={tc('newPassword') as string}
                            description={t('newPasswordDescription') as string}
                            name={'password'}
                            type={'password'}
                        />
                    </div>
                    <Field
                        label={t('confirmNewPassword') as string}
                        description={t('confirmNewPasswordDescription') as string}
                        name={'password_confirm'}
                        type={'password'}
                    />
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} className={'w-full'} size={Button.Sizes.Large} disabled={isSubmitting}>
                            {t('attemptLogin')}
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={response => {
                                setToken(response);
                                void submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-300 tracking-wide no-underline uppercase font-medium hover:text-neutral-600`}
                        >
                            {t('returnToLogin')}
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
}

export default ForgotPasswordContainer;

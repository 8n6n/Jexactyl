import { useStoreState } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Reaptcha from 'reaptcha';
import tw from 'twin.macro';
import { object, ref as yupRef, string } from 'yup';
import { requestPasswordReset } from '@/api/auth/password-reset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Button } from '@elements/button/index';
import Field from '@elements/Field';
import useFlash from '@/plugins/useFlash';

interface Values {
    email: string;
    code: string;
    password: string;
    password_confirm: string;
}

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { t } = useTranslation('auth');
    const { t: tc } = useTranslation('common');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState(state => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = (
        { email, code, password, password_confirm }: Values,
        { setSubmitting, resetForm }: FormikHelpers<Values>
    ) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch(error => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: tc('error') as string, message: httpErrorToHuman(error) });
            });

            return;
        }

        requestPasswordReset(email, code, password, password_confirm, token)
            .then(response => {
                resetForm();
                addFlash({ type: 'success', title: tc('success') as string, message: response });
            })
            .catch(error => {
                console.error(error);
                addFlash({ type: 'error', title: tc('error') as string, message: httpErrorToHuman(error) });
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
        <LoginFormContainer title={t('resetPasswordPage.title')} css={tw`w-full flex`}>
            <Formik
                onSubmit={handleSubmission}
                initialValues={{ email: '', code: '', password: '', password_confirm: '' }}
                validationSchema={object().shape({
                    email: string()
                        .email(t('validation.emailRequired') as unknown as string)
                        .required(t('validation.emailRequired') as unknown as string),
                    code: string().required(t('validation.recoveryCodeRequired') as unknown as string),
                    password: string().min(8).required(t('validation.passwordRequired') as unknown as string),
                    password_confirm: string()
                        .min(8)
                        .required(t('validation.passwordRequired') as unknown as string)
                        .oneOf([yupRef('password')], t('password.confirmMismatch', 'Password confirmation does not match.') as unknown as string),
                })}
            >
                {({ isSubmitting, isValid, submitForm, setSubmitting }) => (
                    <Form className={'mt-4'}>
                        <Field
                            light
                            label={t('resetPasswordPage.email') as unknown as string}
                            description={t('resetPasswordPage.desc') as unknown as string}
                            name={'email'}
                            type={'email'}
                        />
                        <div css={tw`mt-6`}>
                            <Field
                                light
                                label={t('recoveryCode') as unknown as string}
                                description={t('recoveryCodeDescription') as unknown as string}
                                name={'code'}
                                type={'text'}
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Field
                                light
                                label={tc('password') as unknown as string}
                                description={t('newPasswordDescription') as unknown as string}
                                name={'password'}
                                type={'password'}
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Field
                                light
                                label={t('confirmNewPassword') as unknown as string}
                                description={t('confirmNewPasswordDescription') as unknown as string}
                                name={'password_confirm'}
                                type={'password'}
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Button type={'submit'} disabled={isSubmitting || !isValid}>
                                {t('resetPasswordPage.button', 'Reset Password')}
                            </Button>
                        </div>
                        {recaptchaEnabled && (
                            <Reaptcha
                                ref={ref}
                                size={'invisible'}
                                sitekey={siteKey || '_invalid_key'}
                                onVerify={response => {
                                    setToken(response);
                                    submitForm();
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
                                css={tw`text-xs text-neutral-500 tracking-wide uppercase no-underline hover:text-neutral-700`}
                            >
                                {t('resetPasswordPage.back')}
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </LoginFormContainer>
    );
};

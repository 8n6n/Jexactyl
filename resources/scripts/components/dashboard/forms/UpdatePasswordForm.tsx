import { Fragment } from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@elements/Field';
import * as Yup from 'yup';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { updateAccountPassword } from '@/api/account';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@elements/button/index';
import { useTranslation } from 'react-i18next';

interface Values {
    current: string;
    password: string;
    confirmPassword: string;
}

export default () => {
    const { t } = useTranslation('dashboard');
    const { t: tc } = useTranslation('common');
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const schema = Yup.object().shape({
        current: Yup.string().min(1).required(t('password.currentRequired') as string),
        password: Yup.string().min(8).required(),
        confirmPassword: Yup.string().test(
            'password',
            t('password.confirmMismatch') as string,
            function (value) {
                return value === this.parent.password;
            },
        ),
    });

    if (!user) {
        return null;
    }

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:password');
        updateAccountPassword({ ...values })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/auth/login';
            })
            .catch(error =>
                addFlash({
                    key: 'account:password',
                    type: 'error',
                    title: tc('error'),
                    message: httpErrorToHuman(error),
                }),
            )
            .then(() => setSubmitting(false));
    };

    return (
        <Fragment>
            <Formik
                onSubmit={submit}
                validationSchema={schema}
                initialValues={{ current: '', password: '', confirmPassword: '' }}
            >
                {({ isSubmitting, isValid }) => (
                    <Fragment>
                        <SpinnerOverlay size={'large'} visible={isSubmitting} />
                        <Form css={tw`m-0`}>
                            <Field
                                id={'current_password'}
                                type={'password'}
                                name={'current'}
                                label={t('password.currentPassword') as string}
                            />
                            <div css={tw`mt-6`}>
                                <Field
                                    id={'new_password'}
                                    type={'password'}
                                    name={'password'}
                                    label={tc('newPassword') as string}
                                    description={t('password.newPasswordDescription') as string}
                                />
                            </div>
                            <div css={tw`mt-6`}>
                                <Field
                                    id={'confirm_new_password'}
                                    type={'password'}
                                    name={'confirmPassword'}
                                    label={t('password.confirmNewPassword') as string}
                                />
                            </div>
                            <div css={tw`mt-6`}>
                                <Button disabled={isSubmitting || !isValid}>{t('password.updatePassword')}</Button>
                            </div>
                        </Form>
                    </Fragment>
                )}
            </Formik>
        </Fragment>
    );
};

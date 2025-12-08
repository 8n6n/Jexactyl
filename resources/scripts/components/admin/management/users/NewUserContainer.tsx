import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import type { UpdateUserValues } from '@/api/admin/users';
import { createUser } from '@/api/admin/users';
import AdminContentBlock from '@elements/AdminContentBlock';
import UserForm from '@admin/management/users/view/UserForm';
import FlashMessageRender from '@/components/FlashMessageRender';
import type { ApplicationStore } from '@/state';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const submit = (values: UpdateUserValues, { setSubmitting }: FormikHelpers<UpdateUserValues>) => {
        clearFlashes('user:create');

        createUser(values)
            .then(user => navigate(`/admin/users/${user.id}`))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'user:create', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <AdminContentBlock title={t('users.newUser', 'New User') as string}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>{t('users.newUser', 'New User')}</h2>
                    <p
                        css={tw`hidden md:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}
                    >
                        {t('users.addNewUser', 'Add a new user to the panel.')}
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'user:create'} css={tw`mb-4`} />

            <UserForm title={t('users.createUser', 'Create User') as string} onSubmit={submit} />
        </AdminContentBlock>
    );
};

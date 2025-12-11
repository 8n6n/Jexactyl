import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import { Context } from '../UserRouter';
import { deleteUser } from '@/api/admin/users';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const navigate = useNavigate();
    const { clearAndAddHttpError } = useFlash();
    const [visible, setVisible] = useState<boolean>(false);
    const user = Context.useStoreState(state => state.user!.id);

    const submit = () => {
        deleteUser(user)
            .then(() => {
                navigate('/admin/users');
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'user:manage', error });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('users.confirmDeletion', 'Confirm deletion request') as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('users.deleteConfirmText', 'Are you sure you wish to delete this user? They will not be able to access the Panel anymore!')}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox icon={faUserSlash} title={t('users.deleteUser', 'Delete User') as string} css={tw`relative w-full`}>
                    <Button.Danger size={Button.Sizes.Large} css={tw`w-full`} onClick={() => setVisible(true)}>
                        {t('users.deleteUser', 'Delete User')}
                    </Button.Danger>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('users.deleteUserDesc', "This will remove the user's account, meaning they will not be able to access the Panel.")}
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

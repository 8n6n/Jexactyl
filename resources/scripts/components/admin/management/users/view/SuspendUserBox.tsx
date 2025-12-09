import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import { Context } from '../UserRouter';
import { suspendUser } from '@/api/admin/users';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { addFlash, clearAndAddHttpError } = useFlash();
    const [visible, setVisible] = useState<boolean>(false);
    const user = Context.useStoreState(state => state.user);

    const action = user?.state === 'suspended' ? 'unsuspend' : 'suspend';

    const submit = () => {
        suspendUser(user!.id)
            .then(() => {
                addFlash({
                    key: 'user:manage',
                    type: 'success',
                    message: t('users.suspendSuccess', 'This user has been suspended.'),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'user:manage',
                    error: error,
                });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('users.confirmAction', `Confirm ${action} request`, { action }) as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('users.confirmActionText', `Are you sure you wish to ${action} this user?`, { action })}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox
                    icon={action === 'suspend' ? faEyeSlash : faEye}
                    title={`${action === 'suspend' ? t('users.suspend', 'Suspend') : t('users.unsuspend', 'Unsuspend')} ${t('users.user', 'User')}`}
                    css={tw`relative w-full`}
                >
                    <Button.Warn size={Button.Sizes.Large} css={tw`w-full capitalize`} onClick={() => setVisible(true)}>
                        {action === 'suspend' ? t('users.suspend', 'Suspend') : t('users.unsuspend', 'Unsuspend')} {t('users.user', 'User')}
                    </Button.Warn>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('users.suspendDesc', `This will ${action} the user instantly. This account is currently`, { action })}&nbsp;
                        {user?.state === 'suspended' ? t('common:suspended', 'suspended') : t('common:active', 'active')}.
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

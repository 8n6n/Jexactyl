import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import { useServerFromRoute } from '@/api/admin/server';
import useFlash from '@/plugins/useFlash';
import unsuspendServer from '@/api/admin/servers/manage/unsuspendServer';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const [visible, setVisible] = useState<boolean>(false);
    const { addFlash, clearAndAddHttpError } = useFlash();

    if (!server) return null;

    const submit = () => {
        unsuspendServer(server.id)
            .then(() => {
                addFlash({
                    key: 'server:manage',
                    type: 'success',
                    message: t('servers.unsuspendSuccess', 'Your server is now unsuspended.'),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'server:manage',
                    error: `${t('servers.unsuspendFailed', 'Failed to unsuspend server')}: ${error.message}`,
                });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('servers.confirmUnsuspend', 'Confirm suspension removal') as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('servers.unsuspendWarning', 'Are you sure you wish to unsuspend this server? Users will now be able to reconnect as usual.')}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox icon={faEye} title={t('servers.unsuspendServer', 'Unsuspend Server') as string} css={tw`relative w-full`}>
                    <Button.Warn size={Button.Sizes.Large} css={tw`w-full`} onClick={() => setVisible(true)}>
                        {t('servers.unsuspendServer', 'Unsuspend Server')}
                    </Button.Warn>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('servers.unsuspendDesc', 'This action will allow users to access the server like normal.')}
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

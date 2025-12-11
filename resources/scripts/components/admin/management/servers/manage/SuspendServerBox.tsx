import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import { useServerFromRoute } from '@/api/admin/server';
import useFlash from '@/plugins/useFlash';
import suspendServer from '@/api/admin/servers/manage/suspendServer';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const [visible, setVisible] = useState<boolean>(false);
    const { addFlash, clearAndAddHttpError } = useFlash();

    if (!server) return null;

    const submit = () => {
        suspendServer(server.id)
            .then(() => {
                addFlash({
                    key: 'server:manage',
                    type: 'success',
                    message: t('servers.suspendSuccess', 'Your server is now suspended.'),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'server:manage',
                    error: `${t('servers.suspendFailed', 'Failed to suspend server')}: ${error.message}`,
                });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('servers.confirmSuspend', 'Confirm suspension request') as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('servers.suspendWarning', 'Are you sure you wish to suspend this server? It will become instantly inaccessible to the owner.')}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox icon={faEyeSlash} title={t('servers.suspendServer', 'Suspend Server') as string} css={tw`relative w-full`}>
                    <Button.Warn size={Button.Sizes.Large} css={tw`w-full`} onClick={() => setVisible(true)}>
                        {t('servers.suspendServer', 'Suspend Server')}
                    </Button.Warn>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('servers.suspendServerDesc', 'This will suspend the server, stop any running processes, and immediately block the user from being able to manage their server through the panel.')}
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

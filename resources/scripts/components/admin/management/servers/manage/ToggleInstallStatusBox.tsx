import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import { useServerFromRoute } from '@/api/admin/server';
import useFlash from '@/plugins/useFlash';
import toggleInstallStatus from '@/api/admin/servers/manage/toggleInstallStatus';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const [visible, setVisible] = useState<boolean>(false);
    const { addFlash, clearAndAddHttpError } = useFlash();

    if (!server) return null;

    const submit = () => {
        toggleInstallStatus(server.id)
            .then(() => {
                addFlash({
                    key: 'server:manage',
                    type: 'success',
                    message: t('servers.installToggleSuccess', "This server's install state has been toggled."),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'server:manage',
                    error: `${t('servers.installToggleFailed', 'Failed to change server install state')}: ${error.message}`,
                });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('servers.confirmInstallToggle', 'Confirm install status change') as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('servers.installToggleWarning', 'Are you sure you wish to change the install status of this server?')}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox icon={faDownload} title={t('servers.installStatus', 'Install Status') as string} css={tw`relative w-full`}>
                    <Button.Info size={Button.Sizes.Large} css={tw`w-full`} onClick={() => setVisible(true)}>
                        {t('servers.setServerAs', 'Set Server as')} {server.status === 'installing' ? t('common:active', 'Active') : t('servers.installing', 'Installing')}
                    </Button.Info>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('servers.installToggleDesc', 'Change the server from being in an installed state to uninstalled, or vice versa. Your server is currently marked as')}&nbsp;
                        <span className={'text-blue-400'}>
                            {server.status === 'installing' ? t('servers.installing', 'installing') : t('common:active', 'active')}
                        </span>
                        .
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

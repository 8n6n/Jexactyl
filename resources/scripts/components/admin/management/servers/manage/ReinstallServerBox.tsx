import tw from 'twin.macro';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@elements/dialog';
import { useState } from 'react';
import reinstallServer from '@/api/admin/servers/manage/reinstallServer';
import { useServerFromRoute } from '@/api/admin/server';
import useFlash from '@/plugins/useFlash';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const [visible, setVisible] = useState<boolean>(false);
    const { addFlash, clearAndAddHttpError } = useFlash();

    if (!server) return null;

    const submit = () => {
        reinstallServer(server.id)
            .then(() => {
                addFlash({
                    key: 'server:manage',
                    type: 'success',
                    message: t('servers.reinstallSuccess', 'This server will begin the reinstallation process now.'),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'server:manage',
                    error: `${t('servers.reinstallFailed', 'Failed to reinstall server')}: ${error.message}`,
                });
            });

        setVisible(false);
    };

    return (
        <>
            <Dialog.Confirm
                title={t('servers.confirmReinstall', 'Confirm server reinstallation') as string}
                onConfirmed={submit}
                open={visible}
                onClose={() => setVisible(false)}
                confirm={t('users.confirmProceed', 'I understand, proceed') as string}
            >
                {t('servers.reinstallWarning', 'Are you sure you wish to reinstall this server now? This could lead to a loss of data or files becoming corrupted by the install process.')}
            </Dialog.Confirm>
            <div css={tw`h-auto flex flex-col`}>
                <AdminBox icon={faWrench} title={t('servers.reinstallServer', 'Reinstall Server') as string} css={tw`relative w-full`}>
                    <Button.Danger size={Button.Sizes.Large} css={tw`w-full`} onClick={() => setVisible(true)}>
                        {t('servers.reinstallServer', 'Reinstall Server')}
                    </Button.Danger>
                    <p css={tw`text-xs text-neutral-400 mt-2`}>
                        {t('servers.reinstallDesc', 'This will reinstall the server with the assigned service scripts.')}
                        <br />
                        <FontAwesomeIcon icon={faExclamationTriangle} className={'mr-1 text-red-500'} />
                        {t('servers.overwriteWarning', 'This could overwrite server data.')}
                    </p>
                </AdminBox>
            </div>
        </>
    );
};

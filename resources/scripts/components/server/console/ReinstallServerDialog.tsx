import { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { reinstallServer } from '@/api/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { Button } from '@elements/button/index';
import { Dialog } from '@elements/dialog';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('server');
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const [modalVisible, setModalVisible] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: t('settings.reinstallConfirm.success', 'Your server has begun the reinstallation process.'),
                });
            })
            .catch(error => {
                console.error(error);

                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => setModalVisible(false));
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <>
            <Dialog.Confirm
                open={modalVisible}
                title={t('settings.reinstallConfirm.title', 'Confirm server reinstallation') as string}
                confirm={t('settings.reinstallConfirm.button', 'Yes, reinstall server') as string}
                onClose={() => setModalVisible(false)}
                onConfirmed={reinstall}
            >
                <div css={tw`text-sm rounded-lg p-4 bg-yellow-500/25 mb-4`}>
                    {t('settings.reinstallConfirm.message', 'Reinstalling your server will stop it, and then re-run the installation script that initially set it up.')}&nbsp;
                    <strong css={tw`font-medium`}>
                        {t('settings.reinstallConfirm.warning', 'Some files may be deleted or modified during this process, please back up your data before continuing.')}
                    </strong>
                </div>
                {t('settings.reinstallConfirm.confirm', 'Your server will be stopped and some files may be deleted or modified during this process, are you sure you wish to continue?')}
            </Dialog.Confirm>
            <Button.Danger type={'button'} variant={Button.Variants.Secondary} onClick={() => setModalVisible(true)}>
                {t('settings.reinstall', 'Reinstall Server')}
            </Button.Danger>
        </>
    );
};

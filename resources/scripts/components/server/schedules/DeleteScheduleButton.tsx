import { useState } from 'react';
import { deleteSchedule } from '@/api/server/schedules';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { Button } from '@elements/button/index';
import { Dialog } from '@elements/dialog';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { useTranslation } from 'react-i18next';

interface Props {
    scheduleId: number;
    onDeleted: () => void;
}

export default ({ scheduleId, onDeleted }: Props) => {
    const { t } = useTranslation('server');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const onDelete = () => {
        setIsLoading(true);
        clearFlashes('schedules');
        deleteSchedule(uuid, scheduleId)
            .then(() => {
                setIsLoading(false);
                onDeleted();
            })
            .catch(error => {
                console.error(error);

                addError({ key: 'schedules', message: httpErrorToHuman(error) });
                setIsLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <Dialog.Confirm
                open={visible}
                onClose={() => setVisible(false)}
                title={t('schedules.deleteSchedule') as string}
                confirm={t('schedules.delete') as string}
                onConfirmed={onDelete}
            >
                <SpinnerOverlay visible={isLoading} />
                {t('schedules.deleteScheduleConfirm')}
            </Dialog.Confirm>
            <Button.Danger
                variant={Button.Variants.Secondary}
                className={'mr-4 flex-1 border-transparent sm:flex-none'}
                onClick={() => setVisible(true)}
            >
                {t('schedules.delete')}
            </Button.Danger>
        </>
    );
};

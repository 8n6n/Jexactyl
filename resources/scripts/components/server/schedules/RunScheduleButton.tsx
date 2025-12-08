import { useCallback, useState } from 'react';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { Button } from '@elements/button/index';
import { triggerSchedule } from '@/api/server/schedules';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import { type Schedule } from '@/api/definitions/server';
import { useTranslation } from 'react-i18next';

const RunScheduleButton = ({ schedule }: { schedule: Schedule }) => {
    const { t } = useTranslation('server');
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const id = ServerContext.useStoreState(state => state.server.data!.id);
    const appendSchedule = ServerContext.useStoreActions(actions => actions.schedules.appendSchedule);

    const onTriggerExecute = useCallback(() => {
        clearFlashes('schedule');
        setLoading(true);
        triggerSchedule(id, schedule.id)
            .then(() => {
                setLoading(false);
                appendSchedule({ ...schedule, isProcessing: true });
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ error, key: 'schedules' });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <>
            <SpinnerOverlay visible={loading} size={'large'} />
            <Button
                variant={Button.Variants.Secondary}
                className={'flex-1 sm:flex-none'}
                disabled={schedule.isProcessing}
                onClick={onTriggerExecute}
            >
                {t('schedules.runNow')}
            </Button>
        </>
    );
};

export default RunScheduleButton;

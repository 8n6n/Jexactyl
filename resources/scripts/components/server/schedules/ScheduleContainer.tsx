import { useEffect, useState } from 'react';
import { getSchedules } from '@/api/server/schedules';
import { ServerContext } from '@/state/server';
import Spinner from '@elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import ScheduleRow from '@/components/server/schedules/ScheduleRow';
import { httpErrorToHuman } from '@/api/http';
import EditScheduleModal from '@/components/server/schedules/EditScheduleModal';
import Can from '@elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import { Button } from '@elements/button/index';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { useTranslation } from 'react-i18next';

function ScheduleContainer() {
    const { t } = useTranslation('server');
    const server = ServerContext.useStoreState(state => state.server.data!);
    const { clearFlashes, addError } = useFlash();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    const schedules = ServerContext.useStoreState(state => state.schedules.data);
    const setSchedules = ServerContext.useStoreActions(actions => actions.schedules.setSchedules);

    useEffect(() => {
        clearFlashes('schedules');

        getSchedules(server.uuid)
            .then(schedules => setSchedules(schedules))
            .catch(error => {
                addError({ message: httpErrorToHuman(error), key: 'schedules' });
                console.error(error);
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <PageContentBlock title={t('schedules.title') as string} header description={t('schedules.description') as string}>
            <FlashMessageRender byKey={'schedules'} css={tw`mb-4`} />
            {!schedules.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <>
                    {schedules.length === 0 ? (
                        <p css={tw`text-sm text-center text-neutral-300`}>
                            {t('schedules.noSchedules')}
                        </p>
                    ) : (
                        schedules.map(schedule => (
                            <ScheduleRow
                                key={schedule.id}
                                schedule={schedule}
                                to={`/server/${server.id}/schedules/${schedule.id}`}
                            />
                        ))
                    )}
                    <Can action={'schedule.create'}>
                        <div css={tw`mt-8 flex justify-end`}>
                            <EditScheduleModal visible={visible} onModalDismissed={() => setVisible(false)} />
                            <Button type={'button'} onClick={() => setVisible(true)}>
                                {t('schedules.createNew')}
                            </Button>
                        </div>
                    </Can>
                </>
            )}
        </PageContentBlock>
    );
}

export default ScheduleContainer;

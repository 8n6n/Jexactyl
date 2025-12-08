import AdminContentBlock from '@elements/AdminContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import { useEffect, useState } from 'react';
import { ActivityLogFilters, useActivityLogs } from '@/api/admin/activity';
import { useFlashKey } from '@/plugins/useFlash';
import { Link } from 'react-router-dom';
import PaginationFooter from '@elements/table/PaginationFooter';
import { DesktopComputerIcon, XCircleIcon } from '@heroicons/react/solid';
import Spinner from '@elements/Spinner';
import { styles as btnStyles } from '@elements/button/index';
import classNames from 'classnames';
import ActivityLogEntry from '@elements/activity/ActivityLogEntry';
import Tooltip from '@elements/tooltip/Tooltip';
import useLocationHash from '@/plugins/useLocationHash';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { hash } = useLocationHash();
    const { clearAndAddHttpError } = useFlashKey('account');
    const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, sorts: { timestamp: -1 } });
    const { data, isValidating, error } = useActivityLogs(filters, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setFilters(value => ({ ...value, filters: { ip: hash.ip, event: hash.event } }));
    }, [hash]);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <AdminContentBlock title={t('activity.title', 'Admin Activity') as string}>
            <FlashMessageRender byKey={'admin:activity'} className={'mb-4'} />
            <div className={'w-full flex flex-row items-center mb-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>{t('activity.title', 'Admin Activity')}</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        {t('activity.description', 'Get detailed insights into what actions administrators are performing.')}
                    </p>
                </div>
            </div>
            {(filters.filters?.event || filters.filters?.ip) && (
                <div className={'mb-2 flex justify-end'}>
                    <Link
                        to={'#'}
                        className={classNames(btnStyles.button, btnStyles.text, 'w-full sm:w-auto')}
                        onClick={() => setFilters(value => ({ ...value, filters: {} }))}
                    >
                        {t('activity.clearFilters', 'Clear Filters')} <XCircleIcon className={'ml-2 h-4 w-4'} />
                    </Link>
                </div>
            )}
            {isValidating ? (
                <Spinner centered />
            ) : (
                <div className={'bg-slate-700'}>
                    {data ? (
                        <>
                            {data?.items.map(activity => (
                                <ActivityLogEntry key={activity.id} activity={activity}>
                                    {typeof activity.properties.useragent === 'string' && (
                                        <Tooltip content={activity.properties.useragent} placement={'top'}>
                                            <span>
                                                <DesktopComputerIcon />
                                            </span>
                                        </Tooltip>
                                    )}
                                </ActivityLogEntry>
                            ))}
                        </>
                    ) : (
                        <p className={'text-center text-white'}>{t('activity.noLogs', 'There are no admin logs available at this time.')}</p>
                    )}
                </div>
            )}
            {data && (
                <PaginationFooter
                    pagination={data.pagination}
                    onPageSelect={page => setFilters(value => ({ ...value, page }))}
                />
            )}
        </AdminContentBlock>
    );
};

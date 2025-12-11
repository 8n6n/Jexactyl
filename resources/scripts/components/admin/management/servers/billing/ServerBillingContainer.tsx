import { useServerFromRoute } from '@/api/admin/server';
import OrdersTable from '@/components/admin/modules/billing/orders/OrdersTable';
import AdminBox from '@/components/elements/AdminBox';
import { Alert } from '@/components/elements/alert';
import Label from '@/components/elements/Label';
import Spinner from '@/components/elements/Spinner';
import { useStoreState } from '@/state/hooks';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import EditServerBillingDialog from './EditServerBillingDialog';
import { useTranslation } from 'react-i18next';

function timeUntil(targetDate: Date | string) {
    const date = targetDate instanceof Date ? targetDate : new Date(targetDate);

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    return {
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    };
}

export default () => {
    const { t } = useTranslation('admin');
    const { data: server } = useServerFromRoute();
    const billing = useStoreState(state => state.everest.data!.billing);

    if (!server) return null;

    const product = server.relationships.product;

    return (
        <div>
            {!billing.enabled && (
                <Alert type={'danger'}>
                    {t('servers.billingDisabledWarning', 'The Billing Module is currently disabled. Any changes made here will not have effect unless the module is enabled again.')}
                </Alert>
            )}
            <div className={'mt-4 grid lg:grid-cols-4 gap-4'}>
                <AdminBox title={t('servers.billingDetails', 'Billing Details') as string} icon={faCashRegister} className={'relative'}>
                    <div className={'grid gap-y-4'}>
                        <div>
                            <Label>{t('servers.planNameCost', 'Plan Name and Cost')}</Label>
                            <p className={'text-gray-400'}>
                                {!server.billingProductId ? (
                                    t('common:none', 'None')
                                ) : !product ? (
                                    <Spinner size={'small'} centered />
                                ) : (
                                    <>
                                        {product.name} - {billing.currency.symbol}
                                        {product.price} {billing.currency.code.toUpperCase()} {t('servers.every30Days', 'every 30 days')}
                                    </>
                                )}
                            </p>
                        </div>
                        <div>
                            <Label>{t('servers.nextRenewalDue', 'Next Renewal Due')}</Label>
                            <p className={'text-gray-400'}>
                                {!server.renewalDate ? (
                                    t('common:none', 'None')
                                ) : (
                                    <>
                                        {new Date(server.renewalDate).toLocaleDateString()}
                                        {' - '}
                                        {timeUntil(server.renewalDate).days} {t('servers.days', 'days')}, {timeUntil(server.renewalDate).hours}{' '}
                                        {t('servers.hours', 'hours')}
                                    </>
                                )}
                            </p>
                        </div>
                        <div>
                            <Label>{t('servers.resourceLimits', 'Resource Limits')}</Label>
                            <p className={'text-gray-400'}>
                                {!server.billingProductId ? (
                                    t('common:none', 'None')
                                ) : !product ? (
                                    <Spinner size={'small'} centered />
                                ) : (
                                    <>
                                        {product.limits.cpu}% CPU &bull; {product.limits.memory / 1024} GiB RAM &bull;{' '}
                                        {product.limits.disk / 1024} GiB {t('servers.storage', 'Storage')}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className={'absolute top-2 right-2'}>
                            <EditServerBillingDialog server={server} />
                        </div>
                    </div>
                </AdminBox>
                <div className={'lg:col-span-3'}>
                    <OrdersTable minimal name={server.uuid.slice(0, 8)} />
                </div>
            </div>
        </div>
    );
};

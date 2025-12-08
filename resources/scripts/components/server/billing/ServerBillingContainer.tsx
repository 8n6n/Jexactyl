import { useEffect, useState } from 'react';
import Label from '@elements/Label';
import { Link } from 'react-router-dom';
import ContentBox from '@elements/ContentBox';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useFlash from '@/plugins/useFlash';
import { getProduct } from '@/api/billing/products';
import { Product } from '@/api/billing/products';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { Alert } from '@elements/alert';
import PaymentContainer from './PaymentContainer';
import { useStoreState } from '@/state/hooks';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { format } from 'date-fns';
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

function addDays(date: Date | string, days: number) {
    const d = date instanceof Date ? new Date(date) : new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export default () => {
    const { t } = useTranslation('server');
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState<boolean>(true);

    const { clearFlashes } = useFlash();
    const settings = useStoreState(s => s.everest.data!.billing);
    const billingProductId = ServerContext.useStoreState(s => s.server.data!.billingProductId);
    const renewalDate = ServerContext.useStoreState(s => s.server.data!.renewalDate);

    useEffect(() => {
        clearFlashes();

        if (billingProductId) {
            getProduct(billingProductId)
                .then(data => setProduct(data))
                .then(() => setLoading(false))
                .catch(error => {
                    setLoading(false);
                    console.error(error);
                });
        }
    }, []);

    return (
        <PageContentBlock
            title={t('billing.title') as string}
            header
            description={t('billing.description') as string}
        >
            {!product && !loading && (
                <Alert type={'warning'} className={'mb-6'}>
                    {t('billing.productNotExist')}
                </Alert>
            )}
            <div className={'grid lg:grid-cols-3 gap-4'}>
                {!renewalDate ? (
                    <Alert type={'warning'}>{t('billing.noRenewalDate')}</Alert>
                ) : (
                    <ContentBox title={t('billing.summary') as string}>
                        <SpinnerOverlay visible={loading} />
                        <div>
                            <Label>{t('billing.nextRenewal')}</Label>
                            <p className={'text-gray-400 text-sm'}>
                                {new Date(renewalDate).toLocaleDateString()}
                                {' - '}
                                {timeUntil(renewalDate).days} {t('billing.days')}, {timeUntil(renewalDate).hours} {t('billing.hours')}
                            </p>
                        </div>
                        <div className={'my-6'}>
                            <Label>{t('billing.yourPackage')}</Label>
                            <p className={'text-gray-400 text-sm'}>{product ? product.name : t('billing.unknown')}</p>
                            <p className={'text-gray-500 text-xs'}>{product && product.description}</p>
                        </div>
                        <div>
                            <Label>{t('billing.planCost')}</Label>
                            <div className={'flex justify-between'}>
                                <p className={'text-gray-400 text-sm'}>
                                    {settings.currency.symbol}
                                    {product ? product.price : '...'} {settings.currency.code.toUpperCase()} {t('billing.every30Days')}
                                </p>
                                <Link to={'/account/billing/orders'} className={'text-green-400 text-xs'}>
                                    {t('billing.viewOrder')} <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        </div>
                    </ContentBox>
                )}
                <ContentBox title={t('billing.renewServer') as string} className={'lg:col-span-2'}>
                    <div className={'mb-4'}>
                        <p className={'text-gray-400 text-xs'}>
                            {t('billing.renewDescription')}
                            <strong className={'ml-1'}>
                                {renewalDate ? format(addDays(renewalDate, 30), 'do MMMM yyyy') : t('billing.unknown')}
                            </strong>
                            .
                        </p>
                    </div>
                    {!product ? (
                        <Alert type={'danger'}>
                            {t('billing.productNoLongerExists')}
                        </Alert>
                    ) : (
                        <>
                            {product.price === 0 ? (
                                <>{t('billing.cannotRenewFree')}</>
                            ) : (
                                <PaymentContainer id={Number(product.id)} />
                            )}
                        </>
                    )}
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};

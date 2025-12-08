import { useLocation, useNavigate } from 'react-router-dom';
import { useStoreState } from '@/state/hooks';
import PageContentBlock from '@elements/PageContentBlock';
import { useEffect } from 'react';
import processOrder from '@/api/billing/processOrder';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import Spinner from '@elements/Spinner';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('billing');
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const { colors } = useStoreState(s => s.theme.data!);
    const { addFlash, clearFlashes } = useFlash();

    const intent = params.get('payment_intent');

    useEffect(() => {
        clearFlashes();

        const renewal = Boolean(params.get('renewal'));

        if (!intent) {
            addFlash({
                key: 'billing:process',
                type: 'error',
                message: t('orderFulfillError') as string,
            });

            return;
        }

        processOrder(intent, renewal)
            .then(() => {
                navigate('/account/billing/success');
            })
            .catch(() => {
                navigate('/account/billing/cancel');
            });
    }, []);

    return (
        <PageContentBlock>
            <div className={'flex justify-center'}>
                <div
                    className={'w-full sm:w-3/4 md:w-1/2 p-12 rounded-lg shadow-lg text-center relative'}
                    style={{ backgroundColor: colors.secondary }}
                >
                    <FlashMessageRender byKey={'billing:process'} className={'mb-6'} />
                    <h2 className={'text-white font-bold text-4xl'}>
                        {t('processingOrder')} <Spinner centered />
                    </h2>
                    <p className={'text-sm text-neutral-200 mt-2'}>
                        {t('processingOrderDescription')}
                    </p>
                    <p className={'text-2xs text-neutral-400 mt-8'}>{t('session')} {intent ?? t('unknown')}</p>
                </div>
            </div>
        </PageContentBlock>
    );
};

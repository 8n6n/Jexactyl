import AdminContentBlock from '@elements/AdminContentBlock';
import OrdersTable from './OrdersTable';
import TitledGreyBox from '@elements/TitledGreyBox';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    return (
        <AdminContentBlock title={t('billingOrders.title', 'Billing Orders') as string}>
            <div className={'w-full flex flex-row items-center p-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>{t('billingOrders.orders', 'Orders')}</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        {t('billingOrders.description', 'A list of the orders placed on this Panel.')}
                    </p>
                </div>
            </div>
            <TitledGreyBox icon={faExclamationTriangle} title={t('billingOrders.importantInfo', 'Important Information') as string} className={'mb-8'}>
                {t('billingOrders.importantInfoText', 'Pending orders are automatically set to expired and deleted after 7 days, making them no longer visible in the admin area. If you wish to remove billing orders from Jexactyl manually, you must make a database query to do so. Removing orders manually is not recommended.')}
            </TitledGreyBox>
            <OrdersTable />
        </AdminContentBlock>
    );
};

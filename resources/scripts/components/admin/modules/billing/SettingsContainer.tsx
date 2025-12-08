import { useState } from 'react';
import AdminBox from '@elements/AdminBox';
import { Button } from '@elements/button';
import ToggleFeatureButton from './ToggleFeatureButton';
import { faDollar, faExchange, faKey, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useStoreActions, useStoreState } from '@/state/hooks';
import { faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import SetupPayPal from './guides/SetupPayPal';
import SetupLink from './guides/SetupLink';
import Label from '@elements/Label';
import Select from '@elements/Select';
import currencyDictionary from '@/assets/currency';
import SetupStripe from './guides/SetupStripe';
import ExportConfigButton from './config/ExportConfigButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import ImportConfigButton from './config/ImportConfigButton';
import { deleteStripeKeys, updateSettings } from '@/api/admin/billing';
import { useTranslation } from 'react-i18next';

export type BillingSetupDialog = 'paypal' | 'link' | 'setup' | 'none';

export default () => {
    const { t } = useTranslation('admin');
    const settings = useStoreState(s => s.everest.data!.billing);
    const updateEverest = useStoreActions(s => s.everest.updateEverest);
    const [open, setOpen] = useState<BillingSetupDialog>('none');

    const submit = async (key: string, value: boolean | string) => {
        await updateSettings(key, value).then(() => {
            updateEverest({ billing: { ...settings, [key]: value } });
        });
    };

    const handleCurrencyChange = async (event: any) => {
        const code: string = event.target.value.toUpperCase();
        const symbol: string = currencyDictionary[code]!.symbol;

        submit('currency:code', code).then(() => {
            submit('currency:symbol', symbol);
        });
    };

    const onDeleteKeys = () => {
        deleteStripeKeys()
            .then(() => window.location.reload())
            .catch(error => console.log(error));
    };

    return (
        <div className={'grid lg:grid-cols-3 gap-4'}>
            {open === 'paypal' && <SetupPayPal setOpen={setOpen} />}
            {open === 'link' && <SetupLink setOpen={setOpen} />}
            {open === 'setup' && <SetupStripe extOpen />}
            <AdminBox title={t('billingSettings.addPaypal', 'Add PayPal integration') as string} icon={faPaypal}>
                {t('billingSettings.paypalDescription', 'Adding PayPal to Jexactyl allows users to purchase products via another channel, improving order success rate and global payment availability.')}
                <p className={'text-gray-400 mt-2'}>
                    {t('billingSettings.paypalStatus', 'PayPal module is currently')}{' '}
                    <span className={settings.paypal ? 'text-green-500' : 'text-red-500'}>
                        {settings.paypal ? t('common:enabled', 'enabled') : t('common:disabled', 'disabled')}
                    </span>
                    .
                </p>
                <div className={'text-right mt-2'}>
                    {settings.paypal && (
                        <Button.Text
                            className={'mr-2'}
                            onClick={() => setOpen('paypal')}
                            variant={Button.Variants.Secondary}
                        >
                            {t('billingSettings.setupInstructions', 'Setup Instructions')}
                        </Button.Text>
                    )}
                    <Button.Text onClick={() => submit('paypal', !settings.paypal)}>
                        {settings.paypal ? t('common:disable', 'Disable') : t('common:enable', 'Enable')}
                    </Button.Text>
                </div>
            </AdminBox>
            <AdminBox title={t('billingSettings.addLink', 'Add Link integration') as string} icon={faStripe}>
                {t('billingSettings.linkDescription', 'Adding Link to Jexactyl allows users to purchase products via another channel, improving order success rate and global payment availability.')}
                <p className={'text-gray-400 mt-2'}>
                    {t('billingSettings.linkStatus', 'Link module is currently')}{' '}
                    <span className={settings.link ? 'text-green-500' : 'text-red-500'}>
                        {settings.link ? t('common:enabled', 'enabled') : t('common:disabled', 'disabled')}
                    </span>
                    .
                </p>
                <div className={'text-right mt-2'}>
                    {settings.link && (
                        <Button.Text
                            className={'mr-2'}
                            onClick={() => setOpen('link')}
                            variant={Button.Variants.Secondary}
                        >
                            {t('billingSettings.setupInstructions', 'Setup Instructions')}
                        </Button.Text>
                    )}
                    <Button.Text onClick={() => submit('link', !settings.link)}>
                        {settings.link ? t('common:disable', 'Disable') : t('common:enable', 'Enable')}
                    </Button.Text>
                </div>
            </AdminBox>
            <AdminBox title={t('billingSettings.primaryCurrency', 'Primary Currency') as string} icon={faDollar}>
                {t('billingSettings.currencyDescription', 'Choose a primary currency to charge users.')}
                <div className={'mt-4'}>
                    <Label>{t('billingSettings.currencyLabel', 'Currency Code / Name')}</Label>
                    <Select onChange={handleCurrencyChange}>
                        {Object.keys(currencyDictionary).map(code => (
                            <option
                                key={code}
                                value={code}
                                onChange={() => console.log('hello')}
                                selected={code === settings.currency.code.toUpperCase()}
                            >
                                {code} - {currencyDictionary[code]!.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </AdminBox>
            <AdminBox title={t('billingSettings.importExport', 'Import/Export Configuration') as string} icon={faExchange}>
                <FlashMessageRender byKey={'billing:config'} className={'mb-2'} />
                {t('billingSettings.importExportDescription', 'Use the below options to either export your current billing configurations, or use the Import button to import a pre-created set of categories and products to Jexactyl.')}
                <div className={'text-right mt-3'}>
                    <ExportConfigButton />
                    <ImportConfigButton />
                </div>
            </AdminBox>
            {!settings.keys.publishable || !settings.keys.secret ? (
                <AdminBox title={t('billingSettings.inputStripeKeys', 'Input Stripe API Keys') as string} icon={faKey}>
                    {t('billingSettings.stripeKeysMissing', 'Without Stripe API authentication, your billing system will not work. Customers may proceed to the checkout area but will be met with errors unless you add valid API keys which can be obtained through the Stripe dashboard.')}
                    <div className={'text-right mt-3'}>
                        <Button onClick={() => setOpen('setup')}>{t('billingSettings.addApiKeys', 'Add API keys')}</Button>
                    </div>
                </AdminBox>
            ) : (
                <AdminBox title={t('billingSettings.resetStripeKeys', 'Reset Stripe API keys') as string} icon={faKey}>
                    {t('billingSettings.resetKeysWarning', 'By resetting the Stripe API keys saved to the panel, all billing services (such as purchasing or renewing a product) will stop working until new API keys are entered. Are you sure you wish to continue?')}
                    <div className={'text-right mt-3'}>
                        <Button.Danger onClick={onDeleteKeys}>{t('billingSettings.deleteApiKeys', 'Yes, delete API keys')}</Button.Danger>
                    </div>
                </AdminBox>
            )}
            <AdminBox title={t('billingSettings.disableBilling', 'Disable Billing Module') as string} icon={faPowerOff}>
                {t('billingSettings.disableBillingWarning', 'Clicking the button below will disable all modules of the billing system - such as subscriptions, server purchasing and more. Make sure that this will not impact your users before disabling.')}
                <div className={'text-right mt-3'}>
                    <ToggleFeatureButton />
                </div>
            </AdminBox>
        </div>
    );
};

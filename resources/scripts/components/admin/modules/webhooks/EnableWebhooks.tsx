import { useStoreState } from '@/state/hooks';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import FeatureContainer from '@elements/FeatureContainer';
import ToggleWebhooksButton from './ToggleWebhooksButton';
import WebhookSvg from '@/assets/images/themed/WebhookSvg';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const primary = useStoreState(state => state.theme.data!.colors.primary);

    return (
        <FeatureContainer image={<WebhookSvg color={primary} />} icon={faExternalLink} title={t('webhooks.title', 'Webhooks') as string}>
            {t('webhooks.description', "Jexactyl's webhook system can send live updates directly to a URL of your choice - perfect for integration with platforms like Discord™, Slack™ and more. Set what you want to monitor, and a webhook will be sent whenever that event has been triggered. Simple!")}
            <p className={'text-right'}>
                <ToggleWebhooksButton />
            </p>
        </FeatureContainer>
    );
};

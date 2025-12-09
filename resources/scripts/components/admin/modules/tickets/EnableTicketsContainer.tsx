import { useStoreState } from '@/state/hooks';
import SupportSvg from '@/assets/images/themed/SupportSvg';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import FeatureContainer from '@elements/FeatureContainer';
import ToggleTicketsButton from '@admin/modules/tickets/ToggleTicketsButton';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const primary = useStoreState(state => state.theme.data!.colors.primary);

    return (
        <FeatureContainer image={<SupportSvg color={primary} />} icon={faTicket} title={t('tickets.system', 'Ticket System') as string}>
            {t('tickets.systemDescription', "Jexactyl's ticket interface allows your users to create tickets for support on the panel. Users can create, update and view tickets which admins can reply to and mark as a certain status. This feature can be toggled at anytime to suit your business' needs.")}
            <p className={'text-right'}>
                <ToggleTicketsButton />
            </p>
        </FeatureContainer>
    );
};

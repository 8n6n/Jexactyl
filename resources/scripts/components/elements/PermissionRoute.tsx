import type { ReactNode } from 'react';

import { ServerError } from '@elements/ScreenBlock';
import { usePermissions } from '@/plugins/usePermissions';
import { useTranslation } from 'react-i18next';

interface Props {
    children?: ReactNode;

    permission?: string | string[];
}

function PermissionRoute({ children, permission }: Props): JSX.Element {
    const { t } = useTranslation('common');

    if (permission === undefined) {
        return <>{children}</>;
    }

    const can = usePermissions(permission);

    if (can.filter(p => p).length > 0) {
        return <>{children}</>;
    }

    return <ServerError title={t('accessDenied', 'Access Denied')} message={t('noPermission', 'You do not have permission to access this page.')} />;
}

export default PermissionRoute;

import { Dialog } from '@elements/dialog';
import { VisibleDialog } from './LinksContainer';
import { deleteLink } from '@/api/admin/links';
import { Dispatch, SetStateAction } from 'react';
import Spinner from '@elements/Spinner';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';

export default ({ id, setOpen }: { id?: number; setOpen: Dispatch<SetStateAction<VisibleDialog>> }) => {
    const { t } = useTranslation('admin');
    if (!id) return <Spinner centered />;

    const onSubmit = () => {
        deleteLink(id).then(() => {
            setOpen('none');
            mutate(['links']);
        });
    };

    return (
        <Dialog.Confirm
            confirm={t('common:delete', 'Delete') as string}
            onConfirmed={onSubmit}
            open
            onClose={() => setOpen('none')}
            title={t('links.deleteLink', 'Delete custom link') as string}
        >
            <div className={'mt-2'}>
                {t('links.deleteLinkWarning', 'Are you sure you wish to delete this custom link? Users will no longer be able to use it.')}
            </div>
        </Dialog.Confirm>
    );
};

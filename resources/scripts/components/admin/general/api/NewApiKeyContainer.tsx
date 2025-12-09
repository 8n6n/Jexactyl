import type { Actions } from 'easy-peasy';
import { useStoreActions } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import Field from '@elements/Field';
import tw from 'twin.macro';
import { Button } from '@elements/button';
import FlashMessageRender from '@/components/FlashMessageRender';
import type { ApplicationStore } from '@/state';
import type { Values } from '@/api/admin/api/createApiKey';
import createApiKey from '@/api/admin/api/createApiKey';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { faCog, faElevator } from '@fortawesome/free-solid-svg-icons';
import AdminBox from '@elements/AdminBox';
import PermissionRow from '@admin/general/api/PermissionRow';
import { useStoreState } from '@/state/hooks';
import { useState } from 'react';
import { Dialog } from '@/components/elements/dialog';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { Link } from 'react-router-dom';
import { XIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

const initialValues: Values = {
    memo: 'Your API Key',
    permissions: {
        r_allocations: '0',
        r_database_hosts: '0',
        r_eggs: '0',
        r_locations: '0',
        r_nests: '0',
        r_nodes: '0',
        r_server_databases: '0',
        r_servers: '0',
        r_users: '0',
    },
};

export default () => {
    const { t } = useTranslation('admin');
    const [visible, setVisible] = useState<string | null>();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );
    const { secondary } = useStoreState(state => state.theme.data!.colors);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('api:create');

        createApiKey(values)
            .then(token => setVisible(token))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'api:create', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <>
            <div css={tw`flex ml-auto pl-4 mb-2`}>
                <Link to={'/admin/api'}>
                    <Button.Text icon={XIcon}>{t('common:cancel', 'Cancel')}</Button.Text>
                </Link>
            </div>
            <FlashMessageRender byKey={'api:create'} />
            {visible && (
                <Dialog open={Boolean(visible)} onClose={() => setVisible(null)} title={t('api.yourApiKey', 'Your API Key') as string}>
                    {t('api.keyWarning', 'Do not lose this key, it is impossible to recover. Click the key below to copy it.')}
                    <CopyOnClick text={visible}>
                        <div className={'px-4 py-2 bg-black/50 rounded-lg mt-1 font-mono'}>
                            {visible.slice(0, 48) ?? ''}...
                        </div>
                    </CopyOnClick>
                </Dialog>
            )}

            <Formik
                onSubmit={submit}
                initialValues={initialValues}
            /*
                validationSchema={object().shape({
                    memo: string().required().max(191).min(3),
                    permissions: array().of(
                        object().shape({
                            allocations: number().required(),
                            database_hosts: number().required(),
                            eggs: number().required(),
                            locations: number().required(),
                            nests: number().required(),
                            nodes: number().required(),
                            server_databases: number().required(),
                            servers: number().required(),
                            users: number().required(),
                        }),
                    ),
                })}
            */
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        <div css={tw`flex flex-col lg:flex-row`}>
                            <div css={tw`w-full lg:w-1/2 flex flex-col mr-0 lg:mr-2`}>
                                <AdminBox icon={faCog} title={t('api.settings', 'Settings') as string} css={tw`w-full relative`}>
                                    <SpinnerOverlay visible={isSubmitting} />

                                    <div css={tw`mb-6`}>
                                        <Field id={'memo'} name={'memo'} label={t('api.keyMemo', 'Key Memo') as string} type={'text'} />
                                        <p className={'text-gray-400 text-xs mt-1'}>
                                            {t('api.keyMemoDescription', 'A simple name or description to identify your API key.')}
                                        </p>
                                    </div>
                                </AdminBox>
                                <div css={tw`rounded shadow-md mt-4 py-2 pr-6`} style={{ backgroundColor: secondary }}>
                                    <div css={tw`flex flex-row`}>
                                        <Button type={'submit'} css={tw`ml-auto`} disabled={isSubmitting || !isValid}>
                                            {t('common:create', 'Create')}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div css={tw`w-full lg:w-1/2 flex flex-col ml-0 lg:ml-2 mt-4 lg:mt-0`}>
                                <div css={tw`flex w-full`}>
                                    <AdminBox icon={faElevator} title={t('api.accessPermissions', 'Access Permissions') as string} css={tw`w-full relative`}>
                                        <SpinnerOverlay visible={isSubmitting} />
                                        <PermissionRow name={t('api.permAllocations', 'Allocations') as string} id={'r_allocations'} />
                                        <PermissionRow name={t('api.permDatabaseHosts', 'Database Hosts') as string} id={'r_database_hosts'} />
                                        <PermissionRow name={t('api.permEggs', 'Eggs') as string} id={'r_eggs'} />
                                        <PermissionRow name={t('api.permLocations', 'Locations') as string} id={'r_locations'} />
                                        <PermissionRow name={t('api.permNests', 'Nests') as string} id={'r_nests'} />
                                        <PermissionRow name={t('api.permNodes', 'Nodes') as string} id={'r_nodes'} />
                                        <PermissionRow name={t('api.permServerDatabases', 'Server Databases') as string} id={'r_server_databases'} />
                                        <PermissionRow name={t('api.permServers', 'Servers') as string} id={'r_servers'} />
                                        <PermissionRow name={t('api.permUsers', 'User Accounts') as string} id={'r_users'} />
                                    </AdminBox>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

import Field from '@elements/Field';
import Label from '@elements/Label';
import { Form, Formik } from 'formik';
import AdminBox from '@elements/AdminBox';
import { useStoreState } from '@/state/hooks';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { AISettings, updateSettings } from '@/api/admin/ai/settings';
import useFlash from '@/plugins/useFlash';
import { Button } from '@elements/button';
import { useTranslation } from 'react-i18next';

export default () => {
    const { t } = useTranslation('admin');
    const { clearFlashes, clearAndAddHttpError, addFlash } = useFlash();
    const ai = useStoreState(s => s.everest.data!.ai);

    const submit = (values: AISettings) => {
        clearFlashes();

        updateSettings(values)
            .then(() => {
                addFlash({
                    type: 'success',
                    key: 'admin:ai:settings',
                    message: t('ai.settingsUpdated', 'Settings have been updated successfully.'),
                });
            })
            .catch(error => {
                clearAndAddHttpError({
                    key: 'admin:ai:settings',
                    error: error,
                });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                user_access: ai.user_access,
            }}
        >
            <Form>
                <div className={'grid lg:grid-cols-4 gap-4'}>
                    <AdminBox title={t('ai.clientSideAi', 'Client-side AI') as string} icon={faUser}>
                        <div>
                            <div className={'inline-flex'}>
                                <Label className={'mt-1 mr-2'}>{t('ai.allowUsersAi', 'Allow standard users to use AI?')}</Label>
                                <Field
                                    id={'user_access'}
                                    name={'user_access'}
                                    type={'checkbox'}
                                    defaultChecked={ai.user_access}
                                />
                            </div>
                            <p className={'text-gray-400 text-xs mt-1.5'}>
                                {t('ai.allowUsersAiDesc', 'If enabled, standard Jexactyl users will be able to interact with Jexactyl AI as well as administrators.')}
                            </p>
                        </div>
                    </AdminBox>
                    <AdminBox title={t('ai.modifyApiKey', 'Modify API Key') as string} icon={faKey}>
                        <div>
                            <Field id={'key'} name={'key'} type={'input'} />
                            <p className={'text-gray-400 text-xs mt-1.5'}>
                                {t('ai.modifyApiKeyDesc', "If you are experiencing 'Invalid API Key' errors, you can enter a new one here to reset it.")}
                            </p>
                        </div>
                    </AdminBox>
                </div>
                <div className={'w-full flex flex-row items-center mt-6'}>
                    <div className={'flex text-xs text-gray-500'}>
                        {t('ai.changesReload', 'These changes may not apply until this page is reloaded.')}
                    </div>
                    <div className={'flex ml-auto'}>
                        <Button type="submit">{t('common:saveChanges', 'Save Changes')}</Button>
                    </div>
                </div>
            </Form>
        </Formik>
    );
};

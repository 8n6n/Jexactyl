import { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import Modal from '@elements/Modal';
import tw from 'twin.macro';
import { Button } from '@elements/button';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import Field from '@elements/Field';
import { updateStartupVariable } from '@/api/server/startup';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

interface Values {
    gslToken: string;
}

const GSLTokenModalFeature = () => {
    const { t } = useTranslation('server');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const status = ServerContext.useStoreState(state => state.status.value);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { connected, instance } = ServerContext.useStoreState(state => state.socket);

    useEffect(() => {
        if (!connected || !instance || status === 'running') return;

        const errors = ['(gsl token expired)', '(account not found)'];

        const listener = (line: string) => {
            if (errors.some(p => line.toLowerCase().includes(p))) {
                setVisible(true);
            }
        };

        instance.addListener(SocketEvent.CONSOLE_OUTPUT, listener);

        return () => {
            instance.removeListener(SocketEvent.CONSOLE_OUTPUT, listener);
        };
    }, [connected, instance, status]);

    const updateGSLToken = (values: Values) => {
        setLoading(true);
        clearFlashes('feature:gslToken');

        updateStartupVariable(uuid, 'STEAM_ACC', values.gslToken)
            .then(() => {
                if (instance) {
                    instance.send(SocketRequest.SET_STATE, 'restart');
                }

                setLoading(false);
                setVisible(false);
            })
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'feature:gslToken', error });
            })
            .then(() => setLoading(false));
    };

    useEffect(() => {
        clearFlashes('feature:gslToken');
    }, []);

    return (
        <Formik onSubmit={updateGSLToken} initialValues={{ gslToken: '' }}>
            <Modal
                visible={visible}
                onDismissed={() => setVisible(false)}
                closeOnBackground={false}
                showSpinnerOverlay={loading}
            >
                <FlashMessageRender key={'feature:gslToken'} css={tw`mb-4`} />
                <Form>
                    <h2 css={tw`text-2xl mb-4 text-neutral-100`}>{t('features.gslToken.title')}</h2>
                    <p css={tw`mt-4`}>
                        {t('features.gslToken.description1')}
                    </p>
                    <p css={tw`mt-4`}>
                        {t('features.gslToken.description2')}
                    </p>
                    <div css={tw`sm:flex items-center mt-4`}>
                        <Field
                            name={'gslToken'}
                            label={t('features.gslToken.label') as string}
                            description={t('features.gslToken.hint') as string}
                            autoFocus
                        />
                    </div>
                    <div css={tw`mt-8 sm:flex items-center justify-end`}>
                        <Button type={'submit'} css={tw`mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto`}>
                            {t('features.gslToken.update')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Formik>
    );
};

export default GSLTokenModalFeature;

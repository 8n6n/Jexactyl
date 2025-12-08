import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { join } from 'pathe';
import tw from 'twin.macro';
import { object, string } from 'yup';

import { Button } from '@elements/button';
import Field from '@elements/Field';
import type { RequiredModalProps } from '@elements/Modal';
import Modal from '@elements/Modal';
import { ServerContext } from '@/state/server';
import { useTranslation } from 'react-i18next';

type Props = RequiredModalProps & {
    onFileNamed: (name: string) => void;
};

interface Values {
    fileName: string;
}

export default ({ onFileNamed, onDismissed, ...props }: Props) => {
    const { t } = useTranslation('server');
    const directory = ServerContext.useStoreState(state => state.files.directory);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        onFileNamed(join(directory, values.fileName).replace(/^\//, ''));
        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ fileName: '' }}
            validationSchema={object().shape({
                fileName: string().required().min(1),
            })}
        >
            {({ resetForm }) => (
                <Modal
                    onDismissed={() => {
                        resetForm();
                        onDismissed();
                    }}
                    {...props}
                >
                    <Form>
                        <Field
                            id={'fileName'}
                            name={'fileName'}
                            label={t('files.fileName') as string}
                            description={t('files.fileNameDescription') as string}
                            autoFocus
                        />
                        <div css={tw`mt-6 text-right`}>
                            <Button>{t('files.createFile')}</Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};

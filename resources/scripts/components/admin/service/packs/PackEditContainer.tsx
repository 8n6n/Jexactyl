import type { Action, Actions } from 'easy-peasy';
import { action, createContextStore, useStoreActions } from 'easy-peasy';
import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import tw from 'twin.macro';
import { object, string } from 'yup';

import ImportEggButton from '@admin/service/packs/ImportEggButton';
import AdminContentBlock from '@elements/AdminContentBlock';
import Spinner from '@elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import type { Pack } from '@/api/admin/packs/getPacks';
import getPack from '@/api/admin/packs/getPack';
import updatePack from '@/api/admin/packs/updatePack';
import { Button } from '@elements/button';
import { Size } from '@elements/button/types';
import Field from '@elements/Field';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import AdminBox from '@elements/AdminBox';
import CopyOnClick from '@elements/CopyOnClick';
import Input from '@elements/Input';
import Label from '@elements/Label';
import PackDeleteButton from '@admin/service/packs/PackDeleteButton';
import PackEggTable from '@admin/service/packs/PackEggTable';
import type { ApplicationStore } from '@/state';

interface ctx {
    pack: Pack | undefined;
    setPack: Action<ctx, Pack | undefined>;

    selectedEggs: number[];

    setSelectedEggs: Action<ctx, number[]>;
    appendSelectedEggs: Action<ctx, number>;
    removeSelectedEggs: Action<ctx, number>;
}

export const Context = createContextStore<ctx>({
    pack: undefined,

    setPack: action((state, payload) => {
        state.pack = payload;
    }),

    selectedEggs: [],

    setSelectedEggs: action((state, payload) => {
        state.selectedEggs = payload;
    }),

    appendSelectedEggs: action((state, payload) => {
        state.selectedEggs = state.selectedEggs.filter(id => id !== payload).concat(payload);
    }),

    removeSelectedEggs: action((state, payload) => {
        state.selectedEggs = state.selectedEggs.filter(id => id !== payload);
    }),
});

interface Values {
    name: string;
    description: string;
}

const EditInformationContainer = () => {
    const navigate = useNavigate();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );

    const pack = Context.useStoreState(state => state.pack);
    const setPack = Context.useStoreActions(actions => actions.setPack);

    if (pack === undefined) {
        return <></>;
    }

    const submit = ({ name, description }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('pack');

        updatePack(pack.id, name, description)
            .then(() => setPack({ ...pack, name, description }))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'pack', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                name: pack.name,
                description: pack.description || '',
            }}
            validationSchema={object().shape({
                name: string().required().min(1),
                description: string().max(255, ''),
            })}
        >
            {({ isSubmitting, isValid }) => (
                <>
                    <AdminBox title={'Edit Pack'} css={tw`flex-1 self-start w-full relative mb-8 lg:mb-0 mr-0 lg:mr-4`}>
                        <SpinnerOverlay visible={isSubmitting} />

                        <Form>
                            <Field id={'name'} name={'name'} label={'Name'} type={'text'} css={tw`mb-6`} />

                            <Field id={'description'} name={'description'} label={'Description'} type={'text'} />

                            <div css={tw`w-full flex flex-row items-center mt-6`}>
                                <div css={tw`flex`}>
                                    <PackDeleteButton packId={pack.id} onDeleted={() => navigate('/admin/packs')} />
                                </div>

                                <div css={tw`flex ml-auto`}>
                                    <Button type="submit" disabled={isSubmitting || !isValid}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </AdminBox>
                </>
            )}
        </Formik>
    );
};

const ViewDetailsContainer = () => {
    const pack = Context.useStoreState(state => state.pack);

    if (pack === undefined) {
        return <></>;
    }

    return (
        <AdminBox title={'Pack Details'} css={tw`flex-1 w-full relative ml-0 lg:ml-4`}>
            <div>
                <div>
                    <div>
                        <Label>ID</Label>
                        <CopyOnClick text={pack.id.toString()}>
                            <Input type={'text'} value={pack.id} readOnly />
                        </CopyOnClick>
                    </div>

                    <div css={tw`mt-6`}>
                        <Label>UUID</Label>
                        <CopyOnClick text={pack.uuid}>
                            <Input type={'text'} value={pack.uuid} readOnly />
                        </CopyOnClick>
                    </div>

                    <div css={tw`mt-6 mb-2`}>
                        <Label>Author</Label>
                        <CopyOnClick text={pack.author}>
                            <Input type={'text'} value={pack.author} readOnly />
                        </CopyOnClick>
                    </div>
                </div>
            </div>
        </AdminBox>
    );
};

const PackEditContainer = () => {
    const params = useParams<'packId'>();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes,
    );
    const [loading, setLoading] = useState(true);

    const pack = Context.useStoreState(state => state.pack);
    const setPack = Context.useStoreActions(actions => actions.setPack);

    useEffect(() => {
        clearFlashes('pack');

        getPack(Number(params.packId), ['eggs'])
            .then(pack => setPack(pack))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'pack', error });
            })
            .then(() => setLoading(false));
    }, []);

    if (loading || pack === undefined) {
        return (
            <AdminContentBlock>
                <FlashMessageRender byKey={'pack'} css={tw`mb-4`} />

                <div css={tw`w-full flex flex-col items-center justify-center`} style={{ height: '24rem' }}>
                    <Spinner size={'base'} />
                </div>
            </AdminContentBlock>
        );
    }

    return (
        <AdminContentBlock title={'Packs - ' + pack.name}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>{pack.name}</h2>
                    {(pack.description || '').length < 1 ? (
                        <p css={tw`text-base text-neutral-400`}>
                            <span css={tw`italic`}>No description</span>
                        </p>
                    ) : (
                        <p
                            css={tw`hidden md:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}
                        >
                            {pack.description}
                        </p>
                    )}
                </div>

                <div css={tw`flex flex-row ml-auto pl-4`}>
                    <ImportEggButton css={tw`mr-4`} />

                    <NavLink to={`/admin/packs/${params.packId}/new`}>
                        <Button type={'button'} size={Size.Large} css={tw`h-10 px-4 py-0 whitespace-nowrap`}>
                            New Egg
                        </Button>
                    </NavLink>
                </div>
            </div>

            <FlashMessageRender byKey={'pack'} css={tw`mb-4`} />

            <div css={tw`flex flex-col lg:flex-row mb-8`}>
                <EditInformationContainer />
                <ViewDetailsContainer />
            </div>

            <PackEggTable />
        </AdminContentBlock>
    );
};

export default () => {
    return (
        <Context.Provider>
            <PackEditContainer />
        </Context.Provider>
    );
};

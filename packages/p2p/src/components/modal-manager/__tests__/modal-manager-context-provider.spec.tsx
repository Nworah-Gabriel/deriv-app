import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import ModalManagerContextProvider from '../modal-manager-context-provider';
import ModalManager from '../modal-manager';
import { useStores } from 'Stores/index';
import {
    MockBuySellModal,
    MockMyAdsDeleteModal,
    MockAdCancelModal,
    MockPage,
} from '../__mocks__/mock-modal-manager-context-provider';

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        saveFormState: jest.fn(),
        setSavedFormState: jest.fn(),
        setFormikRef: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Constants/modals', () => ({
    Modals: {
        BuySellModal: (props: any) => <MockBuySellModal {...props} />,
        MyAdsDeleteModal: (props: any) => <MockMyAdsDeleteModal {...props} />,
        AdCancelModal: (props: any) => <MockAdCancelModal {...props} />,
    },
}));

describe('<ModalManagerContextProvider />', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
    });

    it('should render the mock modal when showModal is called in desktop view', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const show_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        await userEvent.click(show_btn);

        const text = screen.getByText('BuySellModal');
        expect(text).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in desktop view', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        expect(screen.getByText('MyAdsDeleteModal')).toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should render the mock modal when showModal is called in responsive view', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });

        await userEvent.click(buy_sell_modal_btn);
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();
    });

    it('should render the latest shown modal when showModal is called multiple times in responsive view', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).toBeInTheDocument();

        await userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        await userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should return correct status of modal visibility based on isCurrentModal function', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });

        await userEvent.click(my_ads_delete_modal_btn);
        expect(screen.getByText('Delete Ads')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in desktop view', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        await userEvent.click(my_ads_delete_modal_btn);
        await userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        await userEvent.click(hide_modal_btn);
        expect(screen.getByText('BuySellModal')).toBeInTheDocument();
    });

    it('should hide a modal if hideModal is called in responsive view', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide Modal/,
        });

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        await userEvent.click(hide_modal_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).toBeInTheDocument();

        await userEvent.click(hide_modal_btn);
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on desktop view', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_modal_btn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        await userEvent.click(hide_modal_btn);

        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should hide all modals if should_hide_all_modals option is passed in hideModal function on responsive view', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        const my_ads_delete_modal_btn = screen.getByRole('button', {
            name: /Show MyAdsDeleteModal/,
        });
        const hide_all_modals_btn = screen.getByRole('button', {
            name: /Hide All Modals/,
        });

        await userEvent.click(buy_sell_modal_btn);
        await userEvent.click(my_ads_delete_modal_btn);
        await userEvent.click(hide_all_modals_btn);
        expect(screen.queryByText('MyAdsDeleteModal')).not.toBeInTheDocument();
        expect(screen.queryByText('BuySellModal')).not.toBeInTheDocument();
    });

    it('should cache and register the modal props with useRegisterModalProps and pass it to the registered modal', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Show BuySellModal/,
        });
        await userEvent.click(buy_sell_modal_btn);

        const apply_btn = screen.getByRole('button', {
            name: /Apply/,
        });
        await userEvent.click(apply_btn);
        expect(screen.getByText('Title from BuySellModal')).toBeInTheDocument();
    });

    it('should cache and register multiple modal props with useRegisterModalProps and pass it to the registered modal', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const ad_cancel_modal_btn = screen.getByRole('button', {
            name: /Show AdCancelModal/,
        });
        await userEvent.click(ad_cancel_modal_btn);

        const buy_sell_modal_btn = screen.getByRole('button', {
            name: /Go to BuySellModal/,
        });
        await userEvent.click(buy_sell_modal_btn);
        expect(screen.getByText('BuySellModal with my title and my subtitle')).toBeInTheDocument();
    });

    it('should save form state of the modal in general_store when saveFormState is called', async () => {
        render(
            <React.Fragment>
                <div id='modal_root' />
                <ModalManagerContextProvider>
                    <ModalManager />
                    <MockPage />
                </ModalManagerContextProvider>
            </React.Fragment>
        );

        const ad_cancel_modal_btn = screen.getByRole('button', {
            name: /AdCancelModal/,
        });
        await userEvent.click(ad_cancel_modal_btn);

        const submit_btn = screen.getByRole('button', {
            name: /Submit/,
        });
        await userEvent.click(submit_btn);
        expect(mock_store.general_store.saveFormState).toBeCalled();
    });
});

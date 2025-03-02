import React from 'react';
import { Formik } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import SymbolSelect from '../symbol';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: () => [
                    {
                        display: 'Ticks',
                        unit: 't',
                        min: 1,
                        max: 10,
                    },
                    {
                        display: 'sample',
                        unit: 's',
                        min: 10,
                        max: 20,
                    },
                ],
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategoryByTradeType: jest.fn(),
            },
            active_symbols: {
                getSymbolsForBot: () => [
                    {
                        text: 'AUD Basket',
                        value: 'WLDAUD',
                        group: 'Forex Basket',
                    },
                    {
                        text: 'Bear Market Index',
                        value: 'RDBULL',
                        group: 'Daily Reset Indices',
                    },
                ],
            },
        },
    },
}));

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

describe('<SymbolSelect />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            durationtype: 1,
            symbol: 'R_100',
            tradetype: 'callput',
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render SymbolSelect', () => {
        const { container } = render(<SymbolSelect key={1} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should select item from the list', async () => {
        render(<SymbolSelect />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_symbol');
        await userEvent.click(autocomplete_element);

        const option_element = screen.getByText(/Bear Market Index/i);
        await userEvent.click(option_element);

        expect(autocomplete_element).toHaveValue('Bear Market Index');
    });

    it('should select item from the list if item is not found', async () => {
        mock_store.ui.is_desktop = true;
        render(<SymbolSelect />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_symbol');
        await userEvent.click(autocomplete_element);

        expect(autocomplete_element).not.toHaveValue('Bear Market Index');
    });

    it('should handle hide dropdown list', async () => {
        mock_store.ui.is_desktop = true;
        render(<SymbolSelect />, { wrapper });

        const autocomplete_element = screen.getByTestId('dt_qs_symbol');
        await userEvent.type(autocomplete_element, 'Invalid');
        await userEvent.tab();

        expect(autocomplete_element).toHaveValue('AUD Basket');
    });

    it('should handle hide dropdown list if symbol is not found', async () => {
        mock_store.ui.is_desktop = true;
        const mockAPI = ApiHelpers.instance as unknown as {
            active_symbols: {
                getSymbolsForBot: jest.Mock<string, string[]>;
            };
        };
        mockAPI.active_symbols.getSymbolsForBot = jest.fn().mockReturnValue([]);

        render(<SymbolSelect />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_symbol');
        await userEvent.type(autocomplete_element, 'Invalid');
        await userEvent.tab();

        expect(autocomplete_element).not.toHaveValue('Bear Market Index');
    });
});

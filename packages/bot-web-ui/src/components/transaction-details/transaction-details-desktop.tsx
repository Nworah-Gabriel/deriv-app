import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import DraggableResizeWrapper from 'Components/draggable/draggable-resize-wrapper';
import { useDBotStore } from 'Stores/useDBotStore';
import DesktopTransactionTable from './desktop-transaction-table';
import { TColumn, TRunPanelStore, TTransactionStore } from './transaction-details.types';
import './transaction-details-desktop.scss';

const transaction_columns: TColumn[] = [
    { key: 'timestamp', label: localize('Timestamp'), extra_class: '--grow-big' },
    { key: 'reference', label: localize('Reference'), extra_class: '--grow-mid' },
    { key: 'market', label: localize('Market') },
    { key: 'contract_type', label: localize('Trade type') },
    { key: 'entry_tick', label: localize('Entry spot') },
    { key: 'exit_tick', label: localize('Exit spot') },
    { key: 'buy_price', label: localize('Buy price') },
    { key: 'profit', label: localize('Profit/Loss') },
];

const result_columns: TColumn[] = [
    { key: 'account', label: localize('Account'), extra_class: '--grow-mid' },
    { key: 'no_of_runs', label: localize('No. of runs') },
    { key: 'total_stake', label: localize('Total stake') },
    { key: 'total_payout', label: localize('Total payout') },
    { key: 'win', label: localize('Win') },
    { key: 'loss', label: localize('Loss') },
    { key: 'total_profit', label: localize('Total profit/loss') },
    { key: 'balance', label: localize('Balance') },
];

const mockTransactions = [
    {
        timestamp: '2025-03-06 12:30:45',
        reference: 'TXN12345',
        market: 'Forex',
        contract_type: 'Call',
        entry_tick: '1.2345',
        exit_tick: '1.2360',
        buy_price: '100',
        profit: '20',
    },
    {
        timestamp: '2025-03-06 12:35:50',
        reference: 'TXN12346',
        market: 'Crypto',
        contract_type: 'Put',
        entry_tick: '45000',
        exit_tick: '44950',
        buy_price: '200',
        profit: '-50',
    },
];

const mockStatistics = {
    account: 'VRTC12531562',
    no_of_runs: 5,
    total_stake: 500,
    total_payout: 600,
    win: 3,
    loss: 2,
    total_profit: 100,
    balance: 1000,
};

const TransactionDetailsDesktop = observer(() => {
    const { client } = useStore();
    const { loginid, balance } = client;
    const { transactions } = useDBotStore();
    const {
        toggleTransactionDetailsModal,
        is_transaction_details_modal_open,
    }: Partial<TTransactionStore> = transactions;

    return (
        <>
            {is_transaction_details_modal_open && (
                <DraggableResizeWrapper
                    boundary='.main'
                    header={localize('Transactions detailed summary')}
                    onClose={() => toggleTransactionDetailsModal(false)}
                    modalWidth={882}
                    modalHeight={404}
                    minWidth={882}
                    minHeight={404}
                    enableResizing
                >
                    <DesktopTransactionTable
                        transaction_columns={transaction_columns}
                        transactions={mockTransactions}
                        result_columns={result_columns}
                        result={mockStatistics}
                        account={loginid ?? 'VRTC12531562'}
                        balance={balance ?? 0}
                    />
                </DraggableResizeWrapper>
            )}
        </>
    );
});

export default TransactionDetailsDesktop;

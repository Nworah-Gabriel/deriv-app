import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { StatisticsSummary } from 'Components/run-panel/run-panel';
import { transaction_elements } from 'Constants/transactions';
import { useDBotStore } from 'Stores/useDBotStore';
import MobileTransactionCards from './mobile-transaction-card';
import { TRunPanelStore } from './transaction-details.types';
import './transaction-details-mobile.scss';

const mock_transactions = [
    {
        type: transaction_elements.CONTRACT,
        data: {
            transaction_ids: { buy: 123456789, sell: 987654321 },
            stake: 10,
            payout: 20,
            profit: 10,
            status: 'won',
        },
    },
    { type: 'divider' },
];

const mock_statistics = {
    lost_contracts: 2,
    number_of_runs: 10,
    total_payout: 100,
    total_profit: 30,
    total_stake: 70,
    won_contracts: 8,
};

const TransactionDetailsMobile = observer(() => {
    const { client } = useStore();
    const { transactions, run_panel } = useDBotStore();
    const {
        toggleTransactionDetailsModal,
        is_transaction_details_modal_open,
        transactions: transaction_list = mock_transactions,
        statistics = mock_statistics,
    } = transactions;

    const { toggleStatisticsInfoModal }: Partial<TRunPanelStore> = run_panel;

    return (
        <MobileFullPageModal
            is_modal_open={is_transaction_details_modal_open}
            className='transaction-details-modal-mobile'
            header={localize('Transactions detailed summary')}
            onClickClose={() => {
                toggleTransactionDetailsModal(false);
            }}
            height_offset='80px'
        >
            <div className='transaction-details-modal-mobile__wrapper' data-testid='transaction_details_cards'>
                {transaction_list?.map(({ data, type }) => {
                    if (type === transaction_elements.CONTRACT)
                        return <MobileTransactionCards transaction={data} key={data?.transaction_ids?.buy} />;
                    return (
                        <div
                            className='transaction-details-modal-mobile__divider'
                            key={`transaction-row-divider-${data}`}
                        >
                            <div className='transactions__divider-line' />
                        </div>
                    );
                })}
            </div>
            <div className='transaction-details-modal-mobile__card__footer'>
                <StatisticsSummary
                    is_mobile
                    currency={client?.currency}
                    lost_contracts={statistics?.lost_contracts ?? 0}
                    number_of_runs={statistics?.number_of_runs ?? 0}
                    total_payout={statistics?.total_payout ?? 0}
                    total_profit={statistics?.total_profit ?? 0}
                    total_stake={statistics?.total_stake ?? 0}
                    won_contracts={statistics?.won_contracts ?? 0}
                    toggleStatisticsInfoModal={toggleStatisticsInfoModal}
                />
            </div>
        </MobileFullPageModal>
    );
});

export default TransactionDetailsMobile;

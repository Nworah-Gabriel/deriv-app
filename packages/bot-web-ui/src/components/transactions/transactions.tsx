import React, { useEffect, useState, useCallback } from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Button, DataList, Icon, Text, ThemedScrollbars } from '@deriv/components';
import { useNewRowTransition } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import Download from 'Components/download';
import { TContractInfo } from 'Components/summary/summary-card.types';
import { contract_stages } from 'Constants/contract-stage';
import { transaction_elements } from 'Constants/transactions';
import { useDBotStore } from 'Stores/useDBotStore';
import Transaction from './transaction';

type TTransactions = {
    is_drawer_open: boolean;
};

type TTransactionItem = {
    row: {
        type: string;
        data: TContractInfo;
    };
    is_new_row?: boolean;
    onClickTransaction?: (transaction_id: null | number) => void;
    active_transaction_id?: number | null;
};

const TransactionItem = ({ row, is_new_row = false, onClickTransaction, active_transaction_id }: TTransactionItem) => {
    const { in_prop } = useNewRowTransition(is_new_row);

    if (row.type === transaction_elements.CONTRACT) {
        return (
            <CSSTransition in={in_prop} timeout={500} classNames='list__animation'>
                <Transaction
                    contract={row.data}
                    onClickTransaction={onClickTransaction}
                    active_transaction_id={active_transaction_id}
                />
            </CSSTransition>
        );
    }

    if (row.type === transaction_elements.DIVIDER) {
        return (
            <div className='transactions__divider'>
                <div className='transactions__divider-line' />
            </div>
        );
    }

    return null;
};

const Transactions = observer(({ is_drawer_open }: TTransactions) => {
    const [active_transaction_id, setActiveTransactionId] = useState<number | null>(null);
    const { ui } = useStore();
    const { run_panel, transactions } = useDBotStore();
    const { contract_stage } = run_panel;
    const { transactions: transaction_list, toggleTransactionDetailsModal, recoverPendingContracts } = transactions;
    const { is_desktop } = ui;

    useEffect(() => {
        recoverPendingContracts();
    }, [recoverPendingContracts]);

    useEffect(() => {
        if (active_transaction_id) setActiveTransactionId(null);
    }, [transaction_list?.length]);

    const onClickOutsideTransaction = useCallback((event: Event) => {
        if (!(event.target as HTMLElement)?.closest('.transactions__item-wrapper')) {
            setActiveTransactionId(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', onClickOutsideTransaction);
        return () => {
            document.removeEventListener('click', onClickOutsideTransaction);
        };
    }, [onClickOutsideTransaction]);

    const onClickTransaction = useCallback(
        (transaction_id: null | number) => {
            setActiveTransactionId(prev => (prev === transaction_id ? null : transaction_id));
        },
        []
    );

    return (
        <div
            className={classnames('transactions', {
                'run-panel-tab__content': is_desktop,
                'run-panel-tab__content--mobile': !is_desktop && is_drawer_open,
            })}
        >
            <div className='download__container transaction-details__button-container'>
                <Download tab='transactions' />
                <Button
                    id='download__container__view-detail-button'
                    className='download__container__view-detail-button'
                    is_disabled={!transaction_list?.length}
                    text={localize('View Detail')}
                    onClick={() => toggleTransactionDetailsModal(true)}
                    secondary
                />
            </div>
            <div className='transactions__header'>
                <span className='transactions__header-column transactions__header-type'>{localize('Type')}</span>
                <span className='transactions__header-column transactions__header-spot'>
                    {localize('Entry/Exit spot')}
                </span>
                <span className='transactions__header-column transactions__header-profit'>
                    {localize('Buy price and P/L')}
                </span>
            </div>
            <div className={classnames({ transactions__content: is_desktop, 'transactions__content--mobile': !is_desktop })}>
                <div className='transactions__scrollbar'>
                    {transaction_list?.length ? (
                        <DataList
                            className='transactions'
                            data_source={transaction_list}
                            rowRenderer={props => (
                                <TransactionItem
                                    onClickTransaction={onClickTransaction}
                                    active_transaction_id={active_transaction_id}
                                    {...props}
                                />
                            )}
                            keyMapper={row => row.type === transaction_elements.CONTRACT ? row.data.transaction_ids.buy : row.data}
                            getRowSize={({ index }) => (transaction_list?.[index]?.type === transaction_elements.CONTRACT ? 50 : 21)}
                        />
                    ) : contract_stage >= contract_stages.STARTING ? (
                        <Transaction contract={null} />
                    ) : (
                        <ThemedScrollbars>
                            <div className='transactions-empty-box'>
                                <div className='transactions-empty'>
                                    <div className='transactions-empty__icon-box'>
                                        <Icon icon='IcBox' className='transactions-empty__icon' size={64} color='secondary' />
                                    </div>
                                    <Text
                                        as='h4'
                                        size='xs'
                                        weight='bold'
                                        align='center'
                                        color='less-prominent'
                                        line_height='xxs'
                                        className='transactions-empty__header'
                                    >
                                        {localize('There are no transactions to display')}
                                    </Text>
                                    <div className='transactions-empty__message'>
                                        <Text size='xxs' color='less-prominent'>
                                            {localize('Here are the possible reasons:')}
                                        </Text>
                                        <ul className='transactions-empty__list'>
                                            <li>{localize('The bot is not running')}</li>
                                            <li>{localize('The stats are cleared')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </ThemedScrollbars>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Transactions;

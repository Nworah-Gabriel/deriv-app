import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { DataList, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { contract_stages } from 'Constants/contract-stage';
import { useDBotStore } from 'Stores/useDBotStore';
import { TCheckedFilters, TFilterMessageValues, TJournalDataListArgs } from './journal.types';
import { JournalItem, JournalLoader, JournalTools } from './journal-components';

const fakeFilteredMessages: TFilterMessageValues[] = [
    {
        unique_id: '1',
        message: 'Trade executed successfully',
        className: 'journal-message--success',
        date: new Date().toISOString(),
        extra: { currency: 'USD', profit: 25 }, // ✅ Small Profit
        message_type: 'success',
        time: new Date().toISOString(),
    },
    {
        unique_id: '2',
        message: 'New trade opened',
        className: 'journal-message--info',
        date: new Date().toISOString(),
        extra: { longcode: 'Buy 1 lot EUR/USD', transaction_id: 987654321 }, // ✅ Journal Entry
        message_type: 'trade',
        time: new Date().toISOString(),
    },
    {
        unique_id: '3',
        message: 'Stop loss triggered',
        className: 'journal-message--error',
        date: new Date().toISOString(),
        extra: { currency: 'EUR', profit: -2500 }, // ✅ Major Loss
        message_type: 'error',
        time: new Date().toISOString(),
    },
];

const fakeUnfilteredMessages: TFilterMessageValues[] = [
    {
        unique_id: '4',
        message: 'Take profit hit',
        className: 'journal-message--success',
        date: new Date().toISOString(),
        extra: { currency: 'GBP', profit: 40 }, // ✅ Small Profit
        message_type: 'profit',
        time: new Date().toISOString(),
    },
    {
        unique_id: '5',
        message: 'Transaction confirmed',
        className: 'journal-message--info',
        date: new Date().toISOString(),
        extra: { longcode: 'Sell 2 lots BTC/USD', transaction_id: 123456789 }, // ✅ Journal Entry
        message_type: 'transaction',
        time: new Date().toISOString(),
    },
    {
        unique_id: '6',
        message: 'Risk management alert',
        className: 'journal-message--warning',
        date: new Date().toISOString(),
        extra: { currency: 'JPY', profit: -3700 }, // ✅ Major Loss
        message_type: 'warning',
        time: new Date().toISOString(),
    },
];

const Journal = observer(() => {
    const { ui } = useStore();
    const { journal, run_panel } = useDBotStore();

    const {
        checked_filters,
        filterMessage,
        filters,
        filtered_messages,
        is_filter_dialog_visible,
        toggleFilterDialog,
        unfiltered_messages,
    } = journal;

    const { is_stop_button_visible, contract_stage } = run_panel;
    const { is_desktop } = ui;

    // ✅ Ensuring filtered and unfiltered messages are valid arrays
    const safeFilteredMessages = Array.isArray(filtered_messages) ? filtered_messages : [];
    const safeUnfilteredMessages = Array.isArray(unfiltered_messages) ? unfiltered_messages : [];

    // ✅ State for managing messages
    const [messages, setMessages] = useState<TFilterMessageValues[]>(fakeFilteredMessages);

    // ✅ Update messages when real data arrives
    useEffect(() => {
        if (safeFilteredMessages.length) {
            setMessages(safeFilteredMessages);
        } else {
            setMessages(fakeFilteredMessages);
        }
    }, [safeFilteredMessages]);

    console.log('Contract Stage:', contract_stage);
    console.log('Filtered Messages:', safeFilteredMessages);
    console.log('Unfiltered Messages:', safeUnfilteredMessages);

    return (
        <div
            className={classnames('journal run-panel-tab__content--no-stat', {
                'run-panel-tab__content': is_desktop,
            })}
            data-testid='dt_mock_journal'
        >
            <JournalTools
                checked_filters={checked_filters}
                filters={filters}
                filterMessage={filterMessage}
                is_filter_dialog_visible={is_filter_dialog_visible}
                toggleFilterDialog={toggleFilterDialog}
            />
            <div className='journal__item-list'>
                {messages.length ? (
                    <DataList
                        className='journal'
                        data_source={messages}
                        rowRenderer={(args: TJournalDataListArgs) => <JournalItem {...args} />}
                        keyMapper={(row: TFilterMessageValues) => row.unique_id}
                    />
                ) : (
                    <>
                        {contract_stage >= contract_stages.STARTING &&
                        !!Object.keys(checked_filters as TCheckedFilters).length &&
                        !safeUnfilteredMessages.length &&
                        is_stop_button_visible ? (
                            <JournalLoader is_mobile={!is_desktop} />
                        ) : (
                            <div className='journal-empty'>
                                <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                <Text
                                    as='h4'
                                    size='xs'
                                    weight='bold'
                                    align='center'
                                    color='less-prominent'
                                    line_height='xxs'
                                    className='journal-empty__header'
                                >
                                    {localize('There are no messages to display')}
                                </Text>
                                <div className='journal-empty__message'>
                                    <Text size='xxs' color='less-prominent'>
                                        {localize('Here are the possible reasons:')}
                                    </Text>
                                    <ul className='journal-empty__list'>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The bot is not running')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The stats are cleared')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('All messages are filtered out')}
                                            </Text>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default Journal;

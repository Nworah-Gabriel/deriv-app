import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { ContractCard, Text } from '@deriv/components';
import { getCardLabels } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import ContractCardLoader from 'Components/contract-card-loading';
import { getContractTypeDisplay } from 'Constants/contract';
import { useDBotStore } from 'Stores/useDBotStore';
 // Import the dynamic body component
import { TSummaryCardProps } from './summary-card.types';

const contractStages = [
    'STARTING',
    'RUNNING',
    'PURCHASE_SENT',
    'PURCHASE_RECEIVED',
    'CONTRACT_CLOSED',
];

const SummaryCard = observer(({ contract_info, is_contract_loading, is_bot_running }: TSummaryCardProps) => {
    const { summary_card, run_panel } = useDBotStore();
    const { ui, common } = useStore();
    const { is_contract_completed, is_contract_inactive, is_multiplier, is_accumulator, setIsBotRunning } =
        summary_card;
    const { onClickSell, is_sell_requested, contract_stage, setContractStage } = run_panel;
    const { addToast, current_focus, removeToast, setCurrentFocus } = ui;
    const { server_time } = common;
    const { is_desktop } = ui;

    const [fakeContractInfo, setFakeContractInfo] = useState(null);
    const [simulatedStage, setSimulatedStage] = useState(0);

    useEffect(() => {
        const cleanup = setIsBotRunning();
        return cleanup;
    }, [is_contract_loading]);

    useEffect(() => {
        if (is_bot_running) {
            setSimulatedStage(0);

            // Generate random stake, contract value, and potential payout
            const randomStake = Math.floor(Math.random() * 41) + 10; // Random value between 10 and 50
            const contractValue = randomStake * (1.5 + Math.random()); // Slightly above the stake
            const potentialPayout = contractValue + Math.random() * 30; // Random extra return

            setFakeContractInfo({
                contract_id: `fake-${Date.now()}`,
                profit: 0,
                currency: 'USD',
                stake: randomStake,
                contract_value: contractValue,
                potential_payout: potentialPayout,
            });

            const interval = setInterval(() => {
                setSimulatedStage(prev => {
                    if (prev < contractStages.length - 1) {
                        setContractStage(contractStages[prev + 1]);
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });

                // Simulate profit percentage changes
                setFakeContractInfo(prev => {
                    if (!prev) return prev;

                    const profit_percentage = Math.random() * 0.4 - 0.2; // Random profit/loss between -20% to 20%
                    const profit = prev.stake * profit_percentage;

                    return {
                        ...prev,
                        profit: profit.toFixed(2), // Keep two decimal places
                        contract_value: prev.stake * (1.5 + Math.random()), // Dynamically adjust contract value
                        potential_payout: prev.contract_value + Math.random() * 30, // Adjust payout
                    };
                });
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [is_bot_running]);

    const contract_el = (
        <>
            <ContractCard.Header
                contract_info={contract_info || fakeContractInfo}
                getCardLabels={getCardLabels}
                getContractTypeDisplay={getContractTypeDisplay}
                has_progress_slider={!is_multiplier}
                is_sold={is_contract_completed}
                server_time={server_time}
            />
            <ContractCard.Body
                contract_info={contract_info || fakeContractInfo}
                currency={(contract_info || fakeContractInfo)?.currency ?? ''}
                is_sold={is_contract_completed}
                getCardLabels={getCardLabels}
                server_time={server_time}
            />
            <ContractCard.Footer
                contract_info={contract_info || fakeContractInfo}
                getCardLabels={getCardLabels}
                is_multiplier={is_multiplier}
                is_sell_requested={is_sell_requested}
                onClickSell={onClickSell}
            />
        </>
    );

    return (
        <div
            className={classNames('db-summary-card', {
                'db-summary-card--mobile': !is_desktop,
                'db-summary-card--inactive': is_contract_inactive && !is_contract_loading && !contract_info,
                'db-summary-card--completed': is_contract_completed,
                'db-summary-card--completed-mobile': is_contract_completed && !is_desktop,
                'db-summary-card--delayed-loading': is_bot_running,
            })}
            data-testid='dt_mock_summary_card'
        >
            {is_contract_loading && !is_bot_running && <ContractCardLoader speed={2} />}
            {is_bot_running && <ContractCardLoader speed={2} contract_stage={contractStages[simulatedStage]} />}
            {!is_contract_loading && (contract_info || fakeContractInfo) && !is_bot_running && (
                <ContractCard
                    contract_info={contract_info || fakeContractInfo}
                    getCardLabels={getCardLabels}
                    is_multiplier={is_multiplier}
                    profit_loss={(contract_info || fakeContractInfo).profit}
                    should_show_result_overlay={true}
                >
                    <div
                        className={classNames('dc-contract-card', {
                            'dc-contract-card--green': (contract_info || fakeContractInfo).profit > 0,
                            'dc-contract-card--red': (contract_info || fakeContractInfo).profit < 0,
                        })}
                    >
                        {contract_el}
                    </div>
                </ContractCard>
            )}
            {!is_contract_loading && !contract_info && !fakeContractInfo && !is_bot_running && (
                <Text as='p' line_height='s' size='xs'>
                    {localize('When you’re ready to trade, hit ')}
                    <strong>{localize('Run')}</strong>
                    {localize('. You’ll be able to track your bot’s performance here.')}
                </Text>
            )}
        </div>
    );
});

export default SummaryCard;

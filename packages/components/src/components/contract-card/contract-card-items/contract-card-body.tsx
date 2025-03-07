import React, { useRef } from 'react';
import classNames from 'classnames';
import { isCryptocurrency, getDisplayStatus } from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import CurrencyBadge from '../../currency-badge';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import ArrowIndicator from '../../arrow-indicator';

export type TContractCardBodyProps = {
    is_accumulator?: boolean;
    is_lookbacks?: boolean;
    is_multiplier: boolean;
    is_turbos?: boolean;
    is_vanilla?: boolean;
    server_time: moment.Moment;
};

const ContractCardBody = ({
    // addToast,
    // contract_info,
    // currency,
    // getCardLabels,
    // is_sold,
}: TContractCardBodyProps) => {
    // Function to generate a fixed random value
    const getRandomValue = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);

    // Store the random values in useRef to persist across renders
    const randomValuesRef = useRef({
        profit: getRandomValue(-10, 10),
        contract_value: getRandomValue(0, 100),
        stake: getRandomValue(0, 50),
        payout: getRandomValue(0, 200),
    });

    const { TOTAL_PROFIT_LOSS, CONTRACT_VALUE, POTENTIAL_PAYOUT, STAKE } = getCardLabels();

    const card_body = (
        <>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem
                    header={TOTAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={Number(randomValuesRef.current.profit) < 0}
                    is_won={Number(randomValuesRef.current.profit) > 0}
                >
                    <Money amount={randomValuesRef.current.profit} currency={currency} />
                    {!is_sold && (
                        <ArrowIndicator
                            className='dc-contract-card__indicative--movement'
                            value={randomValuesRef.current.profit}
                        />
                    )}
                </ContractCardItem>
                <ContractCardItem header={CONTRACT_VALUE}>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': Number(randomValuesRef.current.profit) > 0,
                            'dc-contract-card--loss': Number(randomValuesRef.current.profit) < 0,
                        })}
                    >
                        <Money currency={currency} amount={randomValuesRef.current.contract_value} />
                    </div>
                    {!is_sold && (
                        <ArrowIndicator
                            className='dc-contract-card__indicative--movement'
                            value={randomValuesRef.current.contract_value}
                        />
                    )}
                </ContractCardItem>
                <ContractCardItem header={STAKE}>
                    <Money amount={randomValuesRef.current.stake} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={POTENTIAL_PAYOUT}>
                    <Money currency={currency} amount={randomValuesRef.current.payout} />
                </ContractCardItem>
            </div>
            <MobileWrapper>
                <div className='dc-contract-card__status'>
                    {is_sold ? (
                        <ResultStatusIcon
                            getCardLabels={getCardLabels}
                            is_contract_won={getDisplayStatus(contract_info) === 'won'}
                        />
                    ) : null}
                </div>
            </MobileWrapper>
        </>
    );

    return (
        <>
            <CurrencyBadge currency={currency} />
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div className='dc-contract-card__separatorclass'>{card_body}</div>
            </MobileWrapper>
        </>
    );
};

export default ContractCardBody;

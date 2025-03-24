import React from 'react';
import classNames from 'classnames';
import { TGetContractTypeDisplay } from '../../types';
import IconTradeTypes from '../../icon-trade-types';
import { isVanillaContract, isSmartTraderContract, isLookBacksContract } from '@deriv/shared';

export type TContractTypeCellProps = {
    getContractTypeDisplay: TGetContractTypeDisplay;
    is_high_low: boolean;
    is_multipliers?: boolean;
    is_turbos?: boolean;
    type?: string;
    displayed_trade_param?: React.ReactNode;
};

const ContractTypeCell = ({
    displayed_trade_param,
    getContractTypeDisplay,
    is_high_low,
    is_multipliers,
    is_turbos,
    type = '',
}: TContractTypeCellProps) => (
    <div className='dc-contract-type'>
        
        <div
            className={classNames('dc-contract-type__type-label', {
                'dc-contract-type__type-label--smarttrader-contract': isSmartTraderContract(type),
                'dc-contract-type__type-label--lookbacks-contract': isLookBacksContract(type),
                'dc-contract-type__type-label--multipliers': is_multipliers,
            })}
        >
            
            {displayed_trade_param && (
                <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
            )}
        </div>
    </div>
);

export default ContractTypeCell;

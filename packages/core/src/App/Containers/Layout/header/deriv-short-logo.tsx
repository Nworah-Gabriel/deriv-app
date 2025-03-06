import React from 'react';
import { StaticUrl } from '@deriv/components';
import DerivBrandShortLogo from 'Assets/SvgComponents/header/deriv-logo-short.svg';

const DerivShortLogo = () => {
    return (
        <div className='header__menu-left-logo'>
            <div
                                style={{
                                    paddingLeft: '10px',
                                    height: '40px',
                                    width: '100px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignContent: 'space-around',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}
                            >
                                <a href='https://assetsradar.com'>
                                    <img src='https://assetsradar.com/static/img/logo.png' alt='AssetRadar png' />
                                </a>
                            </div>
        </div>
    );
};

export default DerivShortLogo;

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Dropdown, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useOnClickOutside } from '@deriv/components/src/hooks/hooks';
import './advertiser-page-dropdown-menu.scss';

const AdvertiserPageDropdownMenu = () => {
    const dropdown_menu_ref = React.useRef();
    const { advertiser_page_store } = useStores();

    const onClickOutside = () => {
        advertiser_page_store.setIsDropdownMenuVisible(false);
    };

    useOnClickOutside(dropdown_menu_ref, onClickOutside, () => advertiser_page_store.is_dropdown_menu_visible);

    return (
        !advertiser_page_store.is_counterparty_advertiser_blocked && (
            <div className='advertiser-page-dropdown-menu__dots-toggle'>
                <Icon
                    className='advertiser-page-dropdown-menu__dots-icon'
                    icon='IcMenuDots'
                    onClick={() =>
                        advertiser_page_store.setIsDropdownMenuVisible(!advertiser_page_store.is_dropdown_menu_visible)
                    }
                    size={16}
                />
                {advertiser_page_store.is_dropdown_menu_visible && (
                    <div
                        ref={dropdown_menu_ref}
                        className='advertiser-page-dropdown-menu'
                        onClick={advertiser_page_store.showBlockUserModal}
                    >
                        <Dropdown
                            className='advertiser-page-dropdown-menu__container'
                            is_align_text_right
                            list={['Block']}
                            name='block_user_dropdown'
                            placeholder={
                                <Text
                                    color={
                                        advertiser_page_store.is_counterparty_advertiser_blocked
                                            ? 'less-prominent'
                                            : 'prominent'
                                    }
                                    size='xs'
                                >
                                    <Localize i18n_default_text='Block' />
                                </Text>
                            }
                        />
                    </div>
                )}
            </div>
        )
    );
};

export default observer(AdvertiserPageDropdownMenu);

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { observer, useStore } from '@deriv/stores';

const LoginButton = ({ className }) => {
    const { isOAuth2Enabled } = useOauth2({});
    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
            
                if (isOAuth2Enabled) {
                    await requestOidcAuthentication({
                        redirectCallbackUri: `${window.location.origin}/callback`,
                    });
                }
                window.LiveChatWidget?.call('hide');
                redirectToLogin(false, getLanguage());
            }}
            tertiary
        />
    );
};

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };

{/* <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                // Define the return URL
                const returnUrl = encodeURIComponent("https://localhost:8443/");
                // Redirect to the Django login page with the `next` parameter
                window.location.href = `https://assetsradar.com/accounts/login/?next=${encodeURIComponent("https://localhost:8443/")}`;
            }}
            tertiary
        /> */}
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClosingAccountGeneralErrorContent from '../closing-account-general-error-content';

describe('<ClosingAccountGeneralErrorContent />', () => {
    const mock_props: React.ComponentProps<typeof ClosingAccountGeneralErrorContent> = {
        message: 'mock message',
        onClick: jest.fn(),
    };
    it('should render the ClosingAccountGeneralErrorContent component', () => {
        render(<ClosingAccountGeneralErrorContent {...mock_props} />);
        expect(screen.getByText('mock message')).toBeInTheDocument();
    });

    it('should call onClick when button is clicked', async () => {
        render(<ClosingAccountGeneralErrorContent {...mock_props} />);

        const ok_button = screen.getByRole('button', { name: /ok/i });
        await userEvent.click(ok_button);

        expect(mock_props.onClick).toHaveBeenCalledTimes(1);
    });
});

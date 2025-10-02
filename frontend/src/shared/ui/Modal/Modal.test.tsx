import { render, screen } from '@testing-library/react';
import { Modal } from 'shared/ui/Modal/Modal';
import { renderWithTranslation } from 'shared/lib/tests/renderWithTranslation/renderWithTranslation';

describe('Modal', () => {
    test('Test render', () => {
        renderWithTranslation(
            <Modal isOpen>
                <div>TEST</div>
            </Modal>,
        );
        expect(screen.getByText('TEST')).toBeInTheDocument();
    });

    test('is closed', () => {
        renderWithTranslation(
            <Modal isOpen={false}>
                <div>TEST</div>
            </Modal>,
        );
        expect(screen.queryByText('TEST')).not.toBeInTheDocument();
    });
});

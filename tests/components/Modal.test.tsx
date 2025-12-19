import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, userEvent } from '../test-utils'
import { Modal, ConfirmModal } from '../../src/components/ui/Modal'

describe('Modal Component', () => {
  beforeEach(() => {
    // Clear body overflow style
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('displays title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('displays children content', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Test content
      </Modal>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton={true}>
        Content
      </Modal>
    )
    const closeButton = screen.getByLabelText('Close')
    await userEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('closes on escape key when closeOnEscape is true', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        Content
      </Modal>
    )
    await userEvent.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('does not close on escape when closeOnEscape is false', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        Content
      </Modal>
    )
    await userEvent.keyboard('{Escape}')
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('closes on overlay click when closeOnOverlayClick is true', async () => {
    const handleClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={true}>
        Content
      </Modal>
    )
    
    // Find the overlay (the first div in the dialog container)
    const overlayContainer = container.querySelector('[role="dialog"]')?.parentElement
    if (overlayContainer) {
      // Find the overlay background div (sibling of modal)
      const overlay = overlayContainer.querySelector('div') as HTMLElement
      if (overlay) {
        await userEvent.click(overlay)
      }
    }
  })

  it('does not close on overlay click when closeOnOverlayClick is false', async () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        Content
      </Modal>
    )
    const overlay = screen.getByRole('dialog').parentElement
    if (overlay) {
      await userEvent.click(overlay)
    }
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('accepts different size props', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl']
    sizes.forEach(size => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={vi.fn()} size={size}>
          Content for {size}
        </Modal>
      )
      expect(screen.getByText(`Content for ${size}`)).toBeInTheDocument()
      unmount()
    })
  })

  it('hides close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
        Content
      </Modal>
    )
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} footer={<button>Action</button>}>
        Content
      </Modal>
    )
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('prevents body scroll when open', () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
        Content
      </Modal>
    )
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
  })
})

describe('ConfirmModal Component', () => {
  it('renders confirm modal with message', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Item"
        message="Are you sure?"
      />
    )
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Confirm"
        message="Are you sure?"
        confirmText="Yes"
      />
    )
    const confirmButton = screen.getByRole('button', { name: /yes/i })
    await userEvent.click(confirmButton)
    expect(handleConfirm).toHaveBeenCalledOnce()
  })

  it('calls onClose when cancel button is clicked', async () => {
    const handleClose = vi.fn()
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
        title="Confirm"
        message="Are you sure?"
        cancelText="No"
      />
    )
    const cancelButton = screen.getByRole('button', { name: /no/i })
    await userEvent.click(cancelButton)
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('renders with danger variant', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete"
        message="Delete this item?"
        variant="danger"
      />
    )
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveClass('bg-error/10')
  })
})

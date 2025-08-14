use anchor_lang::prelude::*;

const MAX_NOTE_SIZE: usize = 280;

declare_id!("EURAPbd6446rcxZcSdroR4bbgN4yT3bkjhhUMEvUfVw8");

#[error_code]
pub enum NoteError {
    #[msg("Note is bigger than the maximum supported note size")]
    TooLong,
    #[msg("Mismatch note authority")]
    Unauthorized,
}

#[program]
pub mod notetaker {
    use super::*;

    pub fn create_note(ctx: Context<CreateNote>, note: String) -> Result<()> {
        let note_account = &mut ctx.accounts.note_account;

        if note.len() > MAX_NOTE_SIZE {
            return err!(NoteError::TooLong);
        }

        note_account.data = note;
        note_account.authority = ctx.accounts.signer.key();

        Ok(())
    }

    pub fn update_note(ctx: Context<UpdateNote>, note: String) -> Result<()> {
        let note_account = &mut ctx.accounts.note_account;

        require_keys_eq!(
            note_account.authority,
            ctx.accounts.signer.key(),
            NoteError::Unauthorized,
        );

        if note.len() > MAX_NOTE_SIZE {
            return err!(NoteError::TooLong);
        }

        note_account.data = note;
        Ok(())
    }

    pub fn delete_note(ctx: Context<DeleteNote>) -> Result<()> {
        let note_account = &mut ctx.accounts.note_account;
        require_keys_eq!(
            note_account.authority,
            ctx.accounts.signer.key(),
            NoteError::Unauthorized,
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNote<'info> {
    #[account(init, payer=signer, space=8+32+4+MAX_NOTE_SIZE)]
    note_account: Account<'info, NoteState>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateNote<'info> {
    #[account(mut)]
    note_account: Account<'info, NoteState>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteNote<'info> {
    #[account(mut, close=signer)]
    note_account: Account<'info, NoteState>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[account]
struct NoteState {
    pub authority: Pubkey,
    pub data: String,
}

//! The purpose of this program is to create a new account supplied in the accounts slice
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};
use solana_system_interface::{instruction as system_instruction, program as system_program};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let payer = next_account_info(accounts_iter)?;
    let new_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Validate accounts
    if !payer.is_signer {
        msg!("[ERROR] Payer is not a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if !new_account.is_writable {
        msg!("[ERROR] New account is not writable");
        return Err(ProgramError::InvalidAccountData);
    }

    if !system_program.key.eq(&system_program::id()) {
        msg!("ERROR: System program is not the correct program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if new_account.lamports() > 0 {
        msg!("[ERROR] New account is already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    msg!("Program invoked {}:", program_id);
    msg!("\tCreating a new account pubkey: {}", new_account.key);

    let min_rent = Rent::get()?.minimum_balance(0);
    msg!("\tMinimum rent: {}", min_rent);

    let ix = system_instruction::create_account(
        payer.key,
        new_account.key,
        min_rent,
        0,
        system_program.key,
    );

    msg!("\tCreating account with cross program invocation");

    invoke(
        &ix,
        &[payer.clone(), new_account.clone(), system_program.clone()],
    )?;

    msg!("\tAccount created successfully");

    Ok(())
}

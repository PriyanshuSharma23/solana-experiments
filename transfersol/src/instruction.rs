use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::program::invoke;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use solana_system_interface::instruction;

pub fn transfer_sol_with_cpi(accounts: &[AccountInfo], amount: u64) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let payer_account = next_account_info(accounts_iter).inspect_err(|err| {
        msg!(&format!("[ERROR] Failed to read the payer account: {err}"));
    })?;

    let receiver_account = next_account_info(accounts_iter).inspect_err(|err| {
        msg!(&format!(
            "[ERROR] Failed to read the receiver account: {err}"
        ));
    })?;

    let system_program = next_account_info(accounts_iter).inspect_err(|err| {
        msg!(&format!(
            "[ERROR] Failed to read the system program account: {err}"
        ));
    })?;

    let ix = instruction::transfer(payer_account.key, receiver_account.key, amount);

    invoke(
        &ix,
        &[
            payer_account.clone(),
            receiver_account.clone(),
            system_program.clone(),
        ],
    )
    .inspect_err(|err| {
        msg!(&format!(
            "[ERROR] Failed to invoke the system program to send SOL: {err}",
        ));
    })
}

/// The sender account should have the owner id be equal to the program ID.
/// The receiver account should have the owner id be equal to the program ID.
pub fn transfer_sol_with_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let _ = next_account_info(accounts_iter);

    let payer_account = next_account_info(accounts_iter).inspect_err(|err| {
        msg!(&format!("[ERROR] Failed to read the payer account: {err}"));
    })?;

    if payer_account.owner != program_id {
        msg!("[ERROR] The payer account owner is not the program");
        return Err(ProgramError::InvalidInstructionData);
    }

    let receiver_account = next_account_info(accounts_iter).inspect_err(|err| {
        msg!(&format!(
            "[ERROR] Failed to read the receiver account: {err}"
        ));
    })?;

    if receiver_account.owner != program_id {
        msg!("[ERROR] The receiver account owner is not the program");
        return Err(ProgramError::InvalidInstructionData);
    }

    let payer_lamports = &mut **payer_account.try_borrow_mut_lamports()?;
    let receiver_lamports = &mut **receiver_account.try_borrow_mut_lamports()?;

    if *payer_lamports < amount {
        msg!("[ERROR] The payer account does not have enough SOL");
        return Err(ProgramError::InvalidInstructionData);
    }

    *payer_lamports -= amount;
    *receiver_lamports += amount;

    Ok(())
}

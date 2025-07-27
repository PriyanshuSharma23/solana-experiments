use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// PROGRAM ID: 4vpSg1TzFrETdcCcjuUoisNUnXPP5LfABUGZotxVSHNC

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Counter {
    pub count: u32,
}

entrypoint!(process_instructions);

fn process_instructions(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    if !counter_account.is_writable {
        return Err(ProgramError::InvalidAccountData);
    }

    let mut data = counter_account.data.borrow_mut();
    let mut counter = Counter::try_from_slice(&data)?;
    msg!("Counter: {}", counter.count);

    counter.count += 1;
    counter.serialize(&mut &mut data[..])?;

    Ok(())
}
